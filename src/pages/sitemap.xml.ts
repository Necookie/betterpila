import { listPublishedRecords } from "../lib/database";
import { publicPath } from "../lib/format";

const staticPaths = ["/", "/officials", "/offices", "/budgets", "/projects", "/ordinances", "/resolutions", "/about", "/methodology", "/accessibility", "/privacy"];
const escapeXml = (value: string) => value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");

export async function GET() {
  const records = await listPublishedRecords();
  const entries = [
    ...staticPaths.map((path) => ({ path, modified: null as string | null })),
    ...records.map((record) => ({ path: publicPath(record.type, record.slug), modified: record.lastVerifiedAt ?? record.publishedAt })),
  ];
  const urls = entries.map(({ path, modified }) => `<url><loc>${escapeXml(new URL(path, "https://betterpila.org").toString())}</loc>${modified ? `<lastmod>${escapeXml(modified)}</lastmod>` : ""}</url>`).join("");
  return new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`, {
    headers: { "Content-Type": "application/xml; charset=utf-8", "Cache-Control": "public, max-age=300" },
  });
}

