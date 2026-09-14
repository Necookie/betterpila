# Test Plan

**Status:** Proposed  
**Last updated:** 2026-09-13

## 1. Objectives

Testing must demonstrate that published information is correctly separated from drafts, administrative operations are authorized, public pages remain accessible and indexable, and critical data can be recovered.

## 2. Test levels

### Unit tests with Vitest

- Publication eligibility rules.
- Role and permission decisions.
- Slug normalization.
- Redirect-cycle prevention.
- Monetary formatting and calculations.
- Freshness/review-date calculations.
- SEO metadata fallbacks.
- Source and file validation.

### Integration tests

- D1 repositories and migrations.
- Published-only query behavior.
- Record relationships and integrity constraints.
- Access identity verification.
- Administrative API authorization.
- Upload authorization and file visibility.
- Cache invalidation after publication.
- Export generation and import validation.

### Browser tests with Playwright

- Browse and search each public content type.
- Open a detail page and its sources.
- Navigate entirely by keyboard.
- Sign in through the configured test identity boundary.
- Create, review, preview, publish, correct, archive, and restore a record.
- Prevent editors from performing reviewer/admin operations.
- Verify mobile navigation and primary forms.
- Verify admin and previews are not indexable.

### Manual review

- Content accuracy against original sources.
- Neutrality and disclaimer placement.
- Screen-reader workflow.
- PDF and document accessibility.
- Social sharing previews.
- Search-engine structured-data validation.
- Restore rehearsal and incident drill.

## 3. Requirement traceability

| Requirement area | Minimum evidence |
| --- | --- |
| `FR-001`–`FR-064` public/content | Integration tests plus representative browser tests |
| `FR-070`–`FR-076` workflow | Unit, authorization, and full browser workflow tests |
| `FR-080`–`FR-083` corrections | Integration tests plus privacy review |
| `FR-090`–`FR-095` administration | Negative authorization tests and browser tests |
| `FR-100`–`FR-104` SEO | Crawl assertions, metadata snapshots, and manual validation |
| `NFR-001`–`NFR-004` performance | Production-like Lighthouse and field monitoring |
| `NFR-020`–`NFR-023` accessibility | Automated checks plus manual keyboard/screen-reader review |
| `NFR-030`–`NFR-035` security/privacy | Security test checklist and negative tests |
| `NFR-040`–`NFR-044` maintainability | CI checks, migration test, export/restore rehearsal |

## 4. Test data

- Use fictional people and clearly synthetic records outside production.
- Never copy correction-submitter data into preview or local environments.
- Maintain small fixtures for every record type and workflow state.
- Include missing, conflicting, archived, stale, inaccessible-source, and Unicode/Filipino text cases.

## 5. Continuous integration gates

Every proposed code change must pass:

- Type checking.
- Formatting and linting.
- Unit and integration tests.
- Production build.
- Database migration validation.
- Dependency/security checks.
- A small critical browser test set.

Full browser, accessibility, link, and performance checks may run on preview deployments before merge.

## 6. Launch test scenarios

1. An anonymous visitor can find an official and verify the source.
2. A visitor can find an ordinance by year/number and access its official text.
3. An editor cannot publish or manage users.
4. A reviewer cannot publish a record missing its required source.
5. A published record appears on its canonical URL and sitemap.
6. A slug change creates a single permanent redirect.
7. An archived record leaves current indexes without losing its history.
8. A quarantined upload cannot be downloaded publicly.
9. An unauthorized request cannot access admin data.
10. A database export and file manifest can be restored into a clean test environment.

## 7. Exit criteria

- No open critical or high-severity security defects.
- No failing release-gate tests.
- No known route that exposes draft/private content.
- No critical accessibility defects in core workflows.
- Restore rehearsal completed successfully.
- Content launch checklist approved by a reviewer.

