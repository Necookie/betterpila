# Search Engine Optimization Plan

**Status:** Proposed  
**Last updated:** 2026-09-13

## 1. Objective

Help people find accurate Better Pila pages when searching for Pila officials, offices, contacts, budgets, projects, ordinances, resolutions, and public documents. SEO must never justify misleading wording or unsupported claims.

## 2. Rendering strategy

- Return complete semantic HTML for public pages.
- Keep essential content available without client-side JavaScript.
- Cache public responses safely at the edge.
- Avoid shipping the admin dashboard bundle to public pages.
- Provide an HTML explanation for important PDFs rather than relying on a file alone.

## 3. URL conventions

```text
/
/officials
/officials/{slug}
/offices
/offices/{slug}
/budgets
/budgets/{year}-{slug}
/projects
/projects/{slug}
/ordinances
/ordinances/{year}-{number}
/resolutions/{year}-{number}
/documents/{slug}
/about
/methodology
/corrections
```

- Use lowercase, readable slugs.
- Do not place workflow status or database identifiers in public URLs.
- Preserve old URLs with one-hop permanent redirects.
- Choose one canonical host and HTTPS scheme.

## 4. Page metadata

Every indexable page requires:

- Unique, concise `<title>`.
- Unique meta description based on visible content.
- Self-referencing canonical URL.
- Exactly one clear primary heading.
- Open Graph title, description, URL, image, and site name.
- Appropriate social-card metadata.
- Meaningful `dateModified` when supported and truthful.

Default metadata may be generated from structured fields. Editors can override it when the result remains accurate.

## 5. Structured data

Use JSON-LD and validate it before release. Candidate types include:

- `WebSite` for the portal.
- `Organization` for the independent Better Pila project.
- `BreadcrumbList` for hierarchy.
- `Person` for official profiles.
- `GovernmentService` when describing a sourced public service.
- `Article` for genuine news or update articles.
- Suitable `CreativeWork` types for public documents.

Do not identify Better Pila as a government organization. Structured data must describe content visible on the page and must not promise a rich result.

## 6. Crawl and index controls

- Generate `/sitemap.xml` from canonical published records only.
- Exclude admin, preview, authentication, internal search results, draft files, and private downloads.
- Provide a minimal `/robots.txt` that references the sitemap.
- Use `noindex` response directives for protected and noncanonical views.
- Keep filtered query URLs out of the sitemap; canonicalize or block combinations that create duplicates.
- Return correct 404 and 410 responses rather than soft-404 pages.

## 7. Internal linking

- Link offices to their officials, services, projects, and contacts.
- Link budgets to related projects and documents.
- Link ordinance summaries to official text and related records.
- Provide breadcrumbs and meaningful anchor text.
- Ensure every important page is reachable through public navigation.

## 8. Performance budget

Target the 75th-percentile Core Web Vitals thresholds:

- LCP at or below 2.5 seconds.
- INP at or below 200 milliseconds.
- CLS below 0.1.

Implementation rules:

- Set image dimensions and use appropriate formats and sizes.
- Keep critical fonts and styles small.
- Prefer system fonts or carefully subset self-hosted fonts.
- Avoid render-blocking third-party scripts.
- Lazy-load below-the-fold media.
- Cache immutable assets aggressively.

## 9. Content quality

- Use page-specific summaries, not duplicated boilerplate.
- Show source, publication, and verification dates prominently.
- Explain acronyms and technical terms.
- Use descriptive tables with captions and headings.
- Keep historical records accessible when they provide public value.
- Publish an About page naming the independent nature and methodology of the project.

## 10. Search operations

- Verify the production domain in Google Search Console and Bing Webmaster Tools.
- Submit the sitemap after launch.
- Monitor indexing, crawl errors, canonical selection, manual actions, and Core Web Vitals.
- Review search queries for unmet public-information needs without collecting unnecessary personal data.
- Revalidate structured data and links during releases.

## 11. Acceptance checklist

- No duplicate titles across the representative crawl.
- No indexable admin or preview URLs.
- Sitemap contains successful canonical URLs only.
- Canonicals resolve directly without redirects.
- JSON-LD passes validation and matches visible content.
- Mobile navigation and content are fully usable.
- Important PDF records have useful HTML landing pages.
- Social previews use accurate titles and images.

