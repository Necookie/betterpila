import { env } from "cloudflare:workers";
import type { APIRoute } from "astro";
import { requireAdmin } from "../../../../lib/auth";
import { apiError, json, requireSameOrigin } from "../../../../lib/http";
import { recordInputSchema } from "../../../../lib/validation";
import { z } from "zod";

const updateSchema = recordInputSchema.omit({ status: true }).extend({
  source: z.object({ title: z.string().trim().min(2), publisher: z.string().trim().min(2), url: z.url(), publicationDate: z.iso.date().nullable().optional() }).nullable().optional(),
});

export const PATCH: APIRoute = async ({ request, params }) => {
  const originError = requireSameOrigin(request);
  if (originError) return originError;
  const identity = await requireAdmin(request);
  const id = params.id ?? "";
  const before = await env.DB.prepare("SELECT * FROM records WHERE id = ?1 AND deleted_at IS NULL LIMIT 1").bind(id).first<Record<string, unknown>>();
  if (!before) return apiError(404, "NOT_FOUND", "Record not found.");

  const parsed = updateSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return apiError(422, "VALIDATION_FAILED", "Review the highlighted fields.", z.flattenError(parsed.error).fieldErrors);
  const input = parsed.data;
  const now = new Date().toISOString();
  const statements = [
    env.DB.prepare(
      `UPDATE records SET type = ?2, slug = ?3, title = ?4, summary = ?5, body = ?6,
       payload = ?7, last_verified_at = ?8, review_due_at = ?9, meta_title = ?10,
       meta_description = ?11, status = 'draft', reviewed_by = NULL, updated_at = ?12
       WHERE id = ?1`,
    ).bind(id, input.type, input.slug, input.title, input.summary, input.body ?? null, JSON.stringify(input.payload), input.lastVerifiedAt ?? null, input.reviewDueAt ?? null, input.metaTitle ?? null, input.metaDescription ?? null, now),
  ];

  if (input.source) {
    const sourceId = crypto.randomUUID();
    statements.push(
      env.DB.prepare(
        `INSERT INTO sources (id, title, publisher, url, source_type, classification, publication_date, accessed_at, availability, created_at, updated_at)
         VALUES (?1, ?2, ?3, ?4, 'web', 'primary', ?5, ?6, 'available', ?7, ?7)`,
      ).bind(sourceId, input.source.title, input.source.publisher, input.source.url, input.source.publicationDate ?? null, input.lastVerifiedAt ?? now.slice(0, 10), now),
      env.DB.prepare("INSERT INTO citations (id, record_id, source_id, public_label, created_at) VALUES (?1, ?2, ?3, ?4, ?5)").bind(crypto.randomUUID(), id, sourceId, input.source.title, now),
    );
  }

  statements.push(
    env.DB.prepare("INSERT INTO revisions (id, record_id, actor_id, action, before_json, after_json, request_id, created_at) VALUES (?1, ?2, (SELECT id FROM users WHERE lower(email) = ?3 LIMIT 1), 'updated', ?4, ?5, ?6, ?7)").bind(crypto.randomUUID(), id, identity.email, JSON.stringify(before), JSON.stringify(input), request.headers.get("cf-ray") ?? crypto.randomUUID(), now),
  );

  try {
    await env.DB.batch(statements);
    return json({ id, status: "draft" });
  } catch (error) {
    console.error(JSON.stringify({ event: "admin_record_update_failed", message: String(error) }));
    return String(error).includes("UNIQUE") ? apiError(409, "CONFLICT", "That slug is already used in this section.") : apiError(500, "INTERNAL_ERROR", "The record could not be updated.");
  }
};
