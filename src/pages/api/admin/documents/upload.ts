import { env } from "cloudflare:workers";
import type { APIRoute } from "astro";
import { requireAdmin } from "../../../../lib/auth";
import { apiError, json, requireSameOrigin } from "../../../../lib/http";

const MAX_BYTES = 10 * 1024 * 1024;
const allowedTypes = new Set(["application/pdf", "image/jpeg", "image/png", "image/webp"]);

export const PUT: APIRoute = async ({ request }) => {
  const originError = requireSameOrigin(request);
  if (originError) return originError;
  const identity = await requireAdmin(request);
  const encodedFilename = request.headers.get("X-Filename")?.trim() ?? "";
  let filename = "";
  try {
    filename = decodeURIComponent(encodedFilename);
  } catch {
    return apiError(422, "VALIDATION_FAILED", "The filename is not valid.");
  }
  const contentType = request.headers.get("Content-Type")?.split(";")[0] ?? "";
  const contentLength = Number(request.headers.get("Content-Length") ?? "0");
  const checksum = request.headers.get("X-Content-SHA256")?.trim().toLowerCase() ?? "";
  if (!filename || filename.length > 180) return apiError(422, "VALIDATION_FAILED", "A safe filename is required.");
  if (!allowedTypes.has(contentType)) return apiError(422, "VALIDATION_FAILED", "Only PDF, JPEG, PNG, and WebP files are accepted.");
  if (!request.body || !Number.isFinite(contentLength) || contentLength < 1 || contentLength > MAX_BYTES) return apiError(413, "FILE_TOO_LARGE", "Files must be between 1 byte and 10 MB.");
  if (!/^[a-f0-9]{64}$/.test(checksum)) return apiError(422, "VALIDATION_FAILED", "A SHA-256 file checksum is required.");

  const id = crypto.randomUUID();
  const safeName = filename.normalize("NFKC").replace(/[^a-zA-Z0-9._-]+/g, "-").slice(0, 120);
  const storageKey = `quarantine/${new Date().toISOString().slice(0, 10)}/${id}-${safeName}`;
  const now = new Date().toISOString();

  try {
    await env.FILES.put(storageKey, request.body, {
      httpMetadata: { contentType, contentDisposition: `attachment; filename="${safeName}"` },
      customMetadata: { uploadedBy: identity.email, originalFilename: filename, checksumSha256: checksum },
      sha256: checksum,
    });
    await env.DB.prepare(
      `INSERT INTO documents (id, title, storage_key, original_filename, display_filename, mime_type, byte_size,
       checksum_sha256, language, accessibility_status, visibility, created_at, updated_at)
       VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, 'en', 'unchecked', 'quarantined', ?9, ?9)`,
    ).bind(id, filename, storageKey, filename, safeName, contentType, contentLength, checksum, now).run();
    return json({ id, filename: safeName, visibility: "quarantined" }, { status: 201 });
  } catch (error) {
    await env.FILES.delete(storageKey).catch(() => undefined);
    console.error(JSON.stringify({ event: "document_upload_failed", message: String(error) }));
    return apiError(500, "INTERNAL_ERROR", "The document could not be stored.");
  }
};
