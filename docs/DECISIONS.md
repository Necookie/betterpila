# Decisions and Open Questions

**Status:** Living document  
**Last updated:** 2026-09-13

## Accepted direction

### ADR-001 — One portal first

**Decision:** Build Better Pila before starting Better Victoria.  
**Reason:** Focus research and engineering effort, validate the model, and avoid maintaining two incomplete portals.

### ADR-002 — Independent civic identity

**Decision:** Better Pila is clearly labeled as independent and unofficial.  
**Reason:** Avoid confusion, implied endorsement, and misuse of municipal identity.

### ADR-003 — Admin-managed structured content

**Decision:** Maintain officials, contacts, budgets, projects, ordinances/resolutions, documents, and sources through a private dashboard.  
**Reason:** Allow maintainers to update information without editing source code while preserving review and audit history.

### ADR-004 — Cloudflare-native MVP

**Decision:** Use Astro, TypeScript, React for admin interactions, Cloudflare Workers, D1, and R2 instead of Laravel for the deployed MVP.  
**Reason:** The current requirement prioritizes free deployment without a traditional sleeping backend. Laravel remains a future option if paid hosting becomes acceptable.

### ADR-005 — Server-rendered public pages

**Decision:** Deliver complete HTML for public content and keep essential information independent of client-side JavaScript.  
**Reason:** SEO, accessibility, performance, and resilience.

### ADR-006 — Evidence before publication

**Decision:** Every substantive record requires a source and verification date before publication.  
**Reason:** Traceability and public trust.

## Open decisions

| ID | Question | Options/notes | Needed by |
| --- | --- | --- | --- |
| `Q-001` | Who is the named primary maintainer and backup? | Record privately where personal details are sensitive | Before external accounts |
| `Q-002` | Who will serve as the Pila resident/local reviewer? | Prefer an independent second reviewer | Before content launch |
| `Q-003` | What is the initial language? | English only, Filipino only, or bilingual | Before interface copy |
| `Q-004` | What project email and security-reporting channel will be used? | Must be durable and shared/recoverable | Before public preview |
| `Q-005` | Is `betterpila.org` available and who will own it? | Do not purchase until ownership and renewal are agreed | Before launch |
| `Q-006` | Which source files may be lawfully mirrored? | Link-only by default when rights are unclear | Before uploads |
| `Q-007` | What correction retention period applies? | Minimize personal-data retention | Before enabling a form |
| `Q-008` | Will correction intake launch as email or a protected form? | Email is simpler; form requires Turnstile and moderation | Before launch |
| `Q-009` | What analytics, if any, will be enabled? | Prefer privacy-preserving and minimal collection | Before production |
| `Q-010` | Will historical officials be included in the MVP? | Current only is smaller; schema supports history | Before data entry |
| `Q-011` | How will public project status be defined? | Must be sourced and have an as-of date | Before project module |
| `Q-012` | What licenses govern source code and original content? | Choose explicit licenses | Before public repository launch |

## How to record a new decision

Add an ADR entry containing:

- Decision and status.
- Context and constraints.
- Options considered.
- Consequences and migration cost.
- Date and approvers.

Update all affected requirements and operational documents in the same change.

