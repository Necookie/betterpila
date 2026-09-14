import { env } from "cloudflare:workers";
import type { APIRoute } from "astro";
import { canPublish, requireAdmin } from "../../../../../lib/auth";
import { apiError, json, requireSameOrigin } from "../../../../../lib/http";

const actions = ["request-review", "publish", "archive", "restore"] as const;
type Action = (typeof actions)[number];

export const POST: APIRoute = async ({ request, params }) => {
  const originError = requireSameOrigin(request);
  if (originError) return originError;
  const identity = await requireAdmin(request);
  const id = params.id ?? "";
  const action = params.action as Action;
  if (!actions.includes(action)) return apiError(404, "NOT_FOUND", "Action not found.");

  const record = await env.DB.prepare("SELECT id, status, last_verified_at FROM records WHERE id = ?1 AND deleted_at IS NULL LIMIT 1").bind(id).first<{ id: string; status: string; last_verified_at: string | null }>();
  if (!record) return apiError(404, "NOT_FOUND", "Record not found.");
  const citation = await env.DB.prepare("SELECT COUNT(*) AS count FROM citations WHERE record_id = ?1").bind(id).first<{ count: number }>();

  if ((action === "publish" || action === "archive" || action === "restore") && !canPublish(identity.role)) {
    return apiError(403, "FORBIDDEN", "Reviewer permission is required.");
  }
  if ((action === "request-review" || action === "publish") && (!record.last_verified_at || !citation?.count)) {
    return apiError(422, "VALIDATION_FAILED", "Add a source and verification date before review or publication.");
  }

  const transitions: Record<Action, { from: string[]; to: string }> = {
    "request-review": { from: ["draft"], to: "in_review" },
    publish: { from: ["in_review", "draft", "archived"], to: "published" },
    archive: { from: ["published", "in_review", "draft"], to: "archived" },
    restore: { from: ["archived"], to: "draft" },
  };
  const transition = transitions[action];
  if (!transition.from.includes(record.status)) return apiError(409, "CONFLICT", `A ${record.status.replace("_", " ")} record cannot perform this action.`);

  const now = new Date().toISOString();
  const update = env.DB.prepare(
    `UPDATE records SET
      status = ?1,
      published_at = CASE WHEN ?1 = 'published' THEN COALESCE(published_at, ?2) ELSE published_at END,
      reviewed_by = CASE WHEN ?3 = 1 THEN (SELECT id FROM users WHERE lower(email) = ?4 LIMIT 1) ELSE reviewed_by END,
      updated_at = ?2
     WHERE id = ?5`,
  ).bind(transition.to, now, canPublish(identity.role) ? 1 : 0, identity.email, id);
  const revision = env.DB.prepare(
    "INSERT INTO revisions (id, record_id, actor_id, action, reason, request_id, created_at) VALUES (?1, ?2, (SELECT id FROM users WHERE lower(email) = ?3 LIMIT 1), ?4, ?5, ?6, ?7)",
  ).bind(crypto.randomUUID(), id, identity.email, action, `Status changed from ${record.status} to ${transition.to}`, request.headers.get("cf-ray") ?? crypto.randomUUID(), now);

  try {
    await env.DB.batch([update, revision]);
    return json({ id, status: transition.to });
  } catch (error) {
    console.error(JSON.stringify({ event: "admin_record_transition_failed", message: String(error) }));
    return apiError(500, "INTERNAL_ERROR", "The status could not be changed.");
  }
};
