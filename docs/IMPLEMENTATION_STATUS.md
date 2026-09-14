# Implementation Status

**Status:** Local MVP complete; external provisioning pending  
**Last updated:** 2026-09-13

## Complete in this repository

- Public home, topic directories, record detail pages, search, policy pages, sitemap, robots rules, canonical metadata, Open Graph metadata, and structured data.
- Responsive public interface with desktop and mobile navigation.
- Protected editorial dashboard for creating, editing, reviewing, publishing, archiving, and restoring records.
- Source citation and verification-date publication gates.
- D1 schema, generated migration, local migration, and private local seed data.
- R2 document upload and download foundations, including quarantine storage, type and size limits, streamed uploads, SHA-256 verification, and public-only downloads.
- Cloudflare Access assertion verification, email allowlist, database roles, same-origin write protection, private admin caching, and security headers.
- Separate local, preview, and production binding definitions.
- Unit tests, desktop/mobile browser tests, build checks, deployment dry runs, startup profiling, and continuous integration.
- Product, requirements, architecture, content, research, accessibility, privacy, security, SEO, testing, deployment, and launch documentation.

## Intentionally not complete

- No unverified real-world facts about Pila are published or bundled as examples.
- The correction form remains closed until the project has a monitored public email and spam protection.
- Cloudflare preview and production resources have not been created because Wrangler is not currently authenticated on this computer.
- The custom domain, DNS, Access applications, administrator identities, and Access audiences require the project owners' Cloudflare account and final choices.
- Launch content collection, source review, ownership assignments, legal/editorial review, and the final launch checklist still require human decisions.

## Next owner actions

1. Sign in to Cloudflare with `npx wrangler login` or provide a narrowly scoped API token through the local environment.
2. Decide which Cloudflare account owns the project and confirm control of `betterpila.org` or choose another domain.
3. Replace all `REPLACE_WITH_…` values in `wrangler.jsonc` without committing secrets.
4. Create preview and production D1/R2 resources, apply migrations, and configure two Access-protected route groups: `/admin*` and `/api/admin*`.
5. Deploy preview, use synthetic content to complete acceptance testing, then begin the sourced Pila research workflow.
