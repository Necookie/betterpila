# Launch Checklist

**Status:** Proposed  
**Last updated:** 2026-09-13

Launch only after every required item is checked or an explicit documented exception is approved.

## Project identity

- [ ] Better Pila is registered with the BetterGov directory as appropriate.
- [ ] The independent/unofficial disclaimer is prominent.
- [ ] Maintainer and correction contact channels are working.
- [ ] Domain ownership, renewal, and recovery responsibilities are recorded.
- [ ] Source-code and original-content licenses are selected.

## Content

- [ ] Initial content targets in the PRD are met or missing data is explained.
- [ ] Every substantive record has a source and last-verified date.
- [ ] Official names, contacts, amounts, dates, and document numbers received a second review.
- [ ] Summaries are neutral and distinguish themselves from official text.
- [ ] No prohibited personal information is public.
- [ ] Public documents open, have correct metadata, and have HTML context.
- [ ] Correction instructions are visible.

## Product and accessibility

- [ ] Core journeys work on narrow and wide screens.
- [ ] Keyboard-only and screen-reader checks are complete.
- [ ] Automated accessibility checks have no unresolved critical issues.
- [ ] Empty, error, archived, and unavailable states are understandable.
- [ ] Emergency contacts are clearly labeled as sourced information, not an emergency-response service.

## SEO and performance

- [ ] Canonical production domain and HTTPS are configured.
- [ ] Titles, descriptions, headings, canonicals, and social metadata are unique and valid.
- [ ] Sitemap contains only successful canonical published pages.
- [ ] Admin, preview, search-result, and private-file routes are not indexable.
- [ ] Structured data validates and matches visible content.
- [ ] Redirects are one hop and have no loops.
- [ ] Representative pages meet the agreed performance budget.
- [ ] Search Console and Bing Webmaster Tools are ready for verification/submission.

## Security and privacy

- [ ] Cloudflare Access protects every admin route and MFA is required.
- [ ] Local authorization has negative tests for each role.
- [ ] Production secrets are stored outside the repository.
- [ ] Uploads are private/quarantined until publication.
- [ ] Security headers and rate limits are active.
- [ ] Privacy notice accurately describes forms and analytics.
- [ ] Public forms use Turnstile and moderation, or remain disabled.
- [ ] Private security-reporting instructions are available.

## Operations

- [ ] Production and preview resources are separate.
- [ ] Automated checks and deployment pass from a clean checkout.
- [ ] Usage and error monitoring are enabled.
- [ ] D1 and R2 usage thresholds are documented.
- [ ] Backup/export succeeded.
- [ ] Restoration into a clean test environment succeeded.
- [ ] Rollback and incident-response procedures were rehearsed.
- [ ] At least two trusted maintainers have continuity/recovery coverage.

## Final verification

- [ ] A local Pila reviewer has reviewed representative content.
- [ ] All critical requirements in the SRS have evidence in the test plan.
- [ ] No unresolved critical/high defects remain.
- [ ] Launch approval and known limitations are recorded.
- [ ] BetterGov directory status will be updated after the production site is confirmed live.

