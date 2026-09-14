# Product Requirements Document

**Product:** Better Pila  
**Location:** Pila, Laguna, Philippines  
**Status:** Draft for review  
**Maintainers:** To be confirmed  
**Last updated:** 2026-09-13

## 1. Product summary

Better Pila is a public, mobile-friendly website that makes municipal information easier to find, understand, verify, and share. Maintainers use a private dashboard to curate information about officials, budgets, projects, ordinances, offices, hotlines, and official social channels.

The portal is independent and must not imply that it is owned, endorsed, or operated by the Municipality of Pila.

## 2. Problem statement

Public municipal information is often distributed across social posts, PDF files, national agency portals, and individual office pages. Citizens may struggle to locate the latest version, understand its context, or verify where a claim originated.

Better Pila will provide a consistent directory with plain-language summaries, original sources, publication dates, and last-verified dates.

## 3. Goals

- `PRD-G1`: Make core Pila municipal information discoverable in a few clicks.
- `PRD-G2`: Preserve a clear evidence trail from every published claim to a source.
- `PRD-G3`: Give maintainers a safe, usable workflow for drafting, reviewing, publishing, correcting, and archiving records.
- `PRD-G4`: Produce crawlable, fast pages with strong technical SEO.
- `PRD-G5`: Keep the initial infrastructure within Cloudflare's free allowances where practical.
- `PRD-G6`: Make the portal usable on low-end phones and slower mobile connections.

## 4. Non-goals for the MVP

- Acting as an official LGU channel or replacing official services.
- Accepting emergency reports.
- Publishing allegations, rumors, political endorsements, or opinion pieces.
- Public user registration, comments, voting, reactions, or social networking.
- A native mobile application.
- Automated scraping and publication without human review.
- Real-time expenditure accounting or claims of completeness.
- Providing legal, financial, or emergency advice.

## 5. Users

### 5.1 Resident or visitor

Needs reliable municipal contacts, public records, current officials, and project information without knowing which government website originally published them.

### 5.2 Researcher or journalist

Needs stable URLs, dates, citations, downloadable documents, and historical context.

### 5.3 Editor

Collects information, creates drafts, attaches sources, and responds to requested changes.

### 5.4 Reviewer

Checks accuracy, source quality, personal-data exposure, neutrality, and completeness before publication.

### 5.5 Administrator

Manages authorized maintainers, configuration, incidents, backups, and content recovery.

## 6. MVP scope

### 6.1 Public website

- Homepage with purpose, disclaimer, featured categories, and recent updates.
- Officials directory and individual official pages.
- Municipal office, hotline, and official-channel directory.
- Budget index and fiscal-year detail pages.
- Project index and project detail pages.
- Ordinance and resolution index and detail pages.
- Document downloads with visible metadata and source attribution.
- Site search and category/year/status filters.
- About, methodology, privacy, accessibility, and corrections pages.
- Visible publication and last-verified dates.
- Stable, descriptive URLs and share metadata.

### 6.2 Admin dashboard

- Invite-only access.
- Content management for every public module.
- Draft, review, publish, archive, and restore actions.
- Source and document attachment.
- Preview before publication.
- Revision and activity history.
- Stale-content dashboard based on verification dates.
- CSV export for core records.

### 6.3 Initial content target

The MVP may launch when it contains, at minimum:

- All currently verified elected municipal officials.
- Primary municipal offices and public contact information.
- Essential emergency and service hotlines.
- At least one recent annual budget or budget document entry.
- At least five currently relevant projects, if reliable public sources exist.
- At least ten recent ordinances or resolutions, if reliable public sources exist.

Missing public data must be labeled as unavailable or not yet verified; it must never be invented to meet a target.

## 7. Content principles

- Every substantive record must cite at least one source before publication.
- Primary sources are preferred over summaries and social reposts.
- Facts and plain-language explanation must be distinguishable.
- Uncertainty, conflicts, and incomplete coverage must be disclosed.
- Corrections must preserve an audit trail.
- Political neutrality applies to wording, ordering, imagery, and featured content.
- Personal information must be limited to legitimate, officially published public-contact details.

See [CONTENT_AND_EDITORIAL.md](CONTENT_AND_EDITORIAL.md).

## 8. Success measures

### Launch quality

- 100% of published records have a source and last-verified date.
- 0 public pages expose unpublished content.
- 0 critical accessibility violations in the agreed test set.
- 0 high-severity security findings before production launch.
- All indexable pages return successful responses and have unique titles.

### Ongoing health

- At least 90% of published records remain within their review interval.
- Correction requests receive an acknowledgement within seven calendar days.
- Broken public source links are reviewed within fourteen calendar days of detection.
- Core public pages meet the project's performance budget at the 75th percentile when sufficient field data exists.

Traffic volume and search ranking are observational metrics, not measures of truth or civic value.

## 9. Constraints

- The project is volunteer-maintained.
- Hosting should remain within free allowances during the MVP when safe and practical.
- The public experience must work without a user account.
- Administrative access is limited to explicitly authorized maintainers.
- The project must remain operational if one maintainer becomes unavailable.
- Content must be recoverable from backups and exports.

## 10. Risks

| Risk | Mitigation |
| --- | --- |
| Outdated information | Review intervals, stale-content dashboard, visible verification dates |
| Perceived official endorsement | Persistent independent-project disclaimer and distinct branding |
| Political bias | Neutral editorial policy, source-first writing, reviewer approval |
| Sensitive personal data | Data minimization, review checklist, takedown process |
| Source pages disappear | Store permitted copies, metadata, and archival references |
| Volunteer burnout | Small MVP, documented processes, shared access, exportable data |
| Free-tier limits change | Usage monitoring and portable exports; record migration plan |
| Compromised admin account | Invite-only access, MFA through access provider, least privilege |

## 11. Release criteria

The MVP is ready for public launch only when:

1. The identity, disclaimer, and maintainer contact are published.
2. All critical `FR`, `NFR`, and `SEC` requirements pass acceptance testing.
3. Initial content has completed editorial review.
4. Production backups and a restore rehearsal are complete.
5. Sitemap, canonical URLs, structured data, and webmaster verification are configured.
6. At least two maintainers can access operational accounts or a documented continuity arrangement exists.

