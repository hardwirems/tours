// Generate blog feeds from the *published* (non-draft) posts and keep the
// sitemap in sync. Runs before `expo export`, so its output lands in public/ and
// is copied into dist/. Drafts are excluded (lib/blog reads no draft flag here),
// so nothing unpublished ever reaches the RSS feed or sitemap.
//
// Requires Node >= 22.6 (TypeScript type-stripping). No new dependencies.
import { readFileSync, writeFileSync, existsSync, readdirSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const SITE = 'https://www.guanacasteexperiences.com';

// Import each post module directly (they import only types, which Node strips),
// avoiding the extensionless registry import that Metro resolves but Node doesn't.
const blogDir = join(ROOT, 'content/blog');
const files = readdirSync(blogDir).filter((f) => f.endsWith('.ts') && f !== 'index.ts');
const showDrafts = process.env.EXPO_PUBLIC_BLOG_DRAFTS === '1';
const all = [];
for (const f of files) {
  const mod = await import(pathToFileURL(join(blogDir, f)).href);
  if (mod.post) all.push(mod.post);
}
const posts = all
  .filter((p) => showDrafts || !p.draft)
  .sort((a, b) => (a.published < b.published ? 1 : -1));

function readingTimeMinutes(p) {
  const words = JSON.stringify(p.body).replace(/[^A-Za-z\s]/g, ' ').split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
}

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const rfc822 = (iso) => new Date(iso + (iso.length === 10 ? 'T09:00:00Z' : '')).toUTCString();
const abs = (u) => (/^https?:/.test(u) ? u : `${SITE}${u}`);

// --- RSS 2.0 ---------------------------------------------------------------
const items = posts.map((p) => `    <item>
      <title>${esc(p.title)}</title>
      <link>${SITE}/blog/${p.slug}/</link>
      <guid isPermaLink="true">${SITE}/blog/${p.slug}/</guid>
      <pubDate>${rfc822(p.published)}</pubDate>
      <category>${esc(p.category)}</category>
      <description>${esc(p.description)}</description>
      <enclosure url="${esc(abs(p.hero.src))}" type="image/webp" />
    </item>`).join('\n');

const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Guanacaste Experiences — Travel Blog</title>
    <link>${SITE}/blog/</link>
    <atom:link href="${SITE}/blog-rss.xml" rel="self" type="application/rss+xml" />
    <description>Practical, well-sourced guides to travelling in Guanacaste, Costa Rica.</description>
    <language>en</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
${items}
  </channel>
</rss>
`;
writeFileSync(join(ROOT, 'public/blog-rss.xml'), rss);

// --- Sitemap injection (idempotent, between markers) -----------------------
const smPath = join(ROOT, 'public/sitemap.xml');
if (existsSync(smPath)) {
  let sm = readFileSync(smPath, 'utf8');
  sm = sm.replace(/\n?  <!-- BLOG:START -->[\s\S]*?<!-- BLOG:END -->/g, '');
  if (posts.length) {
    const today = new Date().toISOString().slice(0, 10);
    const urls = [
      { loc: `${SITE}/blog/`, pri: '0.8', mod: today },
      ...posts.map((p) => ({ loc: `${SITE}/blog/${p.slug}/`, pri: '0.7', mod: (p.updated ?? p.published) })),
    ];
    const block = '\n  <!-- BLOG:START -->\n' + urls.map((u) =>
      `  <url>\n    <loc>${u.loc}</loc>\n    <lastmod>${u.mod}</lastmod>\n    <priority>${u.pri}</priority>\n  </url>`).join('\n') +
      '\n  <!-- BLOG:END -->';
    sm = sm.replace('</urlset>', block + '\n</urlset>');
  }
  writeFileSync(smPath, sm);
}

console.log(`build-blog: ${posts.length} published post(s) → RSS + sitemap. ${posts.reduce((n, p) => n + readingTimeMinutes(p), 0)} total reading minutes.`);
