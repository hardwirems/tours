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
- `publish.mjs` — two gated modes:
  - `generate` (default) — select → dedup → generate → gate → build (drafts
    visible) → stop. Emits Action outputs (`candidate`/`slug`/`title`). Never
    deploys or commits. `--auto-only` restricts selection to evergreen topics.
  - `promote <slug>` — flip an approved draft to published → build → deploy →
    verify → record. Idempotent via `state.json`.
- `state.json` — idempotency registry (generated / published slugs).
- `runs.log` — append-only record of every run’s result and reason.
- `../content/blog/backlog.json` — topic registry + keyword map + 12-month calendar.

## How a post gets published (human approval on every one)
The weekly workflow (`.github/workflows/publish-blog.yml`) runs two jobs:

    generate → deploy preview → [👤 approve in GitHub] → promote → production

The `publish` job targets the **`blog-approval` Environment**, which has a required
reviewer. GitHub **pauses** there and **emails the reviewer** an Approve/Reject
request linking the preview. Nothing is committed to `main` or deployed to
production until a human approves. Reject = the draft is discarded (the preview is
ephemeral; `main` is untouched).

## Stages (matches the rollout in the brief)
1. **Stage 1:** generate ONE draft, run all gates, stop (`DRAFT_READY`). Used for
   local/manual review.
2. **Stage 2 (current, after approval):** set repo variable
   `BLOG_AUTOMATION_ENABLED=true`. The weekly run then generates a draft and
   requests human approval before publishing. **Every** post is human-approved —
   there is no unattended auto-publish.
3. **Stage 3 (always manual):** the scheduled slot only *selects* `riskTier: "auto"`
   (evergreen) topics. `riskTier: "manual"` topics — safety, health, legal/entry,
   weather emergencies, closures, prices, hours, wildlife guarantees, named people,
   controversial or uncertain-source topics — are only drafted via a deliberate
   manual run (`workflow_dispatch` with `auto_only=false`), never auto-selected.

## Secrets (names only; stored in GitHub Actions / Cloudflare secret manager)
- `ANTHROPIC_API_KEY` — draft writing (gates generation).
- `PEXELS_API_KEY` — image search (optional; no image → draft held for a human).
- `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID` — deploy (gates deployment).

None are committed or printed. If a required key is absent the pipeline HALTs
without fabricating content.

## Schedule
Weekly (Wed 14:00 UTC ≈ 08:00 `America/Costa_Rica`), one article. Scheduled runs
no-op unless `BLOG_AUTOMATION_ENABLED=true`. A missed or rejected week is not "made
up" with multiple posts. Skipping is preferable to publishing content that fails a
gate — a run that finds no eligible topic, or whose draft fails a gate, exits with
`candidate=false` and never requests approval.

## One-time setup for the approval gate
1. Create the `blog-approval` Environment with a required reviewer (the person who
   approves): repo **Settings → Environments → New environment → `blog-approval` →
   Required reviewers**.
2. So the approval email reaches the right inbox, set that reviewer’s GitHub
   **notification email** to the desired address (their **Settings → Emails**, add +
   verify it; **Settings → Notifications** → email, and keep Actions/“review
   requested” email on).
3. Add secrets (repo **Settings → Secrets and variables → Actions**):
   `ANTHROPIC_API_KEY`, `PEXELS_API_KEY`, `CLOUDFLARE_API_TOKEN`,
   `CLOUDFLARE_ACCOUNT_ID`.
4. Set variable `BLOG_AUTOMATION_ENABLED=true` (and optionally `BLOG_TZ`).

## Content refresh
`reviewBy` on each post drives refresh cadence (evergreen 6–12 mo; seasonal before
its season; prices/hours/safety more often). The `modified` date changes only when
content meaningfully changes — never just to look fresh.
