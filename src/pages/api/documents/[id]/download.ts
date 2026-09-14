import { env } from "cloudflare:workers";
import type { APIRoute } from "astro";

export const GET: APIRoute = async ({ params }) => {
  const row = await env.DB.prepare("SELECT storage_key, display_filename, mime_type FROM documents WHERE id = ?1 AND visibility = 'public' LIMIT 1").bind(params.id ?? "").first<{ storage_key: string; display_filename: string; mime_type: string }>();
  if (!row) return new Response("Document not found.", { status: 404 });
  const object = await env.FILES.get(row.storage_key);
  if (!object) return new Response("Document file is temporarily unavailable.", { status: 503 });
  const headers = new Headers();
  object.writeHttpMetadata(headers);
  headers.set("Content-Type", row.mime_type);
  headers.set("Content-Disposition", `attachment; filename="${row.display_filename.replaceAll('"', "")}"`);
  headers.set("Cache-Control", "public, max-age=3600");
  headers.set("ETag", object.httpEtag);
  return new Response(object.body, { headers });
};

