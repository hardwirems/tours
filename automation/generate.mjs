// Draft generation (the one model-dependent step of the pipeline).
//
// Turns a backlog topic into a source-backed content/blog/<slug>.ts DRAFT plus a
// locally-served, correctly-licensed hero image with a full provenance record.
// Requires ANTHROPIC_API_KEY (writing) and PEXELS_API_KEY (image search). If an
// accurate, properly-licensed image can't be found, the draft is written without
// a hero and flagged for a human to add a verified image or a diagram — never a
// misleading substitute.
//
// The model is instructed to return STRICT JSON matching the BlogPost block
// schema, with the brief's writing and sourcing rules enforced in the prompt AND
// re-checked by automation/validate.mjs afterwards (belt and braces).
import { writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';

const MODEL = process.env.BLOG_MODEL || 'claude-opus-4-8';
const PEXELS = 'https://api.pexels.com/v1/search';

const SYSTEM = `You are a senior travel editor for Guanacaste Experiences, a Costa Rica tours site.
Write like a knowledgeable, honest editor — natural sentence variation, specific and useful, acknowledging tradeoffs and who an activity suits or doesn't. NEVER:
- invent first-hand visits, quotes, reviews, ratings, prices, hours, travel times, wildlife/safety guarantees, operator credentials, availability, "local secrets" or personal recommendations;
- use the phrases "nestled in", "hidden gem", "breathtaking paradise", "whether you're a…", "look no further", "in conclusion";
- keyword-stuff, pad to a word count, or use fake enthusiasm.
If a fact can't be verified from an authoritative source (ICT/Visit Costa Rica, SINAC, IMN, government/airport/operator official info), omit it or qualify it clearly. Prefer official Costa Rican sources. Use correct Costa Rican place names and accents.
Return ONLY strict JSON matching the requested schema. No prose outside the JSON.`;

function userPrompt(topic) {
  return `Write a Guanacaste travel article as JSON for this brief:
Title: ${topic.title}
Primary query: ${topic.primaryQuery}
Search intent: ${topic.intent}
Reader problem: ${topic.readerProblem}
Unique angle: ${topic.angle}
Suggested sources: ${(topic.sources || []).join(', ')}
Link naturally to these internal routes where relevant (use markdown links in block text): commercial pages /tours, /tours?category=..., /destinations/<slug>, and related posts /blog/<slug>. Related tours: ${(topic.relatedTours||[]).join(', ')||'(pick relevant)'}. CTA: ${topic.cta}.

Return JSON with EXACTLY these fields (types match lib/blog.ts BlogPost, minus slug/hero/dates which the pipeline fills):
{ "metaTitle": "<=60 chars", "description": "50-160 chars", "excerpt": "1-2 sentences",
  "tags": ["..."], "author": {"name":"Guanacaste Experiences editorial team","role":"Travel editors"},
  "body": [ {block} ... ],  // blocks: p, h2, h3, ul{items}, ol{items}, table{caption,headers,rows}, callout{variant,title,text}, quote{text,cite}, cta{label,href,note}, faq{items:[{q,a}]}
  "sources": [ {"title":"...","url":"https://...","accessed":"${new Date().toISOString().slice(0,10)}","supports":"the claim(s) this backs"} ],
  "relatedTours": ["<tour-slug>"], "relatedDestinations": ["<dest-slug>"], "relatedPosts": ["<post-slug>"] }
Requirements: answer the main question in the first paragraph; at least 2 H2 sections; at least one comparison table OR a useful list; at least one link to a commercial/experience page; 2-4 FAQ items; every non-obvious/volatile fact backed by a source with a real URL. Length: only as long as the intent needs (roughly ${topic.funnel === 'top' ? '700-1200' : '1000-1800'} words).`;
}

async function callModel(topic) {
  const headers = { 'content-type': 'application/json', 'x-api-key': process.env.ANTHROPIC_API_KEY, 'anthropic-version': '2023-06-01' };
  // An org-level (unscoped) key must name a workspace on every request; a
  // workspace-scoped key does not. Setting ANTHROPIC_WORKSPACE_ID makes an
  // unscoped key work; it is harmless (ignored) with a scoped key.
  if (process.env.ANTHROPIC_WORKSPACE_ID) headers['anthropic-workspace-id'] = process.env.ANTHROPIC_WORKSPACE_ID;
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers,
    body: JSON.stringify({ model: MODEL, max_tokens: 8000, system: SYSTEM, messages: [{ role: 'user', content: userPrompt(topic) }] }),
  });
  if (!res.ok) throw new Error(`Anthropic HTTP ${res.status}: ${await res.text()}`);
  const data = await res.json();
  const text = (data.content || []).filter((c) => c.type === 'text').map((c) => c.text).join('');
  const json = text.slice(text.indexOf('{'), text.lastIndexOf('}') + 1);
  return JSON.parse(json);
}

