# Data Model

**Status:** Proposed  
**Last updated:** 2026-09-13

## 1. Modeling principles

- Public facts and their evidence are separate but related records.
- Records are archived rather than overwritten when history matters.
- Workflow state is explicit.
- User-facing URLs use stable slugs or official identifiers.
- Monetary values use integer minor units when practical, never floating-point values.
- Dates distinguish an event date, source publication date, system publication date, and last verification date.
- Personal information is minimized.

## 2. Common fields

Most publishable entities contain:

| Field | Purpose |
| --- | --- |
| `id` | Internal immutable identifier |
| `slug` | Stable public URL segment |
| `title` or `name` | Public label |
| `summary` | Plain-language public explanation |
| `status` | Draft, in review, published, or archived |
| `published_at` | First/current publication timestamp |
| `last_verified_at` | Most recent evidence review timestamp |
| `review_due_at` | Next planned verification date |
| `created_by` | Creating maintainer |
| `reviewed_by` | Approving reviewer |
| `created_at` / `updated_at` | System timestamps |
| `deleted_at` | Soft-deletion timestamp |
| `meta_title` | Optional SEO override |
| `meta_description` | Optional SEO override |

## 3. Core entities

### 3.1 User

- Identity-provider subject and email.
- Display name.
- Role: administrator, reviewer, or editor.
- Active/disabled status.
- Last successful administrative access.

Passwords should not be stored when Cloudflare Access is the identity provider.

### 3.2 Official

- Full name, display name, honorific, and optional biography.
- Position and associated office.
- Elected or appointed classification.
- Term start and end, when sourced.
- Current/former flag derived from terms and record state.
- Public official contact methods.
- Portrait media reference and attribution.

### 3.3 Office

- Official name and short name.
- Description and services.
- Parent office when a hierarchy exists.
- Public location and opening hours.
- Contact methods and official channels.

### 3.4 Contact method

- Owner type and owner identifier.
- Type: telephone, mobile, email, website, social account, address, or other.
- Label and normalized value.
- Public-display value.
- Emergency flag and availability notes.
- Verification date and source.

### 3.5 Budget

- Fiscal year and budget type.
- Currency, approved amount, expenditure amount, and as-of date.
- Scope and accounting notes.
- Related line items, documents, projects, and sources.

### 3.6 Budget item

- Parent budget.
- Category/code and description.
- Amount in integer minor units.
- Item type, order, and source reference.

### 3.7 Project

- Title, summary, and category.
- Location text and optional geographic coordinates.
- Responsible office.
- Public budget and funding source.
- Contractor or implementing partner when officially documented.
- Start and target/completion dates.
- Current public status with an as-of date.
- Related budgets, documents, images, and sources.

### 3.8 Project status event

- Project.
- Status and effective/as-of date.
- Public note.
- Source.
- Creator and timestamp.

The current project status is derived from the latest approved event.

### 3.9 Legislative document

Represents an ordinance or resolution:

- Type.
- Official number and legislative year.
- Title and plain-language summary.
- Approval and effectivity dates when known.
- Sponsoring or authoring officials when sourced.
- Full-text document and related sources.

### 3.10 Document

- Public title and description.
- R2 object key; never expose internal credentials.
- Original filename and safe display filename.
- MIME type and byte size.
- Cryptographic checksum.
- Document date and language.
- Accessibility/OCR status.
- Visibility: private, quarantined, or public.
- Replacement/supersession relationship.

### 3.11 Source

- Title and publisher.
- URL or document relationship.
- Source type.
- Primary/secondary classification.
- Publication date and access date.
- Availability state.
- Archival URL when permitted.
- Notes visible to reviewers.

### 3.12 Citation

Join entity between a source and a factual record:

- Source.
- Target entity type and identifier.
- Optional field or claim description.
- Public citation label.
- Reviewer notes.

### 3.13 Redirect

- Old path.
- Canonical target path.
- Reason and creation timestamp.
- Active status.

### 3.14 Revision

- Entity type and identifier.
- Actor.
- Before and after snapshots or a structured change set.
- Action and reason.
- Timestamp.

### 3.15 Correction request

- Affected public URL or record.
- Reporter contact, optional and private.
- Description and evidence links.
- Workflow status.
- Assigned maintainer and resolution note.
- Retention/deletion timestamp for personal data.

## 4. Relationships

```text
Office 1 ── * Official
Office 1 ── * ContactMethod
Official 1 ── * ContactMethod
Budget 1 ── * BudgetItem
Budget * ── * Project
Project 1 ── * ProjectStatusEvent
PublishableRecord * ── * Source       through Citation
PublishableRecord * ── * Document
PublishableRecord 1 ── * Revision
User 1 ── * Revision
```

## 5. Uniqueness and integrity

- Slugs are unique within a public route namespace.
- Legislative document type, year, and official number form a unique key.
- Only one active redirect may exist for an old path.
- Redirect targets must not form a cycle.
- Published records require at least one valid citation.
- Public documents require a valid storage object and checksum.
- Deleting a source referenced by published content is prohibited; it may be marked inaccessible or superseded.
- Monetary amounts require an ISO currency code, normally `PHP`.

## 6. Freshness rules

| Content | Suggested review interval |
| --- | --- |
| Emergency contact | 30 days |
| Office contact and hours | 90 days |
| Current official | 90 days and after known personnel changes |
| Active project status | 90 days |
| Completed project | Annually or on correction |
| Budget/document metadata | Annually or on correction |
| Ordinance/resolution | On correction or supersession |

## 7. Deletion and retention

- Published civic records should normally be archived, not deleted.
- Soft-deleted drafts may be permanently removed after a documented retention period.
- Audit events for publication and security actions must be retained longer than routine draft edits.
- Reporter contact information must be deleted when the correction is resolved and the appeal/verification period ends.
- File replacement must preserve the previous checksum and metadata when accountability requires it.

