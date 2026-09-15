// De-hydrate static content routes.
//
// These pages are fully server-rendered (content, styles and links are all in
// the HTML), so the ~2MB app bundle only re-does work the browser already did.
// For an explicit allow-list of routes we strip the bundle (and Expo's hydrate
// flag) and swap in the tiny public/light.js runtime, which supplies the only
// interactivity those pages need (mobile menu + cookie consent). Interactive
// routes (tours, compare, dashboard, the LIR finder) are left untouched.
//
// Runs after `expo export` in build:web. Fails the build loudly if a target
// still references the bundle, or if the interactive control page lost it.
import { readFileSync, writeFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const DIST = join(ROOT, 'dist');

// --- Phase 1 allow-list: individual blog POSTS (fully static articles). ------
// The blog INDEX is intentionally left hydrated — its topic chips filter via a
// URL param read in JS (useLocalSearchParams), which a de-hydrated page can't
// apply. About and the homepage follow once this is proven (they need the same
// image-in-SSR treatment as the posts already have).
function collectTargets() {
  const targets = [];
  const add = (p) => { if (existsSync(p)) targets.push(p); };
  const blogDir = join(DIST, 'blog');
  if (existsSync(blogDir)) {
    for (const entry of readdirSync(blogDir)) {
      const dir = join(blogDir, entry);
      const idx = join(dir, 'index.html');
      if (statSync(dir).isDirectory() && existsSync(idx)) add(idx); // blog/<slug>/index.html only
    }
  }
  return [...new Set(targets)];
}

// A route that MUST stay hydrated — sanity check that we didn't over-reach.
const CONTROL = join(DIST, 'tours/index.html');

const BUNDLE_RE = /<script[^>]*src="\/_expo\/static\/js\/web\/index-[a-f0-9]+\.js"[^>]*><\/script>/g;
const HYDRATE_RE = /<script[^>]*>\s*globalThis\.__EXPO_ROUTER_HYDRATE__\s*=\s*true;\s*<\/script>/g;
const LIGHT_TAG = '<script src="/light.js" defer></script>';

function dehydrate(file) {
  let html = readFileSync(file, 'utf8');
  const hadBundle = BUNDLE_RE.test(html);
  BUNDLE_RE.lastIndex = 0;
  html = html.replace(BUNDLE_RE, '').replace(HYDRATE_RE, '');
  if (!html.includes(LIGHT_TAG)) html = html.replace('</body>', `${LIGHT_TAG}</body>`);
  writeFileSync(file, html);
  // Verify the bundle is truly gone.
  if (/\/_expo\/static\/js\/web\/index-[a-f0-9]+\.js/.test(html)) {
    throw new Error(`dehydrate: bundle still referenced in ${file.replace(DIST, 'dist')}`);
  }
  return hadBundle;
}

const targets = collectTargets();
if (targets.length === 0) {
  console.error('✗ dehydrate: no target pages found (did expo export run?)');
  process.exit(1);
}

let changed = 0;
for (const f of targets) if (dehydrate(f)) changed++;

// Control page must still be hydrated.
if (existsSync(CONTROL)) {
  const ctrl = readFileSync(CONTROL, 'utf8');
  if (!/\/_expo\/static\/js\/web\/index-[a-f0-9]+\.js/.test(ctrl)) {
    console.error('✗ dehydrate: control page tours/index.html lost its bundle — allow-list too broad');
    process.exit(1);
  }
}
// light.js must ship (public/ is copied into dist by expo export).
if (!existsSync(join(DIST, 'light.js'))) {
  console.error('✗ dehydrate: dist/light.js missing (expected from public/light.js)');
  process.exit(1);
}

console.log(`✓ dehydrate: ${changed}/${targets.length} blog post(s) de-hydrated (bundle removed, light.js injected); blog index + tours/ left hydrated.`);
