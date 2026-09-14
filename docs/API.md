# Internal API Specification

**Status:** Proposed  
**Last updated:** 2026-09-13

## 1. Scope

Better Pila is a single web application, not an API-first platform. These endpoints support the admin dashboard, public search, controlled downloads, and future integrations. A public general-purpose API is outside the MVP.

## 2. Conventions

- Base path: `/api`.
- JSON request and response bodies use UTF-8.
- Dates and timestamps use ISO 8601.
- Monetary values use integer minor units plus a currency code.
- Pagination uses an opaque cursor where practical.
- State-changing requests require authenticated identity, authorization, origin checks, and anti-CSRF protection where applicable.
- All input is validated on the server.
- Internal error details and stack traces are never returned publicly.

## 3. Public read endpoints

Public pages should normally load data during server rendering. Public JSON endpoints may include:

| Method | Path | Purpose |
| --- | --- | --- |
| `GET` | `/api/search` | Search published records |
| `GET` | `/api/health` | Minimal service health response |
| `GET` | `/api/documents/{id}/download` | Controlled public document delivery |

Only published, public fields may be serialized.

Search accepts a bounded `q` value and optional validated `type`, `year`, `status`, and `cursor` values. It must enforce pagination, timeout, and rate limits.

## 4. Administrative endpoints

Resources follow a consistent pattern under `/api/admin/{resource}`:

| Method | Pattern | Purpose |
| --- | --- | --- |
| `GET` | `/api/admin/{resource}` | List authorized records |
| `POST` | `/api/admin/{resource}` | Create a draft |
| `GET` | `/api/admin/{resource}/{id}` | Read an authorized record |
| `PATCH` | `/api/admin/{resource}/{id}` | Update a record |
| `POST` | `/api/admin/{resource}/{id}/request-review` | Submit a draft for review |
| `POST` | `/api/admin/{resource}/{id}/publish` | Publish an approved record |
| `POST` | `/api/admin/{resource}/{id}/archive` | Archive a record |
| `POST` | `/api/admin/{resource}/{id}/restore` | Restore an archived/deleted record |
| `GET` | `/api/admin/{resource}/{id}/revisions` | Read revision history |

Allowed resource names are explicitly registered; arbitrary table access is prohibited.

## 5. Upload flow

1. Admin requests upload authorization with filename, size, and declared media type.
2. Server checks identity, permission, extension, media type, and size limit.
3. Server returns a short-lived, scoped upload instruction.
4. Client uploads to a private or quarantine R2 prefix.
5. Server verifies object metadata and checksum.
6. Reviewer promotes the file to public visibility as part of publication.

The browser never receives permanent R2 credentials.

## 6. Error format

```json
{
  "error": {
    "code": "VALIDATION_FAILED",
    "message": "Review the highlighted fields.",
    "requestId": "opaque-id",
    "fields": {
      "sourceUrl": ["A source is required before publication."]
    }
  }
}
```

Expected categories include `VALIDATION_FAILED` (422), `AUTHENTICATION_REQUIRED` (401), `FORBIDDEN` (403), `NOT_FOUND` (404), `CONFLICT` (409), `RATE_LIMITED` (429), and `INTERNAL_ERROR` (500).

## 7. Concurrency and idempotency

Administrative updates should use an entity version or `updated_at` precondition. Conflicting edits return `409` instead of silently overwriting another editor's work.

Publication, archive, restore, and upload-finalization actions should accept or generate idempotency keys so retries do not create duplicate revisions or files.

## 8. Audit and observability

Every administrative mutation records the verified actor, action, target, outcome, timestamp, request identifier, and reason when required.

Logs must not contain document contents, authentication assertions, secrets, or private correction details.

