# Software Requirements Specification

**System:** Better Pila  
**Status:** Draft for review  
**Last updated:** 2026-09-13

## 1. Purpose

This specification defines the testable behavior and quality requirements for the Better Pila public portal and private administration dashboard. Product intent and scope are defined in [PRD.md](PRD.md).

## 2. System context

The system consists of:

- A public, search-engine-accessible website.
- A protected administration dashboard.
- Server-side application routes running on Cloudflare Workers.
- A Cloudflare D1 relational database.
- Cloudflare R2 object storage for documents and images.
- External identity protection for administrative routes.
- Build, deployment, monitoring, and backup processes.

## 3. Functional requirements

### 3.1 Public navigation and discovery

- `FR-001`: The system must provide public indexes for officials, offices, budgets, projects, ordinances/resolutions, and documents.
- `FR-002`: Each published record must have a permanent detail URL based on a unique slug or public identifier.
- `FR-003`: Visitors must be able to search published content by relevant title, name, identifier, and summary text.
- `FR-004`: Visitors must be able to filter applicable indexes by category, year, status, and office.
- `FR-005`: Empty results must explain that no matching verified records were found.
- `FR-006`: The system must provide breadcrumbs and links to related records where relationships exist.

### 3.2 Officials

- `FR-010`: Authorized users must be able to manage elected and appointed official records.
- `FR-011`: An official may be associated with a position, office, term dates, public biography, image, official contacts, and sources.
- `FR-012`: The public directory must distinguish current and former officials without deleting historical records.
- `FR-013`: The public site must not display private contact information.

### 3.3 Offices and contacts

- `FR-020`: Authorized users must be able to manage offices, service descriptions, addresses, hours, hotlines, emails, websites, and verified social accounts.
- `FR-021`: Contact methods must record their type, display label, value, public visibility, and last-verified date.
- `FR-022`: Emergency contacts must be visibly labeled and must advise users to rely on the official service for emergencies.

### 3.4 Budgets

- `FR-030`: Authorized users must be able to manage budget records by fiscal year and budget type.
- `FR-031`: A budget may include approved amounts, expenditure figures, currency, notes, line items, documents, and sources.
- `FR-032`: The system must not calculate or display a percentage as an official figure unless its inputs and calculation method are visible.
- `FR-033`: Budget pages must distinguish approved budget, allocation, obligation, and actual expenditure when the source makes those distinctions.

### 3.5 Projects

- `FR-040`: Authorized users must be able to manage project title, summary, category, location, responsible office, funding source, public budget, contractor, dates, status, documents, and sources.
- `FR-041`: Supported project states must include proposed, planned, ongoing, completed, delayed, suspended, cancelled, and unknown.
- `FR-042`: Project status must include an as-of date and supporting source.
- `FR-043`: Historical status changes must remain available to reviewers.

### 3.6 Ordinances and resolutions

- `FR-050`: Authorized users must be able to manage document type, official number, title, summary, approval date, effectivity details, authors/sponsors when sourced, full text, attachments, and sources.
- `FR-051`: Ordinance and resolution numbers must be unique within their applicable document type and legislative year unless an administrator records a documented exception.
- `FR-052`: Public pages must clearly label unofficial summaries and link to the official text when available.

### 3.7 Sources and files

- `FR-060`: Every publishable record must support one or more source citations.
- `FR-061`: A source must record its title, publisher, URL or document reference, publication date when known, access date, and source type.
- `FR-062`: A reviewer must be able to mark a source as primary, secondary, inaccessible, superseded, or disputed.
- `FR-063`: File uploads must store display name, media type, byte size, checksum, source, and accessibility notes.
- `FR-064`: The public site must not expose private or quarantined uploads.

### 3.8 Publishing workflow

- `FR-070`: Publishable records must support draft, in-review, published, and archived states.
- `FR-071`: Editors may create drafts and request review but may not approve their own changes unless they also hold reviewer permission and the exception is logged.
- `FR-072`: Only authorized reviewers or administrators may publish.
- `FR-073`: Publication must fail when required sources, title, slug, summary, or verification date are missing.
- `FR-074`: The system must preserve an immutable summary of publish, unpublish, restore, and delete events.
- `FR-075`: Reviewers must be able to preview a record before publication.
- `FR-076`: Archived records must remain recoverable but must be excluded from normal public indexes unless explicitly presented as historical content.

### 3.9 Corrections

