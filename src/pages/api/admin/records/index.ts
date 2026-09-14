import { env } from "cloudflare:workers";
import type { APIRoute } from "astro";
import { requireAdmin } from "../../../../lib/auth";
import { listAdminRecords } from "../../../../lib/database";
import { apiError, json, requireSameOrigin } from "../../../../lib/http";
import { recordInputSchema } from "../../../../lib/validation";
import { z } from "zod";

const requestSchema = recordInputSchema.extend({
  source: z
    .object({
      title: z.string().trim().min(2).max(180),
      publisher: z.string().trim().min(2).max(160),
      url: z.url(),
      publicationDate: z.iso.date().nullable().optional(),
    })
    .nullable()
    .optional(),
});

export const GET: APIRoute = async ({ request }) => {
  await requireAdmin(request);
  return json({ records: await listAdminRecords() });
};

export const POST: APIRoute = async ({ request }) => {
  const originError = requireSameOrigin(request);
  if (originError) return originError;
  const identity = await requireAdmin(request);
  const parsed = requestSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return apiError(422, "VALIDATION_FAILED", "Review the highlighted fields.", z.flattenError(parsed.error).fieldErrors);

  const now = new Date().toISOString();
  const recordId = crypto.randomUUID();
  const input = parsed.data;
  const statements = [
    env.DB.prepare(
      `INSERT INTO records (
        id, type, slug, title, summary, body, payload, status, last_verified_at,
        review_due_at, meta_title, meta_description, created_by, created_at, updated_at
      ) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, 'draft', ?8, ?9, ?10, ?11,
        (SELECT id FROM users WHERE lower(email) = ?12 LIMIT 1), ?13, ?13)`,
    ).bind(
      recordId,
      input.type,
      input.slug,
      input.title,
      input.summary,
      input.body ?? null,
      JSON.stringify(input.payload),
      input.lastVerifiedAt ?? null,
      input.reviewDueAt ?? null,
      input.metaTitle ?? null,
      input.metaDescription ?? null,
      identity.email,
      now,
    ),
  ];

  if (input.source) {
    const sourceId = crypto.randomUUID();
    statements.push(
      env.DB.prepare(
        `INSERT INTO sources (
          id, title, publisher, url, source_type, classification, publication_date,
          accessed_at, availability, created_at, updated_at
        ) VALUES (?1, ?2, ?3, ?4, 'web', 'primary', ?5, ?6, 'available', ?7, ?7)`,
      ).bind(sourceId, input.source.title, input.source.publisher, input.source.url, input.source.publicationDate ?? null, input.lastVerifiedAt ?? now.slice(0, 10), now),
      env.DB.prepare(
        "INSERT INTO citations (id, record_id, source_id, public_label, created_at) VALUES (?1, ?2, ?3, ?4, ?5)",
      ).bind(crypto.randomUUID(), recordId, sourceId, input.source.title, now),
    );
  }

  statements.push(
    env.DB.prepare(
      "INSERT INTO revisions (id, record_id, actor_id, action, after_json, request_id, created_at) VALUES (?1, ?2, (SELECT id FROM users WHERE lower(email) = ?3 LIMIT 1), 'created', ?4, ?5, ?6)",
    ).bind(crypto.randomUUID(), recordId, identity.email, JSON.stringify(input), request.headers.get("cf-ray") ?? crypto.randomUUID(), now),
  );

  try {
    await env.DB.batch(statements);
    return json({ id: recordId, status: "draft" }, { status: 201 });
  } catch (error) {
    console.error(JSON.stringify({ event: "admin_record_create_failed", message: String(error) }));
    return String(error).includes("UNIQUE")
      ? apiError(409, "CONFLICT", "That slug is already used in this section.")
      : apiError(500, "INTERNAL_ERROR", "The draft could not be saved.");
  }
};