// Source an accurate, properly-licensed image via the Pexels API; download +
// optimize to WebP; return the local path + a full provenance record. Returns
// null (draft gets no hero, flagged for human) if nothing suitable is found —
// never a misleading substitute.
async function sourceImage(topic, root) {
  if (!process.env.PEXELS_API_KEY) return null;
  const q = encodeURIComponent(topic.imageBrief || `${topic.title} Costa Rica`);
  const res = await fetch(`${PEXELS}?query=${q}&orientation=landscape&per_page=30`, { headers: { Authorization: process.env.PEXELS_API_KEY } });
  if (!res.ok) return null;
  const { photos = [] } = await res.json();
  // Only consider photos with a real description, so the alt text and provenance
  // are always truthful about what the image actually shows.
  const withAlt = photos.filter((p) => (p.alt || '').trim().length > 0);
  const PLACE = /costa rica|guanacaste|nicoya|tamarindo|nosara|s[aá]mara|liberia|flamingo|conchal|papagayo|rinc[oó]n|arenal/i;
  const THEME = /beach|ocean|sea|coast|shore|palm|tropical|surf|sunset|sunrise|jungle|rainforest|forest|waterfall|volcano|wildlife|monkey|sloth|bird|boat|catamaran|snorkel|dive|river|mountain|nature|hot spring/i;
  // Prefer a photo that names a real place here; otherwise an on-theme photo used
  // honestly as a REPRESENTATIVE image; if nothing is on-theme, hold for a human
  // rather than attach a misleading picture.
  const photo = withAlt.find((p) => PLACE.test(p.alt)) || withAlt.find((p) => THEME.test(p.alt));
  if (!photo) return null;
  const named = PLACE.test(photo.alt);
  const out = join(root, 'public/images/blog', `${topic.slug}.webp`);
  const tmp = join(process.env.TMPDIR || '/tmp', `${topic.slug}.jpg`);
  execFileSync('curl', ['-sL', '-o', tmp, `${photo.src.large2x}`]);
  execFileSync('cwebp', ['-q', '80', '-resize', '1600', '0', tmp, '-o', out]);
  execFileSync('cwebp', ['-q', '80', '-resize', '800', '0', tmp, '-o', out.replace('.webp', '-800.webp')]);
  return {
    src: `/images/blog/${topic.slug}.webp`, alt: photo.alt, width: 1600, height: 1067,
    credit: { source: 'Pexels', sourceUrl: photo.url, author: photo.photographer, license: 'Pexels License',
      licenseUrl: 'https://www.pexels.com/license/', downloaded: new Date().toISOString().slice(0, 10),
      attributionRequired: false,
      depicts: named ? photo.alt : `${photo.alt} — representative image for this guide, not a specific named location in Guanacaste.` },
  };
}

function toModule(topic, art, hero, today) {
  const j = (v) => JSON.stringify(v, null, 2).replace(/\n/g, '\n  ');
  return `import type { BlogPost } from '../../lib/blog';\n\n// Auto-generated DRAFT — reviewed and approved by a human before publication.\nexport const post: BlogPost = {\n` +
    `  slug: ${JSON.stringify(topic.slug)},\n  title: ${JSON.stringify(topic.title)},\n  metaTitle: ${JSON.stringify(art.metaTitle)},\n` +
    `  description: ${JSON.stringify(art.description)},\n  category: ${JSON.stringify(topic.category)},\n  tags: ${JSON.stringify(art.tags || topic.tags || [])},\n` +
    `  primaryQuery: ${JSON.stringify(topic.primaryQuery)},\n  intent: ${JSON.stringify(topic.intent)},\n` +
    `  author: ${j(art.author || { name: 'Guanacaste Experiences editorial team', role: 'Travel editors' })},\n` +
    `  published: ${JSON.stringify(today)},\n  reviewBy: ${JSON.stringify(new Date(Date.now() + (topic.reviewMonths || 12) * 2.6e9).toISOString().slice(0, 10))},\n  draft: true,\n` +
    `  hero: ${hero ? j(hero) : j({ src: '', alt: 'PLACEHOLDER — add a verified, licensed image or a diagram before publishing', credit: null })},\n` +
    `  excerpt: ${JSON.stringify(art.excerpt)},\n  cta: ${j({ label: topic.cta, href: topic.ctaHref || '/tours' })},\n` +
    `  relatedTours: ${JSON.stringify(art.relatedTours || topic.relatedTours || [])},\n  relatedDestinations: ${JSON.stringify(art.relatedDestinations || topic.relatedDestinations || [])},\n  relatedPosts: ${JSON.stringify(art.relatedPosts || [])},\n` +
    `  sources: ${j(art.sources || [])},\n  body: ${j(art.body || [])},\n};\n`;
}

export async function generateDraft(topic, { root }) {
  const file = join(root, 'content/blog', `${topic.slug}.ts`);
  if (existsSync(file)) return topic.slug; // idempotent
  const art = await callModel(topic);
  const hero = await sourceImage(topic, root);
  const today = new Date().toISOString().slice(0, 10);
  writeFileSync(file, toModule(topic, art, hero, today));
  // Register the import so the app + feeds pick it up.
  const idx = join(root, 'content/blog/index.ts');
  const src = (await import('node:fs')).readFileSync(idx, 'utf8');
  const camel = topic.slug.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
  if (!src.includes(`./${topic.slug}`)) {
    const withImport = src.replace(/(\nexport const POSTS)/, `\nimport { post as ${camel} } from './${topic.slug}';$1`)
      .replace(/(export const POSTS: BlogPost\[\] = \[\n)/, `$1  ${camel},\n`);
    (await import('node:fs')).writeFileSync(idx, withImport);
  }
  return topic.slug;
}
