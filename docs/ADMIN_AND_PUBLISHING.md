# Admin Dashboard and Publishing Workflow

**Status:** Draft for review  
**Last updated:** 2026-09-13

## 1. Purpose

The dashboard enables authorized maintainers to manage public information without editing code. It must favor accuracy, traceability, and safe review over rapid publication.

## 2. Roles

### Administrator

- Manage authorized users and roles.
- Configure system settings and review intervals.
- Access all content, audit records, exports, and recovery tools.
- Publish, archive, restore, and resolve incidents.

### Reviewer

- Review sources and proposed changes.
- Approve, reject, publish, or archive content.
- Return a record to an editor with notes.
- Review correction requests.

### Editor

- Create and edit drafts.
- Attach sources and documents.
- Preview records.
- Request review.
- Address reviewer feedback.

## 3. Workflow

```text
Draft ──> In review ──> Published ──> Archived
  ^            │             │            │
  └── changes ─┘             └── revise ──┘
```

- A draft is private and editable.
- In-review content is locked against casual publication and may be returned with notes.
- Published content is public and may create or update a search-engine-visible URL.
- Archived content is retained but removed from current indexes unless presented as history.

## 4. Publication checklist

Before publication, the system and reviewer verify:

- Title/name and plain-language summary are complete.
- At least one credible source supports the record.
- Dates and monetary values match the cited material.
- Contact details are official public contacts.
- Personal data is appropriate and necessary.
- Wording is neutral and does not imply official endorsement.
- Document files open successfully and have useful titles.
- Image rights and attribution are documented.
- Slug, page title, description, and structured data are valid.
- `last_verified_at` and the next review date are set.

## 5. Dashboard sections

- Overview: drafts, pending reviews, stale records, corrections, broken links, and recent activity.
- Officials.
- Offices and contacts.
- Budgets and budget items.
- Projects and status history.
- Ordinances and resolutions.
- Documents and media.
- Sources and citations.
- Corrections.
- Redirects.
- Users and roles, administrators only.
- Audit and export, permission-controlled.

## 6. Editing behavior

- Autosave may preserve private drafts but must not change public content.
- Editors must receive a conflict warning if a record changed since they opened it.
- Destructive actions require clear confirmation and a reason.
- Preview must use a short-lived authorization and must not be indexable or share a permanent public URL.
- Publication should invalidate affected public caches and refresh sitemap data.
- Material edits to published records require review; trivial typo rules may be defined later.

## 7. Stale content

The dashboard groups content as:

- Current: review date has not arrived.
- Due soon: review date is within a configurable warning period.
- Overdue: review date has passed.
- Source unavailable: at least one cited source cannot be reached.
- Incomplete: required evidence or fields are missing.

Staleness is a warning, not automatic proof that content is false. Records are never silently unpublished solely because a review date passed.

## 8. Account lifecycle

- Access is invite-only.
- New accounts receive the least privileged role required.
- Disabled maintainers immediately lose application authorization.
- Role changes and access revocation are audited.
- Access is reviewed at least quarterly and whenever a maintainer leaves.
- At least two trusted people should have recovery access to project infrastructure.

