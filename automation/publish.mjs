// Blog pipeline — two gated modes for a human-approval flow.
//
//   generate  (default)  — select ONE eligible topic, write a draft (draft:true),
//                          run every quality/SEO/a11y gate, build a drafts-enabled
//                          dist/ for a preview deploy, then STOP. Emits GitHub
//                          Action outputs (candidate/slug/title) so the workflow
//                          can request human approval. Never deploys, never commits.
//   promote <slug>       — take an already-generated, already-approved draft, flip
//                          it to published, rebuild, deploy to production, verify
//                          the live URL, and record it. Runs only after a human
//                          approves the gated `publish` job in GitHub.
//
// Splitting the old monolithic run in two is what makes every post pass through a
// human Approve gate: generate proposes, a person reviews the preview and approves,
// promote publishes. A failed gate SKIPs (candidate=false) so no approval is even
// requested — skipping a week is preferable to shipping a post that fails a gate.
//
// Idempotent: a slug is generated/published at most once (guarded by the on-disk
// post file + automation/state.json). Secrets are read from the environment and
// never printed. ANTHROPIC_API_KEY gates generation; CLOUDFLARE_API_TOKEN gates
// deployment. Requires Node >= 22.6.
import { readFileSync, writeFileSync, existsSync, appendFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { execFileSync } from 'node:child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const PROD = 'https://www.guanacasteexperiences.com';
const STATE = join(__dirname, 'state.json');
const RUNS = join(__dirname, 'runs.log');
const TZ = process.env.BLOG_TZ || 'America/Costa_Rica';

const args = process.argv.slice(2);
const promoteIdx = args.indexOf('--promote');
const mode = promoteIdx >= 0 ? 'promote' : 'generate';
const promoteSlug = promoteIdx >= 0 ? args[promoteIdx + 1] : null;
const autoOnly = args.includes('--auto-only');
const enabled = process.env.BLOG_AUTOMATION_ENABLED === 'true';

const now = () => new Date().toLocaleString('en-US', { timeZone: TZ });
const record = (o) => { appendFileSync(RUNS, JSON.stringify({ at: new Date().toISOString(), ...o }) + '\n'); console.log(`[${now()}] ${o.result}: ${o.reason || o.slug || ''}`); };
const loadState = () => (existsSync(STATE) ? JSON.parse(readFileSync(STATE, 'utf8')) : { generated: [], published: [] });
const saveState = (s) => writeFileSync(STATE, JSON.stringify(s, null, 2) + '\n');

// GitHub Actions plumbing (no-ops when run locally).
const ghOut = (k, v) => { if (process.env.GITHUB_OUTPUT) appendFileSync(process.env.GITHUB_OUTPUT, `${k}=${v}\n`); };
const ghSummary = (md) => { if (process.env.GITHUB_STEP_SUMMARY) appendFileSync(process.env.GITHUB_STEP_SUMMARY, md + '\n'); };
const titleOf = (slug) => { const m = readFileSync(join(ROOT, 'content/blog', `${slug}.ts`), 'utf8').match(/^\s*title:\s*(['"])(.*?)\1/m); return m ? m[2] : slug; };

function sh(cmd, cmdArgs, opts = {}) {
  return execFileSync(cmd, cmdArgs, { cwd: ROOT, stdio: ['ignore', 'pipe', 'pipe'], ...opts }).toString();
}

// ---------------------------------------------------------------------------
// generate — propose ONE draft and gate it. No deploy, no commit, no publish.
// ---------------------------------------------------------------------------
async function generate() {
  const backlog = JSON.parse(readFileSync(join(ROOT, 'content/blog/backlog.json'), 'utf8')).topics;
  const state = loadState();

  // --- 1. Select the next eligible topic -----------------------------------
  const eligible = backlog.filter((t) => {
    if (existsSync(join(ROOT, 'content/blog', `${t.slug}.ts`))) return false; // already exists (idempotent)
    if (state.generated.includes(t.slug)) return false;
    if (t.status && t.status !== 'planned') return false;
    if (autoOnly && t.riskTier !== 'auto') return false; // scheduled slot = evergreen only (Stage 3 stays human-initiated)
    return true;
  }).sort((a, b) => (a.priority - b.priority) || (a.week - b.week));

  const topic = eligible[0];
  if (!topic) { record({ result: 'SKIP', reason: 'no eligible topic in backlog' }); ghOut('candidate', 'false'); return; }

  // --- 2. Cannibalization / duplicate-intent check -------------------------
  const existingIntents = backlog
    .filter((t) => t.slug !== topic.slug && (t.status === 'published' || t.status === 'drafted'))
    .map((t) => (t.primaryQuery || '').toLowerCase());
  if (existingIntents.includes((topic.primaryQuery || '').toLowerCase())) {
    record({ result: 'SKIP', slug: topic.slug, reason: `duplicate primary intent "${topic.primaryQuery}"` }); ghOut('candidate', 'false'); return;
  }

  // --- 3–6. Research + draft + image + provenance --------------------------
  if (!process.env.ANTHROPIC_API_KEY) {
    record({ result: 'HALT', slug: topic.slug, reason: 'ANTHROPIC_API_KEY not set — draft generation requires the writing model (see automation/README.md). Stopping without fabricating content.' });
    ghOut('candidate', 'false'); return;
  }
  const { generateDraft } = await import('./generate.mjs');
  await generateDraft(topic, { root: ROOT });
  state.generated.push(topic.slug);
  saveState(state);

  // --- 7–9. Quality, SEO, accessibility gate -------------------------------
  try {
    sh('node', ['automation/validate.mjs'], { env: { ...process.env, EXPO_PUBLIC_BLOG_DRAFTS: '1' } });
  } catch (e) {
    record({ result: 'SKIP', slug: topic.slug, reason: 'failed quality/SEO/a11y gate — left as draft for review\n' + e.stdout?.toString() });
    ghOut('candidate', 'false'); return;
  }

  // --- 10–11. Build (drafts visible) + built-HTML gate ---------------------
  sh('npm', ['run', 'build:web'], { env: { ...process.env, EXPO_PUBLIC_BLOG_DRAFTS: '1', npm_config_cache: process.env.npm_config_cache || '' }, stdio: 'inherit' });
  try {
    sh('node', ['automation/validate.mjs', '--dist'], { env: { ...process.env, EXPO_PUBLIC_BLOG_DRAFTS: '1' } });
  } catch (e) {
    record({ result: 'SKIP', slug: topic.slug, reason: 'failed built-HTML gate (canonical/JSON-LD/H1)' });
    ghOut('candidate', 'false'); return;
  }

  // --- Draft ready: hand off to the human-approval gate --------------------
  // dist/ now holds a drafts-visible build for the preview deploy; the workflow
  // deploys it and requests approval. Nothing is published or committed here.
  const title = titleOf(topic.slug);
  record({ result: 'DRAFT_READY', slug: topic.slug, reason: 'passed all gates; awaiting human approval' });
  ghOut('candidate', 'true');
  ghOut('slug', topic.slug);
  ghOut('title', title);
  ghSummary(`### 📝 Draft ready for approval\n\n**${title}**\n\n- slug: \`${topic.slug}\`\n- passed the quality, SEO and built-HTML gates\n\nApprove the **publish** job to make it live; reject to discard.`);
}

// ---------------------------------------------------------------------------
// promote — publish an already-approved draft. Called only after a human
// approves the gated job. Flip → build → deploy → verify → record.
// ---------------------------------------------------------------------------
async function promote() {
  const slug = promoteSlug;
  if (!slug) { record({ result: 'ERROR', reason: '--promote requires a slug' }); process.exit(1); }
  const file = join(ROOT, 'content/blog', `${slug}.ts`);
  if (!existsSync(file)) { record({ result: 'ERROR', slug, reason: 'approved draft file not found in workspace' }); process.exit(1); }

  // Flip the approved draft to published and rebuild (regenerates RSS + sitemap).
  writeFileSync(file, readFileSync(file, 'utf8').replace(/draft:\s*true/, 'draft: false'));
  sh('npm', ['run', 'build:web'], { env: { ...process.env }, stdio: 'inherit' });

  // Final built-HTML gate on the real (non-draft) output — belt and braces.
  try {
    sh('node', ['automation/validate.mjs', '--dist']);
  } catch (e) {
    record({ result: 'SKIP', slug, reason: 'failed built-HTML gate at promote — not deploying' }); process.exit(1);
  }

  // --- Deploy to production ------------------------------------------------
  if (!process.env.CLOUDFLARE_API_TOKEN) { record({ result: 'HALT', slug, reason: 'CLOUDFLARE_API_TOKEN not set — cannot deploy' }); process.exit(1); }
  sh('npx', ['wrangler', 'pages', 'deploy', 'dist/', '--project-name', 'guanacaste-experiences', '--branch', 'main'], { stdio: 'inherit' });

  // --- Verify the live URL -------------------------------------------------
  const url = `${PROD}/blog/${slug}/`;
  const res = await fetch(url, { cache: 'no-store' });
  const html = await res.text();
  const live = res.ok && html.includes(`${PROD}/blog/${slug}/`) && /"@type":"BlogPosting"/.test(html);
  if (!live) { record({ result: 'ALERT', slug, reason: `live verification failed (HTTP ${res.status})` }); process.exit(1); }

  // --- Record --------------------------------------------------------------
  const state = loadState();
  if (!state.published.includes(slug)) state.published.push(slug);
  saveState(state);
  record({ result: 'PUBLISHED', slug, url });
  ghOut('published', 'true');
  ghOut('url', url);
  ghSummary(`### ✅ Published\n\n[${titleOf(slug)}](${url})`);
}

const run = mode === 'promote' ? promote : generate;
run().catch((e) => { record({ result: 'ERROR', reason: String(e?.message || e) }); process.exit(1); });
