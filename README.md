# Better Pila

Better Pila is an independent, source-first public information portal for Pila, Laguna. It presents officials, municipal offices, budgets, projects, ordinances, and resolutions without claiming to be an official government website.

The repository contains the public portal, a protected editorial dashboard, the Cloudflare Worker runtime, D1 migrations, R2 document storage support, automated checks, and the complete planning set in [`docs/`](./docs/README.md).

## Technology

- Astro and TypeScript for fast, search-friendly public pages
- React for the interactive admin dashboard only
- Cloudflare Workers for the always-available application runtime
- Cloudflare D1 for structured public records and revision history
- Cloudflare R2 for source documents
- Cloudflare Access for administrator sign-in
- Vitest and Playwright for automated checks

## Start locally

Requirements: Node.js 24 and npm.

```sh
npm install
npm run cf:types
npm run db:migrate:local
npm run db:seed:local
npm run dev
```

Open `http://localhost:4321`. The local admin dashboard is available at `http://localhost:4321/admin` using the development-only email in `wrangler.jsonc`.

The seed file creates private draft examples only. It does not publish unverified facts about Pila.

## Verify changes

```sh
npm test
npm run check
npm run build
npm run test:e2e
```

## Provision Cloudflare

Sign in with Wrangler, then create separate preview and production resources:

```sh
npx wrangler login
npx wrangler d1 create better-pila-preview-db
npx wrangler d1 create better-pila-production-db
npx wrangler r2 bucket create better-pila-preview-files
npx wrangler r2 bucket create better-pila-production-files
```

Copy the returned D1 IDs into the matching placeholders in `wrangler.jsonc`. Replace the Cloudflare Access team domain, audience, and administrator email placeholders as well. Never commit API tokens or secrets.

Apply the migrations before the first deployment:

```sh
npm run db:migrate:preview
npm run db:migrate:production
npm run deploy:preview:dry-run
npm run deploy:preview
```

Astro selects the Cloudflare environment while it builds. The deployment scripts set `CLOUDFLARE_ENV` before the build and then deploy the generated environment-specific bundle. Do not replace them with `wrangler deploy --env …` after a generic build.

Create a Cloudflare Access self-hosted application protecting `/admin*` and `/api/admin*`, allow only approved editor emails, then set the resulting Access audience in `wrangler.jsonc`. Production deployment should happen only after the launch checklist and a content review are complete.

## Publishing rule

Records begin as drafts. Review and publication require a source citation and a verification date. Uploaded documents remain quarantined until reviewed. See [`docs/ADMIN_AND_PUBLISHING.md`](./docs/ADMIN_AND_PUBLISHING.md) and [`docs/CONTENT_AND_EDITORIAL.md`](./docs/CONTENT_AND_EDITORIAL.md).
