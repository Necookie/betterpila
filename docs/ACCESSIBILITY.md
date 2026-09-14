# Accessibility Requirements

**Status:** Proposed  
**Target:** WCAG 2.2 Level AA  
**Last updated:** 2026-09-13

## 1. Principles

Better Pila serves the public. Accessibility is a release requirement, not a later enhancement. The same standard applies to the public portal and the essential admin workflow.

## 2. Design requirements

- Text and meaningful controls meet AA color contrast.
- Information and status are not conveyed by color alone.
- Focus indicators are clearly visible.
- Text can resize to 200% without loss of content or function.
- Reflow works at a 320 CSS-pixel viewport without two-dimensional scrolling except for genuinely tabular content.
- Touch targets are appropriately sized and spaced.
- Animation respects reduced-motion preferences.
- Layout does not depend on hover.

## 3. Structure and navigation

- Provide a skip link and consistent landmarks.
- Use one meaningful primary heading and a logical heading hierarchy.
- Use real links and buttons according to their behavior.
- Navigation order and keyboard focus order match visual order.
- Every page has a descriptive title.
- Breadcrumbs expose the current location.
- Repeated navigation remains consistent.

## 4. Forms and dashboard

- Every input has a visible programmatic label.
- Required fields are identified in text.
- Instructions appear before they are needed.
- Errors identify the field, explain the issue, and move focus appropriately.
- Validation does not erase entered values.
- Destructive operations explain their effect and require confirmation.
- Time limits are avoided; expiring security sessions provide a safe recovery path.
- Complex tables have captions, headers, and responsive alternatives.

## 5. Images, documents, and media

- Informative images have concise alternative text.
- Decorative images use empty alternative text.
- Charts include an equivalent table or written explanation.
- Uploaded PDFs are checked for text availability, reading order, document title, language, and meaningful links when feasible.
- Scanned documents should receive OCR or an accessible HTML summary.
- Download links identify file type and size.

## 6. Language

- Set the page language.
- Mark passages in another language when relevant.
- Prefer plain language and expand unfamiliar abbreviations.
- Do not use placeholder-only labels.

## 7. Verification

Before launch:

- Complete keyboard-only testing of every primary workflow.
- Test representative pages with at least one screen reader.
- Run automated accessibility checks in CI.
- Check 200% zoom and narrow reflow.
- Test high contrast and reduced motion.
- Review documents separately; automated web-page testing does not validate PDF accessibility.

Automated tools support but do not replace manual review.

