import { readFileSync, writeFileSync, existsSync } from 'node:fs';

const WRITE = process.argv.includes('--write');
const products = JSON.parse(readFileSync('viator-detailed.json', 'utf8'));

const destNames = new Map();
if (existsSync('destinations.json')) {
  for (const d of JSON.parse(readFileSync('destinations.json', 'utf8')).destinations) {
    destNames.set(String(d.destinationId), d.name);
  }
}

const slugify = (s) =>
  s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
   .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 60);

const esc = (s) => String(s ?? '').replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\n/g, ' ').trim();

function duration(d) {
  const m = d?.fixedDurationInMinutes ?? d?.variableDurationToMinutes;
  if (!m) return 'Varies';
  if (m >= 480) return 'Full day';
  if (m >= 360) return Math.round(m / 60) + ' hours (most of the day)';
  if (m % 60 === 0) return (m / 60) + ' hours';
  return (m / 60).toFixed(1) + ' hours';
}

const RULES = [
  ["multi-day", /\b\d+\s*[- ]?day\b|multi.?day|overnight|\bpackage\b/i],
  ["adventure", /zip.?line|zipline|canopy|atv|buggy|utv|rafting|canyoning|rappel|tubing|bungee|horseback|volcano hike|adrenaline|off.?road/i],
  ["culture-daytrip", /coffee|chocolate|cooking|distiller|culture|city tour|town tour|market|nicaragua|hot spring|spa|museum|farm/i],
  ["beach-water", /surf|catamaran|snorkel|sail|kayak|paddle.?board|scuba|diving|fishing|whale|dolphin|sunset cruise|boat tour|jet ski/i],
  ["wildlife-nature", /sloth|wildlife|bird|monkey|rainforest|national park|waterfall|mangrove|turtle|hanging bridge|butterfly|sanctuary/i],
];

function category(p) {
  const title = p.title || "";
  const desc = (p.description || "").slice(0, 400);
  let best = "adventure", bestScore = 0;
  for (const [cat, re] of RULES) {
    const g = new RegExp(re.source, "gi");
    const t = (title.match(g) || []).length;
    const d = (desc.match(g) || []).length;
    const score = t * 3 + d;
    if (score > bestScore) { bestScore = score; best = cat; }
  }
  return best;
}

function towns(p) {
  const names = (p.destinations ?? [])
    .map((d) => destNames.get(String(d.ref)))
    .filter(Boolean)
    .filter((n) => !/costa rica|central america/i.test(n));
  return [...new Set(names)].slice(0, 3);
}

function included(detail) {
  return (detail.inclusions ?? [])
    .map((i) => i.otherDescription || i.typeDescription || i.categoryDescription)
    .filter((s) => s && !/^other$/i.test(s))
    .slice(0, 8);
}

function toBring(detail) {
  return (detail.additionalInfo ?? [])
    .map((a) => a.description)
    .filter((s) => s && !/service animal|public transport|not recommended|wheelchair/i.test(s))
    .slice(0, 6);
}

function imagesOf(detail, fallback) {
  const src = detail.images?.length ? detail.images : (fallback.images ?? []);
  return src.slice(0, 6).map((img) => {
    const v = img.variants ?? [];
    const pick = (w) => v.find((x) => x.width === w)?.url;
    return { src: pick(720) || pick(674) || pick(540) || v[v.length - 1]?.url,
             alt: img.caption || fallback.title };
  }).filter((i) => i.src);
}

const seen = new Set();
const tours = [];

