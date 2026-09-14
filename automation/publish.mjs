// Blog publishing pipeline (idempotent, gated).
//
// Stages (see the brief):
//   Stage 1 (default) — generate ONE draft for human review, run every gate, stop.
//   Stage 2 (--publish, requires BLOG_AUTOMATION_ENABLED=true) — after approval,
//           promote a passing draft to published, rebuild, deploy, verify, record.
//   Stage 3 — topics with riskTier "manual" are NEVER auto-published; they can
//           only be generated as drafts for human review.
//
// The pipeline is idempotent: a slug is generated/published at most once (guarded
// by the on-disk post file + automation/state.json). A failed gate SKIPS
// publication and records the reason — skipping is preferable to shipping a
// low-quality post.
//
// Secrets are read from the environment (the platform's secret manager). Nothing
// is printed. ANTHROPIC_API_KEY gates draft generation; CLOUDFLARE_API_TOKEN
// gates deployment. Requires Node >= 22.6.
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
const doPublish = args.includes('--publish');
const enabled = process.env.BLOG_AUTOMATION_ENABLED === 'true';

const now = () => new Date().toLocaleString('en-US', { timeZone: TZ });
const record = (o) => { appendFileSync(RUNS, JSON.stringify({ at: new Date().toISOString(), ...o }) + '\n'); console.log(`[${now()}] ${o.result}: ${o.reason || o.slug || ''}`); };
const loadState = () => (existsSync(STATE) ? JSON.parse(readFileSync(STATE, 'utf8')) : { generated: [], published: [] });
const saveState = (s) => writeFileSync(STATE, JSON.stringify(s, null, 2) + '\n');

function sh(cmd, cmdArgs, opts = {}) {
  return execFileSync(cmd, cmdArgs, { cwd: ROOT, stdio: ['ignore', 'pipe', 'pipe'], ...opts }).toString();
}

async function main() {
  const backlog = JSON.parse(readFileSync(join(ROOT, 'content/blog/backlog.json'), 'utf8')).topics;
  const state = loadState();

  // --- 1. Select the next eligible topic -----------------------------------
  const eligible = backlog.filter((t) => {
    if (existsSync(join(ROOT, 'content/blog', `${t.slug}.ts`))) return false; // already exists (idempotent)
    if (state.generated.includes(t.slug)) return false;
    if (t.status && t.status !== 'planned') return false;
    if (doPublish && t.riskTier !== 'auto') return false; // Stage 3 gate
    return true;
  }).sort((a, b) => (a.priority - b.priority) || (a.week - b.week));

  const topic = eligible[0];
  if (!topic) { record({ result: 'SKIP', reason: 'no eligible topic in backlog' }); return; }

  // --- 2. Cannibalization / duplicate-intent check -------------------------
  const existingIntents = backlog
    .filter((t) => t.slug !== topic.slug && (t.status === 'published' || t.status === 'drafted'))
    .map((t) => (t.primaryQuery || '').toLowerCase());
  if (existingIntents.includes((topic.primaryQuery || '').toLowerCase())) {
    record({ result: 'SKIP', slug: topic.slug, reason: `duplicate primary intent "${topic.primaryQuery}"` }); return;
  }

  // --- 3–6. Research + draft + image + provenance --------------------------
  // Generation requires the writing model + image sourcing. This step must
  // produce a content/blog/<slug>.ts post module (draft:true) with: source-backed
  // blocks, verified facts, real internal links, and a locally-served, correctly-
  // licensed image with a full provenance record. It is intentionally the ONLY
  // step that needs an external model, and it is keyed:
  if (!process.env.ANTHROPIC_API_KEY) {
    record({ result: 'HALT', slug: topic.slug, reason: 'ANTHROPIC_API_KEY not set — draft generation requires the writing model (see automation/README.md). Stopping without fabricating content.' });
    return;
  }
  // generateDraft() is implemented in automation/generate.mjs; it writes the post
  // file and returns its slug. Kept out of this orchestrator so the gate/publish
  // logic stays testable without a model.
  const { generateDraft } = await import('./generate.mjs');
  await generateDraft(topic, { root: ROOT });
  state.generated.push(topic.slug);
  saveState(state);

  // --- 7–9. Quality, SEO, accessibility gate -------------------------------
  try {
    sh('node', ['automation/validate.mjs'], { env: { ...process.env, EXPO_PUBLIC_BLOG_DRAFTS: '1' } });
  } catch (e) {
    record({ result: 'SKIP', slug: topic.slug, reason: 'failed quality/SEO/a11y gate — left as draft for review\n' + e.stdout?.toString() });
    return;
  }

  // --- 10–11. Build + built-HTML gate --------------------------------------
  sh('npm', ['run', 'build:web'], { env: { ...process.env, EXPO_PUBLIC_BLOG_DRAFTS: '1', npm_config_cache: process.env.npm_config_cache || '' }, stdio: 'inherit' });
  try {
    sh('node', ['automation/validate.mjs', '--dist'], { env: { ...process.env, EXPO_PUBLIC_BLOG_DRAFTS: '1' } });
  } catch (e) {
    record({ result: 'SKIP', slug: topic.slug, reason: 'failed built-HTML gate (canonical/JSON-LD/H1)' });
    return;
  }

  // --- 12. Stage gate ------------------------------------------------------
  if (!doPublish || !enabled) {
    record({ result: 'DRAFT_READY', slug: topic.slug, reason: 'draft passed all gates; awaiting human review (Stage 1)' });
    return;
  }
  if (topic.riskTier !== 'auto') { record({ result: 'HOLD', slug: topic.slug, reason: 'manual-review category' }); return; }

  // --- Promote to published, rebuild ---------------------------------------
  const file = join(ROOT, 'content/blog', `${topic.slug}.ts`);
  writeFileSync(file, readFileSync(file, 'utf8').replace(/draft:\s*true/, 'draft: false'));
  sh('npm', ['run', 'build:web'], { env: { ...process.env }, stdio: 'inherit' }); // regenerates RSS + sitemap

  // --- 13. Deploy ----------------------------------------------------------
  if (!process.env.CLOUDFLARE_API_TOKEN) { record({ result: 'HALT', slug: topic.slug, reason: 'CLOUDFLARE_API_TOKEN not set — cannot deploy' }); return; }
  sh('npx', ['wrangler', 'pages', 'deploy', 'dist/', '--project-name', 'guanacaste-experiences', '--branch', 'main'], { stdio: 'inherit' });

  // --- 14. Verify the live URL ---------------------------------------------
  const url = `${PROD}/blog/${topic.slug}/`;
  const res = await fetch(url, { cache: 'no-store' });
  const html = await res.text();
  const live = res.ok && html.includes(`${PROD}/blog/${topic.slug}/`) && /"@type":"BlogPosting"/.test(html);
  if (!live) { record({ result: 'ALERT', slug: topic.slug, reason: `live verification failed (HTTP ${res.status})` }); return; }

  // --- 15. Record ----------------------------------------------------------
  state.published.push(topic.slug); saveState(state);
  record({ result: 'PUBLISHED', slug: topic.slug, url });
}

main().catch((e) => { record({ result: 'ERROR', reason: String(e?.message || e) }); process.exit(1); });
