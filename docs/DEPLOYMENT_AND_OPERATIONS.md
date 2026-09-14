# Deployment and Operations Runbook

**Status:** Proposed  
**Last updated:** 2026-09-13

## 1. Platform resources

Production is expected to use:

- One Cloudflare Worker application with static assets.
- One production D1 database.
- One production R2 bucket with private/quarantine and public prefixes or separate buckets.
- One Cloudflare Access application protecting admin routes.
- Turnstile when public mutation forms are enabled.
- Custom domain and HTTPS through Cloudflare.

Preview resources must be separate from production and use synthetic data.

## 2. Configuration

Version control should contain non-secret configuration, binding names, and Cloudflare resource IDs. API tokens and other secrets belong only in the hosting platform or an ignored local secrets file.

Required configuration categories:

- Canonical site URL.
- D1 and R2 bindings.
- Access audience/issuer configuration.
- Allowed administrator identities or mapping rules.
- Turnstile secret when enabled.
- Observability destination when enabled.
- Email or notification provider credentials when enabled.

## 3. Release process

Astro 6 and newer selects the Wrangler environment during the build. Use the repository scripts (`deploy:preview` and `deploy:production`), which set `CLOUDFLARE_ENV` before `astro build` and then deploy the generated bundle. Do not build generically and attempt to select the environment only with `wrangler deploy --env`.

1. Open a pull request with code, migration, and documentation changes.
2. Run automated quality, test, build, and migration checks.
3. Deploy a preview using synthetic or sanitized data.
4. Complete required manual review.
5. Apply backward-compatible production migrations.
6. Deploy the application.
7. Run smoke tests for homepage, search, representative records, admin access, and downloads.
8. Verify cache behavior, sitemap, robots directives, and health response.
9. Monitor errors and usage after release.

## 4. Database migrations

- Migrations are forward-only in production under normal operation.
- Prefer additive, backward-compatible changes before destructive cleanup.
- Back up/export affected data before risky changes.
- Test migrations against a realistic non-production dataset.
- Document a recovery plan for every migration that transforms or removes data.

## 5. Backup strategy

Backups must include:

- D1 export.
- R2 object inventory and recoverable copies or version history.
- File checksum manifest.
- Application release identifier.
- Instructions and required configuration for restoration.

Proposed schedule:

- Daily database export while active editing is occurring.
- Weekly file inventory and integrity check.
- Monthly restoration rehearsal during the MVP stabilization period, then quarterly after reliability is demonstrated.
- Additional export before significant migrations or bulk imports.

A backup is not considered valid until restoration has been tested.

## 6. Monitoring

Monitor:

- Successful response rate and latency.
- Worker exceptions.
- D1 read, write, and storage usage.
- R2 storage and operation usage.
- Build and deployment failures.
- Broken source and document links.
- Overdue content reviews.
- Unauthorized admin requests and unusual mutation activity.
- Sitemap and indexing health.

Alert thresholds should provide time to act before a free-plan limit is reached.

## 7. Scheduled tasks

Cloudflare Cron Triggers may run bounded tasks for:

- Stale-record notifications.
- Broken-link sampling.
- Sitemap refresh if not generated dynamically.
- Backup/export orchestration.
- Temporary data cleanup.

Tasks must be idempotent, paginated, and designed to remain within runtime limits.

## 8. Rollback

- Keep the previous known-good deployment available for rapid rollback.
- Do not roll application code back across an incompatible database migration.
- Use forward fixes for data changes where rollback would destroy newer content.
- Restore data from backup only after identifying the affected scope and preserving incident evidence.

## 9. Capacity response

When usage approaches free limits:

1. Identify inefficient or abusive traffic.
2. Improve indexes, pagination, caching, and request limits.
3. Temporarily disable nonessential operations such as broad exports or expensive filters.
4. Preserve public read access and administrative correction capability.
5. Present maintainers with the expected paid cost before upgrading.

Never fabricate successful responses when data operations have failed.

## 10. Operational ownership

Before launch, record outside this public repository:

- Primary and backup domain owners.
- Cloudflare account recovery owners.
- GitHub administrators.
- Incident contacts.
- Backup location and recovery authority.
- Procedure for a maintainer leaving the project.
