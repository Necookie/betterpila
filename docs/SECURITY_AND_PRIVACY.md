# Security and Privacy Plan

**Status:** Proposed  
**Last updated:** 2026-09-13

## 1. Security objectives

- Prevent unauthorized publication or alteration.
- Prevent draft, private, and quarantined material from becoming public.
- Protect maintainer identities and correction-submitter contact information.
- Preserve the integrity and recoverability of public records.
- Resist automated abuse without creating unnecessary barriers for residents.

## 2. Primary threats

| Threat | Main controls |
| --- | --- |
| Stolen maintainer account | Cloudflare Access, MFA, local allowlist, rapid revocation |
| Broken authorization | Server-side permission checks and negative tests |
| Malicious upload | Type/size allowlist, quarantine, safe disposition, checksums |
| Script injection | Context-aware escaping, sanitization, restrictive content security policy |
| Cross-site request forgery | Same-site cookies, origin validation, anti-CSRF tokens where applicable |
| Automated form abuse | Turnstile, rate limits, honeypot, bounded inputs |
| Data loss or corruption | Exports, backups, checksums, restore rehearsals |
| Source tampering or disappearance | Source metadata, permitted archives, revision history |
| Free-tier exhaustion | Indexed queries, pagination, caching, quotas, alerts |
| Accidental personal-data publication | Minimization, reviewer checklist, correction/takedown process |

## 3. Administrative access

- Protect all `/admin` and administrative API routes with Cloudflare Access.
- Verify the Access assertion server-side.
- Map the verified subject to an active application user.
- Require MFA in the identity policy.
- Deny by default and apply least privilege.
- Do not rely on hidden URLs as access control.
- Review authorized identities quarterly.
- Do not store application passwords if the external identity layer is authoritative.

## 4. Application security requirements

- `SEC-001`: Validate and normalize all input on the server.
- `SEC-002`: Use parameterized database access exclusively.
- `SEC-003`: Escape output by default and sanitize any allowed rich text.
- `SEC-004`: Enforce authorization in application services or endpoints, not only in the interface.
- `SEC-005`: Use secure, HTTP-only, same-site cookies where sessions exist.
- `SEC-006`: Apply a restrictive Content Security Policy and standard security headers.
- `SEC-007`: Rate-limit authentication-adjacent and public mutation endpoints.
- `SEC-008`: Return generic errors publicly and correlate internal logs with request IDs.
- `SEC-009`: Pin dependencies through the lockfile and review automated updates.
- `SEC-010`: Block deployment on known critical dependency vulnerabilities unless a documented exception is approved.

## 5. Upload security

- Allow only explicitly required file types.
- Enforce conservative file-size limits.
- Validate file signatures rather than trusting filename extensions.
- Generate storage keys; do not use an uploaded filename as a path.
- Store new files in a private quarantine location.
- Serve public files with safe `Content-Type` and `Content-Disposition` headers.
- Prevent uploaded HTML, SVG, or active content from executing under the application origin unless explicitly reviewed and sanitized.
- Store checksums and audit publication/replacement.

## 6. Privacy principles

- Collect only information necessary for public transparency or portal operation.
- Clearly distinguish official public-contact details from personal contact details.
- Reporter contact information is optional unless follow-up is necessary.
- Never expose reporter identity in public correction notes.
- Do not use invasive advertising or cross-site tracking.
- Publish a plain-language privacy notice before enabling forms or analytics.
- Define a deletion schedule for correction submissions and logs containing personal data.

## 7. Secrets

- Store secrets in Cloudflare's secret-management mechanism.
- Keep separate values for preview and production.
- Never put credentials in source control, client bundles, issue screenshots, logs, or documentation examples.
- Rotate credentials after suspected exposure and record the incident.
- Scope tokens to the minimum resources and actions required.

## 8. Logging

Log security-relevant events, publication actions, failures, and request identifiers. Do not log Access assertions, secrets, raw document contents, full correction submissions, or unnecessary personal data.

## 9. Incident response

1. Confirm and classify the incident.
2. Contain it by revoking access, disabling affected routes, or unpublishing unsafe content.
3. Preserve relevant logs and evidence without spreading private data.
4. Restore trusted service and verify integrity.
5. Notify affected people or providers when appropriate.
6. Record the timeline, impact, decisions, and corrective work.
7. Update controls and tests.

Emergency contact and recovery ownership must be stored outside the repository in an access-controlled location.

