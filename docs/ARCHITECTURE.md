# System Architecture

**Status:** Proposed  
**Last updated:** 2026-09-13

## 1. Decision summary

Better Pila will use a Cloudflare-native, TypeScript-based architecture to meet the MVP requirement for free deployment without a traditional sleeping application server.

| Concern | Selection |
| --- | --- |
| Web framework | Astro with TypeScript |
| Public rendering | Server-rendered or prerendered HTML, cached at the edge |
| Admin interface | React components within the Astro application |
| Styling | Tailwind CSS |
| Runtime/API | Cloudflare Workers |
| Database | Cloudflare D1 |
| Query and migrations | Drizzle ORM and Drizzle Kit |
| Files | Cloudflare R2 |
| Admin identity perimeter | Cloudflare Access |
| Abuse protection | Cloudflare Turnstile and application rate limits |
| Tests | Vitest and Playwright |
| Delivery | GitHub with Cloudflare Workers Builds or GitHub Actions |

## 2. Context diagram

```text
Search engines ─┐
Residents ──────┼──> Public Astro pages ─┐
Researchers ────┘                        │
                                         ├──> Cloudflare Worker ──> D1
Maintainers ──> Cloudflare Access ──> Admin dashboard            └──> R2

GitHub ──> automated checks ──> Cloudflare deployment
```

## 3. Major components

### 3.1 Public web application

Responsibilities:

- Render public index and detail pages as complete HTML.
- Query published records only.
- Apply canonical URLs, metadata, JSON-LD, breadcrumbs, and sitemap rules.
- Provide accessible search and filters.
- Present source citations and verification dates.
- Cache safe public responses at the edge.

The public layer must never trust a client-provided publication state or expose administrative fields.

### 3.2 Administration application

Responsibilities:

- Provide forms, tables, preview, review, publication, archival, and restoration.
- Enforce roles and record-level permissions on the server.
- Validate required fields and source evidence.
- Write revision and activity records.
- Manage direct-to-R2 uploads using short-lived, scoped authorization.
- Report stale records and operational warnings.

The admin interface may use React for complex forms. Public pages should not inherit the admin JavaScript bundle.

### 3.3 Application services

Business rules belong in framework-independent TypeScript services, including:

- Publication eligibility.
- Slug generation and redirect creation.
- Source verification rules.
- Record freshness calculations.
- Search query normalization.
- Export generation.
- Cache invalidation.

Routes should coordinate these services rather than duplicating business rules.

### 3.4 D1 database

D1 stores structured records, relationships, workflow state, user mappings, and audit metadata. Database access must use parameterized queries. Schema changes must be applied through migrations.

Indexes must cover common filters such as `status`, `slug`, `published_at`, `last_verified_at`, `fiscal_year`, `document_type`, and foreign keys used by public lists.

### 3.5 R2 object storage

R2 stores uploaded public documents and images. Private, quarantined, and draft files must not be exposed through a public bucket URL.

Public delivery should use application-controlled URLs or a dedicated public asset domain. File metadata and checksums remain in D1.

### 3.6 Identity and authorization

Cloudflare Access protects the administrative route boundary. The application must additionally:

- Verify Access assertions or trusted identity headers.
- Map the verified identity to an active local user.
- Apply local administrator, reviewer, and editor permissions.
- Reject missing, expired, untrusted, or unauthorized identity data.

Perimeter authentication does not replace application authorization.

## 4. Rendering and caching

### Public pages

- Render complete HTML at the edge.
- Cache anonymous GET responses where safe.
- Use cache keys that exclude irrelevant tracking parameters.
- Purge or version affected pages after publication changes.
- Never cache private previews or admin responses in a public cache.

### Admin pages

- Use `Cache-Control: private, no-store`.
- Require authentication on every request.
- Prevent indexing with response headers and page metadata.

### Static assets

- Use content-hashed filenames.
- Cache immutable assets for a long duration.
- Give public documents stable URLs while retaining replacement history in metadata.

## 5. Suggested source layout

```text
src/
  components/
    public/
    admin/
    seo/
  layouts/
  pages/
    index.astro
    officials/
    offices/
    budgets/
    projects/
    ordinances/
    documents/
    admin/
    api/
  domain/
    publication/
    sources/
    permissions/
    freshness/
  data/
    schema/
    repositories/
  lib/
    auth/
    storage/
    validation/
    observability/
  styles/
tests/
  unit/
  integration/
  e2e/
drizzle/
public/
```

## 6. Environment separation

| Environment | Purpose | Data |
| --- | --- | --- |
| Local | Development and automated testing | Local D1/R2 emulation with fixtures |
| Preview | Pull-request and stakeholder review | Synthetic or sanitized data only |
| Production | Public service | Approved production content |

Production secrets and data must not be copied into preview environments.

## 7. Failure behavior

- If D1 is temporarily unavailable, cached public pages should remain usable where possible.
- If a public detail record cannot be found, return a useful 404 page.
- If R2 is unavailable, retain page metadata and present a clear download error.
- If Access identity validation fails, deny access; do not fall back to a weaker login.
- If free-tier usage approaches an operational threshold, alert maintainers and degrade nonessential features before core public pages.

## 8. Portability

Cloudflare-specific operations must be wrapped behind interfaces for database, object storage, identity, and cache invalidation. Exports must include relational data and file manifests so a future move to another runtime, SQL database, or object store is feasible.

## 9. Deferred architecture

The MVP does not require Redis, background queues, a third-party search engine, microservices, public authentication, a separate API service, or a native mobile application.

