import { env } from "cloudflare:workers";
import { createRemoteJWKSet, jwtVerify } from "jose";
import type { AdminIdentity, AdminRole } from "./types";

function allowedEmails(): Set<string> {
  return new Set(
    env.ADMIN_EMAILS.split(",")
      .map((email) => email.trim().toLowerCase())
      .filter(Boolean),
  );
}

async function roleForEmail(email: string): Promise<AdminRole> {
  try {
    const row = await env.DB.prepare(
      "SELECT role FROM users WHERE lower(email) = ?1 AND active = 1 LIMIT 1",
    )
      .bind(email.toLowerCase())
      .first<{ role: AdminRole }>();
    return row?.role ?? "editor";
  } catch {
    return "editor";
  }
}

export async function getAdminIdentity(request: Request): Promise<AdminIdentity | null> {
  const url = new URL(request.url);
  if (
    env.ENVIRONMENT === "development" &&
    (url.hostname === "localhost" || url.hostname === "127.0.0.1") &&
    env.DEV_ADMIN_EMAIL
  ) {
    return { email: env.DEV_ADMIN_EMAIL.toLowerCase(), role: await roleForEmail(env.DEV_ADMIN_EMAIL) };
  }

  const token = request.headers.get("Cf-Access-Jwt-Assertion");
  const configured = env.CF_ACCESS_TEAM_DOMAIN && env.CF_ACCESS_AUD;
  if (!token || !configured) return null;

  try {
    const issuer = `https://${env.CF_ACCESS_TEAM_DOMAIN}.cloudflareaccess.com`;
    const keySet = createRemoteJWKSet(new URL(`${issuer}/cdn-cgi/access/certs`));
    const { payload } = await jwtVerify(token, keySet, {
      issuer,
      audience: env.CF_ACCESS_AUD,
    });
    const email = typeof payload.email === "string" ? payload.email.toLowerCase() : "";
    if (!email || !allowedEmails().has(email)) return null;
    return { email, role: await roleForEmail(email) };
  } catch (error) {
    console.error(JSON.stringify({ event: "access_assertion_rejected", message: String(error) }));
    return null;
  }
}

export async function requireAdmin(request: Request): Promise<AdminIdentity> {
  const identity = await getAdminIdentity(request);
  if (!identity) throw new Response("Administrative access is required.", { status: 401 });
  return identity;
}

export function canPublish(role: AdminRole): boolean {
  return role === "administrator" || role === "reviewer";
}

export function canManageUsers(role: AdminRole): boolean {
  return role === "administrator";
}
