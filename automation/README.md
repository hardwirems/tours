# Blog publishing automation

Repository-native automation on the existing stack (Expo Router static export +
Cloudflare Pages + GitHub). No new CMS, service, or paid account.

## Files
- `validate.mjs` — the **quality gate** and test suite. Strict; blocks CI and the
  pipeline. `node automation/validate.mjs [--dist]`.
- `generate.mjs` — the one model-dependent step: turns a backlog topic into a
  source-backed `content/blog/<slug>.ts` **draft** + a licensed, locally-served
  hero image with provenance. Needs `ANTHROPIC_API_KEY` (+ `PEXELS_API_KEY` for
  images). Never fabricates content or mislabels an image.
- `publish.mjs` — the orchestrator (select → dedup → generate → gate → build →
  gate → [publish → deploy → verify → record]). Idempotent via `state.json`.
- `state.json` — idempotency registry (generated / published slugs).
- `runs.log` — append-only record of every run’s result and reason.
- `../content/blog/backlog.json` — topic registry + keyword map + 12-month calendar.

## Stages (matches the rollout in the brief)
1. **Stage 1 (now):** `node automation/publish.mjs` generates ONE draft, runs all
   gates, and stops (`DRAFT_READY`). A human reviews before anything ships.
2. **Stage 2 (after approval):** set repo variable `BLOG_AUTOMATION_ENABLED=true`
   and run with `--publish`. Only `riskTier: "auto"` (evergreen) topics auto-publish.
3. **Stage 3 (always manual):** `riskTier: "manual"` topics — safety, health,
   legal/entry, weather emergencies, closures, prices, hours, wildlife guarantees,
   named people, controversial or uncertain-source topics — are only ever drafted
   for human review, never auto-published.

## Secrets (names only; stored in GitHub Actions / Cloudflare secret manager)
- `ANTHROPIC_API_KEY` — draft writing (gates generation).
- `PEXELS_API_KEY` — image search (optional; no image → draft held for a human).
- `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID` — deploy (gates deployment).

None are committed or printed. If a required key is absent the pipeline HALTs
without fabricating content.

## Schedule
Weekly, one article, in `BLOG_TZ` (default `America/Costa_Rica`). The workflow is
**installed but disabled** — it no-ops unless `BLOG_AUTOMATION_ENABLED=true`. A
missed week is not "made up" with multiple posts. Skipping a scheduled post is
preferable to publishing content that fails any gate.

## Content refresh
`reviewBy` on each post drives refresh cadence (evergreen 6–12 mo; seasonal before
its season; prices/hours/safety more often). The `modified` date changes only when
content meaningfully changes — never just to look fresh.
