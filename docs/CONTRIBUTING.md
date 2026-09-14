# Contributing to Better Pila

**Status:** Draft for review  
**Last updated:** 2026-09-13

## 1. Ways to contribute

- Report incorrect or outdated public information.
- Locate stronger primary sources.
- Improve plain-language explanations.
- Review accessibility, translations, and mobile usability.
- Fix software issues or improve documentation.

Emergency reports and requests for official government action must be directed to the appropriate official service, not this repository.

## 2. Ground rules

- Be respectful, factual, and politically neutral.
- Do not submit private or sensitive personal information.
- Cite direct sources for factual content changes.
- Do not use AI-generated text or extracted data without human source verification.
- Disclose relevant conflicts of interest.
- Follow the security-reporting instructions for vulnerabilities rather than opening a public issue with exploit details.

## 3. Content contribution checklist

Include:

- The affected Better Pila page or proposed record.
- The exact change requested.
- Direct source URL or document.
- Source publisher and publication date when known.
- Date accessed.
- A short explanation of why the source supports the change.

A submission may be declined when evidence is insufficient, privacy risk is excessive, wording is partisan, or the content is outside scope.

## 4. Code workflow

1. Open or identify an issue for nontrivial work.
2. Create a focused branch.
3. Keep changes small and include affected documentation.
4. Add or update tests.
5. Run formatting, type checks, tests, and the production build.
6. Open a pull request describing behavior, verification, data migrations, and risks.
7. Address review comments and avoid unrelated changes.

## 5. Pull-request requirements

- Clear title and summary.
- Linked issue or rationale.
- Screenshots for visible changes.
- Accessibility notes for interface changes.
- Migration and rollback/recovery notes for schema changes.
- Security and privacy impact for data/form changes.
- Tests or an explanation of the verification performed.
- No secrets, production personal data, or copyrighted files without permission.

## 6. Review

At least one authorized maintainer reviews code. Content affecting public facts also requires editorial review. The same person may perform both only when project staffing requires it, and the exception should be recorded for consequential changes.

## 7. Commit style

Use concise imperative messages. Conventional prefixes such as `feat:`, `fix:`, `docs:`, `test:`, and `chore:` are encouraged but not required unless adopted as a formal project decision.

## 8. Security reports

Do not publicly disclose authentication bypasses, private-data exposure, secret leakage, or exploitable upload behavior. A private reporting address or repository security-advisory process must be published before launch.

