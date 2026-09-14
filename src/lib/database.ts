import { env } from "cloudflare:workers";
import type { PublicRecord, RecordType, SourceCitation } from "./types";

type RecordRow = {
  id: string;
  type: RecordType;
  slug: string;
  title: string;
  summary: string;
  body: string | null;
  payload: string;
  status: PublicRecord["status"];
  published_at: string | null;
  last_verified_at: string | null;
  review_due_at: string | null;
  meta_title: string | null;
  meta_description: string | null;
};

function parsePayload(value: string): Record<string, unknown> {
  try {
    const parsed: unknown = JSON.parse(value);
    return typeof parsed === "object" && parsed !== null && !Array.isArray(parsed)
      ? (parsed as Record<string, unknown>)
      : {};
  } catch {
    return {};
  }
}

function toPublicRecord(row: RecordRow): PublicRecord {
  return {
    id: row.id,
    type: row.type,
    slug: row.slug,
    title: row.title,
    summary: row.summary,
    body: row.body,
    payload: parsePayload(row.payload),
    status: row.status,
    publishedAt: row.published_at,
    lastVerifiedAt: row.last_verified_at,
    reviewDueAt: row.review_due_at,
    metaTitle: row.meta_title,
    metaDescription: row.meta_description,
  };
}

const publicColumns = `
  id, type, slug, title, summary, body, payload, status,
  published_at, last_verified_at, review_due_at, meta_title, meta_description
`;

export async function listPublishedRecords(type?: RecordType, query = ""): Promise<PublicRecord[]> {
  const normalizedQuery = `%${query.trim().replaceAll("%", "\\%").replaceAll("_", "\\_")}%`;
  const statement = type
    ? env.DB.prepare(
        `SELECT ${publicColumns} FROM records
         WHERE type = ?1 AND status = 'published' AND deleted_at IS NULL
           AND (?2 = '%%' OR title LIKE ?2 ESCAPE '\\' OR summary LIKE ?2 ESCAPE '\\')
         ORDER BY published_at DESC, title ASC LIMIT 100`,
      ).bind(type, normalizedQuery)
    : env.DB.prepare(
        `SELECT ${publicColumns} FROM records
         WHERE status = 'published' AND deleted_at IS NULL
           AND (?1 = '%%' OR title LIKE ?1 ESCAPE '\\' OR summary LIKE ?1 ESCAPE '\\')
         ORDER BY published_at DESC, title ASC LIMIT 100`,
      ).bind(normalizedQuery);

  try {
    const result = await statement.all<RecordRow>();
    return result.results.map(toPublicRecord);
  } catch (error) {
    console.error(JSON.stringify({ event: "published_records_unavailable", message: String(error) }));
    return [];
  }
}

export async function getPublishedRecord(type: RecordType, slug: string): Promise<PublicRecord | null> {
  try {
    const row = await env.DB.prepare(
      `SELECT ${publicColumns} FROM records
       WHERE type = ?1 AND slug = ?2 AND status = 'published' AND deleted_at IS NULL LIMIT 1`,
    )
      .bind(type, slug)
      .first<RecordRow>();
    return row ? toPublicRecord(row) : null;
  } catch (error) {
    console.error(JSON.stringify({ event: "published_record_unavailable", message: String(error) }));
    return null;
  }
}

export async function getRecordCitations(recordId: string): Promise<SourceCitation[]> {
  try {
    const result = await env.DB.prepare(
      `SELECT s.id, s.title, s.publisher, s.url, s.publication_date,
              s.accessed_at, s.classification, c.claim, c.public_label
       FROM citations c JOIN sources s ON s.id = c.source_id
       WHERE c.record_id = ?1
       ORDER BY s.classification ASC, s.publication_date DESC`,
    )
      .bind(recordId)
      .all<{
        id: string;
        title: string;
        publisher: string;
        url: string | null;
        publication_date: string | null;
        accessed_at: string;
        classification: "primary" | "secondary";
        claim: string | null;
        public_label: string | null;
      }>();
    return result.results.map((row) => ({
      id: row.id,
      title: row.title,
      publisher: row.publisher,
      url: row.url,
      publicationDate: row.publication_date,
      accessedAt: row.accessed_at,
      classification: row.classification,
      claim: row.claim,
      publicLabel: row.public_label,
    }));
  } catch (error) {
    console.error(JSON.stringify({ event: "record_citations_unavailable", message: String(error) }));
    return [];
  }
}

export async function listAdminRecords(): Promise<PublicRecord[]> {
  const result = await env.DB.prepare(
    `SELECT ${publicColumns} FROM records WHERE deleted_at IS NULL ORDER BY updated_at DESC LIMIT 200`,
  ).all<RecordRow>();
  return result.results.map(toPublicRecord);
}

export async function getDashboardCounts(): Promise<Record<string, number>> {
  try {
    const result = await env.DB.prepare(
      `SELECT status, COUNT(*) AS count FROM records WHERE deleted_at IS NULL GROUP BY status`,
    ).all<{ status: string; count: number }>();
    return Object.fromEntries(result.results.map((row) => [row.status, row.count]));
  } catch {
    return {};
  }
}
