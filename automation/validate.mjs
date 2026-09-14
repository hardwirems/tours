// Blog quality gate + test suite.
//
// Runs the mandatory publication gate against every post module (and, with
// --dist, the built HTML). Exit code 0 = all gates pass; non-zero = at least one
// failure (the CI job and the publish pipeline both block on this). It is
// deliberately strict: skipping a scheduled post is preferable to publishing a
// post that trips any check here.
//
// Usage:
//   node automation/validate.mjs             # validate post modules
//   node automation/validate.mjs --dist      # also validate built dist/ HTML
//   EXPO_PUBLIC_BLOG_DRAFTS=1 node automation/validate.mjs   # include drafts
import { readdirSync, existsSync, readFileSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const PROD = 'https://www.guanacasteexperiences.com';
const withDist = process.argv.includes('--dist');
const showDrafts = process.env.EXPO_PUBLIC_BLOG_DRAFTS === '1';

let failures = 0, checks = 0, warnings = 0;
const fail = (slug, msg) => { failures++; console.error(`  ✗ [${slug}] ${msg}`); };
const warn = (slug, msg) => { warnings++; console.warn(`  ! [${slug}] ${msg}`); };
const ok = () => { checks++; };

// --- Load data -------------------------------------------------------------
const blogDir = join(ROOT, 'content/blog');
const files = readdirSync(blogDir).filter((f) => f.endsWith('.ts') && f !== 'index.ts');
const posts = [];
for (const f of files) {
  const mod = await import(pathToFileURL(join(blogDir, f)).href);
  if (mod.post) posts.push({ file: f, ...mod.post });
  else fail(f, 'file exports no `post`');
}
const { TOURS } = await import(pathToFileURL(join(ROOT, 'lib/tours.ts')).href);
const { DESTINATIONS, CATEGORY_CONTENT } = await import(pathToFileURL(join(ROOT, 'lib/seo-content.ts')).href);
const tourSlugs = new Set(TOURS.map((t) => t.slug));
const destSlugs = new Set(DESTINATIONS.map((d) => d.slug));
const catKeys = new Set(Object.keys(CATEGORY_CONTENT));
const postSlugs = new Set(posts.map((p) => p.slug));

// Known internal route matchers (for broken-link detection).
function internalRouteExists(href) {
  const path = href.split(/[?#]/)[0].replace(/\/$/, '');
  if (['', '/', '/tours', '/destinations', '/about', '/blog', '/compare'].includes(path)) return true;
  let m;
  if ((m = path.match(/^\/tours\/(.+)$/))) return tourSlugs.has(m[1]);
  if ((m = path.match(/^\/destinations\/(.+)$/))) return destSlugs.has(m[1]);
  if ((m = path.match(/^\/categories\/(.+)$/))) return catKeys.has(m[1]);
  if ((m = path.match(/^\/blog\/(.+)$/))) return postSlugs.has(m[1]);
  if (path.startsWith('/go/')) return true; // affiliate redirect (resolved by the Pages function)
  return false;
}

function inlineLinks(text) {
  return [...String(text).matchAll(/\[[^\]]+\]\(([^)]+)\)/g)].map((m) => m[1]);
}
function collectLinks(post) {
  const links = [post.cta.href];
  for (const b of post.body) {
    if (b.type === 'p') links.push(...inlineLinks(b.text));
    if (b.type === 'ul' || b.type === 'ol') b.items.forEach((i) => links.push(...inlineLinks(i)));
    if (b.type === 'faq') b.items.forEach((i) => links.push(...inlineLinks(i.a)));
    if (b.type === 'cta') links.push(b.href);
    if (b.type === 'table') b.rows.flat().forEach((c) => links.push(...inlineLinks(c)));
  }
  return links;
}
function wordCount(post) {
  const s = JSON.stringify(post.body).replace(/[^A-Za-z\s]/g, ' ');
  return s.split(/\s+/).filter(Boolean).length;
}

// --- Cross-post gates ------------------------------------------------------
const seenSlug = new Map(), seenIntent = new Map();
for (const p of posts) {
  if (seenSlug.has(p.slug)) fail(p.slug, `duplicate slug (also ${seenSlug.get(p.slug)})`); else seenSlug.set(p.slug, p.file); ok();
  const q = (p.primaryQuery || '').toLowerCase().trim();
  if (q && seenIntent.has(q)) fail(p.slug, `duplicate primary query "${q}" (cannibalizes ${seenIntent.get(q)})`); else if (q) seenIntent.set(q, p.slug); ok();
}

// --- Per-post gates --------------------------------------------------------
for (const p of posts) {
  const s = p.slug;
  const required = ['slug', 'title', 'metaTitle', 'description', 'category', 'primaryQuery', 'intent', 'author', 'published', 'hero', 'excerpt', 'body', 'sources', 'cta'];
  for (const k of required) { if (p[k] == null || (Array.isArray(p[k]) && p[k].length === 0 && k !== 'sources')) fail(s, `missing required field: ${k}`); else ok(); }

  if (p.file !== `${s}.ts`) fail(s, `slug must match filename (${p.file})`); else ok();
  if (!/^[a-z0-9-]+$/.test(s)) fail(s, 'slug must be lowercase-kebab'); else ok();

  // Metadata
  if (!p.metaTitle || p.metaTitle.length > 62) warn(s, `meta title length ${p.metaTitle?.length} (aim <=60)`);
  if (!p.description || p.description.length < 50 || p.description.length > 165) fail(s, `meta description length ${p.description?.length} (want 50–165)`); else ok();
  if (!/^\d{4}-\d{2}-\d{2}/.test(p.published)) fail(s, 'published must be an ISO date'); else ok();

  // Headings / not thin
  const h2s = p.body.filter((b) => b.type === 'h2').length;
  if (h2s < 2) fail(s, `only ${h2s} H2 sections (needs structure)`); else ok();
  const wc = wordCount(p);
  if (wc < 350) fail(s, `only ~${wc} words (too thin)`); else ok();

  // Sources
  if (!Array.isArray(p.sources) || p.sources.length < 1) fail(s, 'no sources'); else ok();
  for (const src of (p.sources || [])) {
    if (!src.url || !/^https?:\/\//.test(src.url)) fail(s, `source missing valid url: ${src.title}`); else ok();
    if (!src.accessed) fail(s, `source missing accessed date: ${src.title}`); else ok();
    if (!src.supports) warn(s, `source has no "supports" note: ${src.title}`);
  }

  // Hero image: exists locally + honest provenance
  const heroPath = join(ROOT, 'public', p.hero.src.replace(/^\//, ''));
  if (!p.hero.src.startsWith('/images/')) fail(s, 'hero must be served locally under /images/'); else ok();
  if (!existsSync(heroPath)) fail(s, `hero image file missing: ${p.hero.src}`); else ok();
  if (!p.hero.alt || p.hero.alt.length < 8) fail(s, 'hero missing descriptive alt'); else ok();
  if (p.hero.credit) {
    for (const k of ['source', 'sourceUrl', 'author', 'license', 'licenseUrl', 'downloaded', 'depicts']) {
      if (!p.hero.credit[k]) fail(s, `hero credit missing ${k}`); else ok();
    }
  } else warn(s, 'hero has no credit/provenance record');

  // Body images: alt + exists
  for (const b of p.body.filter((b) => b.type === 'image')) {
    if (!b.alt || b.alt.length < 8) fail(s, 'body image missing alt');
    if (b.src.startsWith('/images/') && !existsSync(join(ROOT, 'public', b.src.replace(/^\//, '')))) fail(s, `body image missing: ${b.src}`);
    else ok();
  }

  // Internal links resolve (no broken links) + at least one commercial/cluster link
  const links = collectLinks(p);
  let commercial = 0;
  for (const l of links) {
    if (l.startsWith('/')) { if (!internalRouteExists(l)) fail(s, `broken internal link: ${l}`); else ok(); }
    if (/^\/(tours|destinations|categories|go)\b/.test(l)) commercial++;
    if (/(pages\.dev|localhost|127\.0\.0\.1)/.test(l)) fail(s, `preview/local URL leaked in link: ${l}`);
  }
  if (commercial < 1) fail(s, 'no link to a commercial/experience page'); else ok();

  // CTA target valid
  if (!p.cta.href || (!p.cta.href.startsWith('/') || !internalRouteExists(p.cta.href))) fail(s, `CTA href invalid: ${p.cta.href}`); else ok();

  // Related references resolve
  for (const t of (p.relatedTours || [])) { if (!tourSlugs.has(t)) fail(s, `relatedTour not found: ${t}`); else ok(); }
  for (const d of (p.relatedDestinations || [])) { if (!destSlugs.has(d)) fail(s, `relatedDestination not found: ${d}`); else ok(); }
  for (const r of (p.relatedPosts || [])) { if (!postSlugs.has(r)) fail(s, `relatedPost not found: ${r}`); else ok(); }

  // Voice: flag banned AI clichés
  const banned = /nestled in|hidden gem|breathtaking paradise|whether you'?re a|look no further|in conclusion|without a doubt/i;
  const proseText = JSON.stringify(p.body);
  if (banned.test(proseText)) fail(s, 'contains a banned cliché phrase'); else ok();
}

// --- Optional: validate built HTML ----------------------------------------
if (withDist) {
  const distBlog = join(ROOT, 'dist/blog');
  for (const p of posts.filter((p) => showDrafts || !p.draft)) {
    const html = join(distBlog, p.slug, 'index.html');
    if (!existsSync(html)) { fail(p.slug, 'dist HTML not built'); continue; }
    const h = readFileSync(html, 'utf8');
    if (!h.includes(`${PROD}/blog/${p.slug}/`)) fail(p.slug, 'canonical/OG url not on production domain'); else ok();
    if (/pages\.dev|localhost|127\.0\.0\.1/.test(h.match(/rel="canonical" href="([^"]+)"/)?.[1] || '')) fail(p.slug, 'preview-domain canonical leak');
    if (!/"@type":"BlogPosting"/.test(h)) fail(p.slug, 'BlogPosting JSON-LD missing'); else ok();
    if (!/"@type":"BreadcrumbList"/.test(h)) fail(p.slug, 'BreadcrumbList JSON-LD missing'); else ok();
    // JSON-LD parses
    for (const m of h.matchAll(/application\/ld\+json"[^>]*>(.*?)<\/script>/gs)) {
      try { JSON.parse(m[1].replace(/\\u003c/g, '<')); ok(); } catch { fail(p.slug, 'JSON-LD does not parse'); }
    }
    if ((h.match(/<h1|aria-level="1"/g) || []).length < 1) fail(p.slug, 'no H1'); else ok();
  }
}

console.log(`\n${failures ? '✗' : '✓'} validate: ${checks} checks, ${warnings} warning(s), ${failures} failure(s) across ${posts.length} post(s)${withDist ? ' (+dist)' : ''}.`);
process.exit(failures ? 1 : 0);