- `FR-080`: The public site must provide a correction channel and instructions for supplying evidence.
- `FR-081`: Correction submissions must not be published automatically.
- `FR-082`: Administrators must be able to record resolution status and the affected record.
- `FR-083`: Material public corrections should produce a visible correction note without exposing reporter identity.

### 3.10 Administration

- `FR-090`: Administrative routes must require authenticated and authorized access.
- `FR-091`: The system must support administrator, editor, and reviewer permissions.
- `FR-092`: Public self-registration must not exist.
- `FR-093`: The dashboard must show records that are overdue for verification.
- `FR-094`: Authorized users must be able to export core records and source metadata in a documented format.
- `FR-095`: Administrative actions affecting users, publication, or deletion must be recorded in an activity log.

### 3.11 SEO and indexing

- `FR-100`: Every indexable page must provide a unique title, meta description, canonical URL, and crawlable main heading.
- `FR-101`: The system must produce an XML sitemap containing only canonical, published URLs.
- `FR-102`: Admin, authentication, preview, and internal search-result pages must be excluded from indexing.
- `FR-103`: Public record pages must emit valid JSON-LD only for information visible on the page.
- `FR-104`: Changed public URLs must use permanent redirects and must not create redirect chains.

## 4. Non-functional requirements

### 4.1 Performance

- `NFR-001`: Public pages should meet Core Web Vitals targets at the 75th percentile: LCP at or below 2.5 seconds, INP at or below 200 milliseconds, and CLS below 0.1.
- `NFR-002`: Critical public content must be available without client-side JavaScript.
- `NFR-003`: JavaScript must be limited to features that require interaction.
- `NFR-004`: Images must be responsive, dimensioned, and lazy-loaded when below the fold.

### 4.2 Availability and capacity

- `NFR-010`: Static assets must be served independently of database availability where supported.
- `NFR-011`: The system must fail with a clear, non-sensitive error when a platform limit or dependency is unavailable.
- `NFR-012`: Usage must be monitored against Workers, D1, and R2 free-plan limits.
- `NFR-013`: The architecture must provide an upgrade path without changing public URLs.

### 4.3 Accessibility

- `NFR-020`: Public and administrative interfaces must target WCAG 2.2 Level AA.
- `NFR-021`: All core workflows must be usable with a keyboard.
- `NFR-022`: Content must remain understandable at 200% zoom and on a 320 CSS-pixel-wide viewport.
- `NFR-023`: Status must not be communicated by color alone.

### 4.4 Security and privacy

- `NFR-030`: Administrative access must be invite-only and protected by multi-factor authentication through the selected identity layer.
- `NFR-031`: The system must enforce server-side authorization for every administrative action.
- `NFR-032`: Secrets must not be stored in the repository, client code, database records, or logs.
- `NFR-033`: Uploaded files must be allowlisted by type and size and must never execute as application code.
- `NFR-034`: Public forms must use rate limiting and automated-abuse protection before launch.
- `NFR-035`: The system must collect the minimum personal data necessary for its stated purpose.

### 4.5 Maintainability and portability

- `NFR-040`: The application must use TypeScript with strict type checking.
- `NFR-041`: Database changes must be represented by version-controlled migrations.
- `NFR-042`: Production data must be exportable in non-proprietary formats.
- `NFR-043`: Architecture-specific code must be isolated behind application services where practical.
- `NFR-044`: Installation, test, deployment, backup, and restoration procedures must be documented.

### 4.6 Localization

- `NFR-050`: The initial language is English unless maintainers approve a bilingual launch.
- `NFR-051`: Text and data structures must not prevent later Filipino translations.
- `NFR-052`: If translated pages launch, language alternatives and canonical behavior must be defined before indexing.

## 5. External interfaces

- Cloudflare Workers runtime and static assets.
- D1 database binding.
- R2 bucket binding.
- Cloudflare Access identity headers for protected administration routes.
- Turnstile verification for public form submissions, when forms are enabled.
- Search-engine webmaster tools and sitemap submission.
- GitHub repository and build integration.

## 6. Data lifecycle

- Draft data is private.
- Published data is public and indexable unless explicitly excluded.
- Archived data is retained for accountability and may be shown as historical content.
- Soft-deleted data is recoverable by administrators for a defined retention period.
- Backups are encrypted or access-controlled and tested through scheduled restoration rehearsals.
- Personal data in correction submissions is deleted when no longer needed.

## 7. Acceptance approach

Each requirement must map to at least one automated test, manual test, operational check, or documented exception before launch. The mapping is maintained in [TEST_PLAN.md](TEST_PLAN.md).

