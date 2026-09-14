export function json(data: unknown, init: ResponseInit = {}): Response {
  const headers = new Headers(init.headers);
  headers.set("Content-Type", "application/json; charset=utf-8");
  headers.set("Cache-Control", "private, no-store");
  return new Response(JSON.stringify(data), { ...init, headers });
}

export function apiError(status: number, code: string, message: string, fields?: unknown): Response {
  return json({ error: { code, message, ...(fields ? { fields } : {}) } }, { status });
}

export function requireSameOrigin(request: Request): Response | null {
  const requestUrl = new URL(request.url);
  const origin = request.headers.get("Origin");
  const fetchSite = request.headers.get("Sec-Fetch-Site");

  if (origin && origin !== requestUrl.origin) {
    return apiError(403, "CROSS_ORIGIN_REQUEST", "Cross-origin administrative requests are not allowed.");
  }
  if (fetchSite === "cross-site") {
    return apiError(403, "CROSS_ORIGIN_REQUEST", "Cross-origin administrative requests are not allowed.");
  }
  return null;
}
