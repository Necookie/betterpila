# Information Architecture and UX Specification

**Status:** Proposed  
**Last updated:** 2026-09-13

## 1. Experience goals

- Let a resident find a useful answer quickly on a phone.
- Make the source and freshness of information obvious.
- Clearly separate Better Pila from the official municipal government.
- Make complex budgets, projects, and legislation understandable without hiding the original record.
- Keep administrative work consistent across content types.

## 2. Public site map

```text
Home
├── Officials
│   └── Official detail
├── Offices & Services
│   └── Office detail
├── Budgets
│   └── Budget-year detail
├── Projects
│   └── Project detail and status history
├── Ordinances & Resolutions
│   └── Legislative document detail
├── Documents
│   └── Document landing page
├── Search
├── About
├── Methodology
├── Corrections
├── Accessibility
└── Privacy
```

Primary mobile navigation should expose Officials, Services, Budgets, Projects, Ordinances, and Search. About, policies, and project links may live in secondary navigation and the footer.

## 3. Homepage

Required sections:

1. Clear project name, purpose, and independent-project disclaimer.
2. Search entry point.
3. Main category links.
4. Essential official contacts or a direct link to them.
5. Recently updated records based on meaningful publication changes.
6. Methodology and correction links.

Avoid political portraits, decorative statistics, or promotional language in the main hero.

## 4. Index-page pattern

Each content index should provide:

- Plain-language introduction.
- Result count or bounded description.
- Search/filter controls appropriate to the content.
- Active-filter summary and clear-all action.
- Server-rendered results with stable links.
- Useful empty state.
- Pagination or bounded loading.
- Visible last-updated/verified information where useful.

Filters must use real labels, work by keyboard, and remain understandable when a URL is shared.

## 5. Detail-page pattern

Each record page should contain, in this order when applicable:

1. Breadcrumbs.
2. Record title and status.
3. Plain-language summary.
4. Key facts.
5. Main content or status history.
6. Related office, official, budget, project, or legislation.
7. Documents.
8. Sources.
9. Published and last-verified dates.
10. Correction link.
11. Independent-project disclaimer in the site footer.

Unknown values should read “Not found in the cited public sources” or similarly precise language, not zero, blank, or “N/A” when that could mislead.

## 6. Status presentation

Use a text label plus color and, where useful, an icon. Public project status and editorial workflow status are different concepts; workflow status is never exposed on normal public pages.

Source confidence or completeness must not be reduced to a simplistic score. Explain limitations in words.

## 7. Dashboard navigation

```text
Dashboard
├── Review queue
├── Officials
├── Offices & Contacts
├── Budgets
├── Projects
├── Ordinances & Resolutions
├── Documents
├── Sources
├── Corrections
├── Redirects
├── Activity & Exports
└── Users & Settings (administrator)
```

The dashboard home prioritizes work requiring attention: reviews, stale records, inaccessible sources, unresolved corrections, quarantined files, and failed operational tasks.

## 8. Responsive behavior

- Design for narrow screens first.
- Replace wide data tables with labeled record cards or controlled horizontal scrolling when semantic tables are essential.
- Keep primary actions reachable without fixed elements covering content.
- Avoid interactions requiring hover or precision pointing.
- Preserve filters in the URL where privacy and canonical rules allow.

## 9. Visual language

- Use a civic but clearly independent identity.
- Do not imitate the municipal seal, official masthead, or government design closely enough to imply endorsement.
- Prefer readable neutral typography, restrained color, and strong information hierarchy.
- Reserve warning and emergency colors for their semantic purpose.
- Use charts only when they clarify values and always provide underlying figures and sources.

## 10. Content states

Design and test loading, empty, partial, unavailable, error, archived, stale, and source-inaccessible states. Never make missing information appear complete.

