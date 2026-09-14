// Test + validation suite for the transportation section.
//   node automation/validate-transportation.mjs [--dist dist]
// Covers: inventory quality gate, affiliate-link generation, missing/inactive
// data, structured data, robots/noindex, secret leakage, sitemap, analytics.
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const distArg = process.argv.indexOf('--dist');
const DIST = distArg >= 0 ? join(ROOT, process.argv[distArg + 1] || 'dist') : null;
let pass = 0, fail = 0;
const ok = () => pass++;
const bad = (m) => { fail++; console.error('  ✗ ' + m); };
const MIN_RATING = 4.5, MIN_REVIEWS = 20;

const { TRANSFERS, LOCAL_RENTALS } = await import(pathToFileURL(join(ROOT, 'lib/transportation-data.ts')).href);
const { TRANSFER_URLS } = await import(pathToFileURL(join(ROOT, 'lib/affiliate-transfers.ts')).href);
const { ROUTES, LOCAL_CATEGORIES } = await import(pathToFileURL(join(ROOT, 'lib/transportation-content.ts')).href);

// --- 1. Inventory quality gate ---------------------------------------------
for (const t of TRANSFERS) {
  if (t.rating >= MIN_RATING) ok(); else bad(`${t.code} rating ${t.rating} < ${MIN_RATING}`);
  if (t.reviews >= MIN_REVIEWS) ok(); else bad(`${t.code} reviews ${t.reviews} < ${MIN_REVIEWS}`);
  if (t.image && t.image.url && t.image.width && t.image.height) ok(); else bad(`${t.code} missing image or dimensions (CLS risk)`);
  if (t.origin === 'LIR' || t.origin === 'SJO') ok(); else bad(`${t.code} invalid origin ${t.origin}`);
  if (['private', 'shared'].includes(t.service)) ok(); else bad(`${t.code} invalid service`);
}

// --- 2. Affiliate-link generation (commissionable, via /go) ----------------
for (const t of [...TRANSFERS, ...LOCAL_RENTALS]) {
  const key = `viator/${t.slug}`;
  const url = TRANSFER_URLS[key];
  if (!url) { bad(`${t.code} has no /go affiliate mapping (${key})`); continue; }
  if (url.startsWith('https://www.viator.com/')) ok(); else bad(`${t.code} affiliate url not a viator.com link`);
  if (/[?&]mcid=/.test(url) && /[?&]pid=/.test(url)) ok(); else bad(`${t.code} affiliate url missing mcid/pid attribution`);
}
// No orphan mappings
for (const key of Object.keys(TRANSFER_URLS)) {
  const slug = key.replace(/^viator\//, '');
  if ([...TRANSFERS, ...LOCAL_RENTALS].some((p) => p.slug === slug)) ok();
  else bad(`orphan affiliate mapping: ${key}`);
}

// --- 3. Content integrity --------------------------------------------------
for (const r of ROUTES) { if (r.title && r.description && r.h1 && r.intro.length) ok(); else bad(`route ${r.slug} missing content`); }
const gapDrafts = LOCAL_CATEGORIES.filter((c) => !c.hasQualifyingInventory).map((c) => c.slug);
if (gapDrafts.length >= 5) ok(); else bad('expected >=5 documented gap categories');
if (LOCAL_RENTALS.every((r) => r.rating >= MIN_RATING && r.reviews >= MIN_REVIEWS)) ok(); else bad('a local rental is below the quality bar');

// --- 4. Built-output checks (--dist) ---------------------------------------
if (DIST) {
  const read = (p) => { const f = join(DIST, p, 'index.html'); return existsSync(f) ? readFileSync(f, 'utf8') : null; };
  const indexable = ['transportation', 'transportation/airport-transfers', 'transportation/airport-transfers/lir', 'transportation/airport-transfers/sjo', 'transportation/getting-around', 'transportation/golf-cart-rentals', ...ROUTES.map((r) => `transportation/airport-transfers/lir/${r.slug}`)];
  const noindexDrafts = gapDrafts.filter((s) => s !== 'golf-cart-rentals').map((s) => `transportation/${s}`);
  const titles = new Map();
  for (const p of indexable) {
    const h = read(p);
    if (!h) { bad(`${p} not built`); continue; }
    if (/<h1|aria-level="1"/.test(h)) ok(); else bad(`${p} no H1`);
    const canon = h.match(/rel="canonical" href="([^"]+)"/)?.[1];
    if (canon && canon.includes(`/${p}/`)) ok(); else bad(`${p} canonical mismatch (${canon})`);
    if (/name="robots" content="index/.test(h)) ok(); else bad(`${p} should be indexable`);
    const title = h.match(/<title[^>]*>([^<]+)</)?.[1];
    if (title && title.length <= 65) ok(); else bad(`${p} title missing/too long (${title?.length})`);
    if (title) { if (titles.has(title)) bad(`duplicate title: ${title}`); else { titles.set(title, p); ok(); } }
    const desc = h.match(/name="description" content="([^"]+)"/)?.[1];
    if (desc && desc.length >= 50 && desc.length <= 165) ok(); else bad(`${p} meta description length ${desc?.length}`);
    for (const m of h.matchAll(/application\/ld\+json">([^<]+)</g)) { try { JSON.parse(m[1].replace(/\\u003c/g, '<')); ok(); } catch { bad(`${p} invalid JSON-LD`); } }
  }
  for (const p of noindexDrafts) {
    const h = read(p);
    if (!h) { bad(`${p} not built`); continue; }
    if (/name="robots" content="noindex/.test(h)) ok(); else bad(`${p} MUST be noindex (gap draft)`);
  }
  // Secrets + affiliate exposure introduced by transportation (client bundle)
  const jsDir = join(DIST, '_expo/static/js/web');
  const bundle = existsSync(jsDir) ? readdirSync(jsDir).filter((f) => f.endsWith('.js')).map((f) => readFileSync(join(jsDir, f), 'utf8')).join('') : '';
  if (!/exp-api-key|VIATOR_API_KEY/.test(bundle)) ok(); else bad('API key leaked into client bundle');
  // transfer productUrls must NOT be in the client bundle (they live in the /go function)
  const leakedTransfer = Object.values(TRANSFER_URLS).some((u) => bundle.includes(u));
  if (!leakedTransfer) ok(); else bad('a transfer affiliate URL leaked into the client bundle');
  // Analytics events wired
  for (const ev of ['view_transportation_hub', 'select_destination', 'click_viator_booking', 'select_airport']) {
    if (bundle.includes(ev)) ok(); else bad(`analytics event not wired: ${ev}`);
  }
  // Sitemap inclusion/exclusion
  const sm = readFileSync(join(ROOT, 'public/sitemap.xml'), 'utf8');
  if (sm.includes('/transportation/airport-transfers/lir/</loc>') || sm.includes('/transportation/airport-transfers/lir/')) ok(); else bad('LIR page missing from sitemap');
  for (const s of noindexDrafts) if (!sm.includes(`/${s}/`)) ok(); else bad(`noindex draft ${s} must NOT be in sitemap`);
}

console.log(`\n${fail === 0 ? '✓' : '✗'} transportation: ${pass} checks, ${fail} failure(s)${DIST ? ' (+dist)' : ''}.`);
process.exit(fail ? 1 : 0);