for (const p of products) {
  const d = p.detail ?? {};
  let slug = slugify(p.title);
  while (seen.has(slug)) slug = slug.replace(/-\d*$/, '') + '-' + (seen.size % 97);
  seen.add(slug);

  const cat = category(p);
  tours.push({
    slug, title: p.title, category: cat,
    tags: towns(p).map((t) => slugify(t)).concat(cat),
    towns: towns(p),
    description: (d.description || p.description || '').slice(0, 600),
    duration: duration(p.duration),
    priceFrom: Math.round(p.pricing.summary.fromPrice),
    priceNote: 'per person',
    difficulty: cat === 'adventure' ? 'moderate' : 'easy',
    rating: Number(p.reviews.combinedAverageRating.toFixed(2)),
    reviewCount: p.reviews.totalReviews,
    affiliateUrl: p.productUrl,
    affiliateLabel: 'Check availability & book on Viator',
    primaryAffiliate: 'viator',
    freeCancellation: d.cancellationPolicy?.type ? d.cancellationPolicy.type !== 'ALL_SALES_FINAL' : false,
    whatIncluded: included(d),
    whatToBring: toBring(d),
    images: imagesOf(d, p),
  });
}

const body = tours.map((t) => "  {\n" +
  "    slug: '" + esc(t.slug) + "',\n" +
  "    title: '" + esc(t.title) + "',\n" +
  "    category: '" + t.category + "',\n" +
  "    tags: [" + t.tags.map((x) => "'" + esc(x) + "'").join(', ') + "],\n" +
  "    towns: [" + t.towns.map((x) => "'" + esc(x) + "'").join(', ') + "],\n" +
  "    description: '" + esc(t.description) + "',\n" +
  "    duration: '" + esc(t.duration) + "',\n" +
  "    priceFrom: " + t.priceFrom + ",\n" +
  "    priceNote: '" + esc(t.priceNote) + "',\n" +
  "    difficulty: '" + t.difficulty + "',\n" +
  "    rating: " + t.rating + ",\n" +
  "    reviewCount: " + t.reviewCount + ",\n" +
  "    affiliateUrl: '" + esc(t.affiliateUrl) + "',\n" +
  "    affiliateLabel: '" + esc(t.affiliateLabel) + "',\n" +
  "    primaryAffiliate: '" + t.primaryAffiliate + "',\n" +
  "    freeCancellation: " + t.freeCancellation + ",\n" +
  "    whatIncluded: [" + t.whatIncluded.map((x) => "'" + esc(x) + "'").join(', ') + "],\n" +
  "    whatToBring: [" + t.whatToBring.map((x) => "'" + esc(x) + "'").join(', ') + "],\n" +
  "    faq: [],\n" +
  "    images: [" + t.images.map((i) => "{ src: '" + esc(i.src) + "', alt: '" + esc(i.alt) + "' }").join(', ') + "],\n" +
  "  },").join('\n');

const START = 'export const TOURS: Tour[] = [';
const END = 'export const CATEGORIES';
const original = readFileSync('lib/tours.ts', 'utf8');
const s = original.indexOf(START);
const e = original.indexOf(END);
if (s < 0 || e < 0 || e < s) { console.error('could not locate TOURS boundaries'); process.exit(1); }
const next = original.slice(0, s) + START + '\n' + body + '\n]\n\n' + original.slice(e);
const urlMap = tours.map((t) => "  'viator/" + t.slug + "': '" + esc(t.affiliateUrl) + "',").join('\n');

const byCat = {};
for (const t of tours) byCat[t.category] = (byCat[t.category] ?? 0) + 1;
console.log('tours: ' + tours.length);
console.log('by category:', byCat);
console.log('avg images: ' + (tours.reduce((a, t) => a + t.images.length, 0) / tours.length).toFixed(1));
console.log('with inclusions: ' + tours.filter((t) => t.whatIncluded.length).length);
console.log('free cancellation: ' + tours.filter((t) => t.freeCancellation).length);
console.log('price range: $' + Math.min(...tours.map((t) => t.priceFrom)) + ' - $' + Math.max(...tours.map((t) => t.priceFrom)));

if (WRITE) {
  writeFileSync('lib/tours.ts', next);
  writeFileSync('viator-url-map.txt', urlMap);
  console.log('\nwrote lib/tours.ts and viator-url-map.txt');
} else {
  console.log('\ndry run — rerun with --write to apply\n');
  console.log(body.split('\n  },')[0] + '\n  },');
}
