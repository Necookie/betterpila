export const GET = () =>
  new Response("User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /api/admin\nDisallow: /search\nSitemap: https://betterpila.org/sitemap.xml\n", {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });

