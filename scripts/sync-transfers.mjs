// Curate Viator transfer + local-transport inventory into static data baked into
// the site at build time (key stays server-side; no client-side API calls).
//
//   node --env-file=.env scripts/sync-transfers.mjs
//
// Quality bar (configurable): rating >= MIN_RATING, reviews >= MIN_REVIEWS,
// resolvable route, transfer/transport product (not a guided tour). Writes:
//   lib/transportation-data.ts   — typed product + zone data for the pages
//   lib/affiliate-transfers.ts   — { 'viator/<slug>': '<commissionable productUrl>' }
import { writeFileSync, readFileSync, existsSync } from 'node:fs';

const KEY = process.env.VIATOR_API_KEY;
if (!KEY) { console.error('VIATOR_API_KEY not set'); process.exit(1); }
const HEADERS = { 'exp-api-key': KEY, 'Accept': 'application/json;version=2.0', 'Content-Type': 'application/json', 'Accept-Language': 'en-US' };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const MIN_RATING = Number(process.env.MIN_RATING || 4.5);
const MIN_REVIEWS = Number(process.env.MIN_REVIEWS || 20);

// ---- Destination taxonomy (verified Guanacaste zones) ----------------------
const ZONES = [
  { slug: 'papagayo-coco', name: 'Papagayo, Playas del Coco & Hermosa', match: /papagayo|playas del coco|\bcoco\b|playa hermosa|ocotal|secrets papagayo|planet hollywood|andaz|four seasons/i },
  { slug: 'flamingo-conchal', name: 'Flamingo, Potrero, Brasilito & Conchal', match: /flamingo|potrero|brasilito|conchal|westin|riu palace costa rica|reserva conchal/i },
  { slug: 'tamarindo', name: 'Tamarindo, Langosta & Playa Grande', match: /tamarindo|langosta|playa grande|avellanas/i },
  { slug: 'nosara-samara', name: 'Nosara, Sámara & Carrillo', match: /nosara|s[aá]mara|carrillo|punta islita/i },
  { slug: 'liberia-riu', name: 'Liberia & RIU Guanacaste', match: /riu guanacaste|riu palace guanacaste|liberia hotels?|\bliberia\b(?!.*airport)|jw marriott|costa elena|dreams las mareas/i },
  { slug: 'la-fortuna', name: 'La Fortuna & Arenal', match: /la fortuna|arenal/i },
];
const zoneFor = (title) => ZONES.find((z) => z.match.test(title));

const isSJO = (t) => /\bsjo\b|san jos[eé]|juan santamar/i.test(t);
const isLIR = (t) => /\blir\b|liberia/i.test(t);
// Exclude guided tours dressed up with transport
const isGuidedTour = (t) => /(guided tour|waterfall|zipline|volcano tour|city tour|sightseeing|combo|rafting|snorkel|catamaran|hot springs\b)/i.test(t) && !/transfer|shuttle|transportation/i.test(t);
const tripType = (t) => (/round[\s-]?trip/i.test(t) ? 'round-trip' : /one[\s-]?way/i.test(t) ? 'one-way' : 'either');
const service = (t) => (/\bshared\b|collectiv/i.test(t) ? 'shared' : 'private');

const kebab = (s) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 60);

async function search(destination, start, count) {
  const r = await fetch('https://api.viator.com/partner/products/search', {
    method: 'POST', headers: HEADERS,
    body: JSON.stringify({ filtering: { destination: String(destination), rating: { from: MIN_RATING } }, sorting: { sort: 'DEFAULT' }, pagination: { start, count }, currency: 'USD' }),
  });
  if (!r.ok) throw new Error(`search d${destination}: HTTP ${r.status} ${(await r.text()).slice(0, 160)}`);
  return r.json();
}
async function detail(code) {
  const r = await fetch(`https://api.viator.com/partner/products/${code}`, { headers: HEADERS });
  if (!r.ok) return null;
  return r.json();
}

// ---- Gather candidate transfer products across the relevant destinations ---
const TRANSFER_RE = /transfer|shuttle|transportation|airport|pick-?up|drop-?off/i;
const cand = new Map();
for (const d of [4137, 22740, 24763, 24471, 24946]) {
  for (let start = 1; start <= 500; start += 50) {
    let res; try { res = await search(d, start, 50); } catch (e) { console.log(`  ! d${d} search failed: ${String(e.message).slice(0, 180)}`); break; }
    const products = res.products || [];
    if (!products.length) break;
    for (const p of products) {
      const t = p.title || '';
      if (!TRANSFER_RE.test(t) || isGuidedTour(t)) continue;
      if (!(p.reviews?.totalReviews >= MIN_REVIEWS) || !(p.reviews?.combinedAverageRating >= MIN_RATING)) continue;
      if (!cand.has(p.productCode)) cand.set(p.productCode, p);
    }
    await sleep(180);
  }
}
console.log(`transfer candidates meeting bar: ${cand.size}`);

// ---- Enrich with detail (image, cancellation, duration, productUrl) --------
const transfers = [];
const urlMap = {};
for (const p of cand.values()) {
  const t = p.title;
  if (!isLIR(t) && !isSJO(t)) continue;           // must resolve an airport origin
  const d = await detail(p.productCode); await sleep(160);
  if (!d || d.status !== 'ACTIVE') continue;
  const img = d.images?.find((i) => i.isCover) || d.images?.[0];
  const variant = (img?.variants || []).filter((v) => v.width <= 720).sort((a, b) => b.width - a.width)[0] || (img?.variants || [])[0];
  const dur = d.itinerary?.duration;
  const durMin = dur?.variableDurationFromMinutes ?? dur?.fixedDurationInMinutes ?? null;
  const durMax = dur?.variableDurationToMinutes ?? durMin;
  const zone = zoneFor(t);
  const slug = kebab(t);
  const productUrl = d.productUrl || p.productUrl;
  urlMap[`viator/${slug}`] = productUrl;
  transfers.push({
    code: p.productCode, slug, title: t,
    origin: isSJO(t) && !isLIR(t) ? 'SJO' : 'LIR',
    zone: zone?.slug || 'guanacaste', zoneName: zone?.name || 'Guanacaste (general)',
    service: service(t), tripType: tripType(t),
    rating: Number(p.reviews.combinedAverageRating.toFixed(2)), reviews: p.reviews.totalReviews,
    fromPrice: p.pricing?.summary?.fromPrice ?? null,
    priceType: d.pricingInfo?.type || 'PER_PERSON',
    durationMin: durMin, durationMax: durMax,
    freeCancellation: d.cancellationPolicy?.type === 'STANDARD',
    image: variant ? { url: variant.url, width: variant.width, height: variant.height, alt: t } : null,
  });
}
transfers.sort((a, b) => b.reviews - a.reviews);
console.log(`enriched transfers with airport origin: ${transfers.length}`);

// ---- Local rentals that individually meet the bar (honest, non-thin) -------
const RENTAL_CODES = ['17279P39']; // 4-seat golf cart rental Tamarindo (5.0 / 28)
const rentals = [];
for (const code of RENTAL_CODES) {
  const d = await detail(code); await sleep(160);
  if (!d) continue;
  const img = d.images?.find((i) => i.isCover) || d.images?.[0];
  const variant = (img?.variants || []).filter((v) => v.width <= 720).sort((a, b) => b.width - a.width)[0];
  const slug = kebab(d.title);
  urlMap[`viator/${slug}`] = d.productUrl;
  rentals.push({ code, slug, title: d.title, category: 'golf-cart', rating: Number((d.reviews?.combinedAverageRating || 0).toFixed(2)), reviews: d.reviews?.totalCount || d.reviews?.totalReviews || 0, freeCancellation: d.cancellationPolicy?.type === 'STANDARD', image: variant ? { url: variant.url, width: variant.width, height: variant.height, alt: d.title } : null });
}

// ---- Safety floor: refuse to overwrite good data with a gutted set --------
// A sudden collapse in results almost always means an API hiccup, not that the
// inventory vanished. Abort (exit 2) rather than publish an empty section.
const MIN_EXPECTED = Number(process.env.MIN_EXPECTED_TRANSFERS || 15);
if (transfers.length < MIN_EXPECTED) {
  console.error(`ABORT: only ${transfers.length} qualifying transfers (< floor ${MIN_EXPECTED}). Likely an API issue — existing data left untouched.`);
  process.exit(2);
}

// ---- Change summary vs. the currently-committed data -----------------------
let prevCodes = new Set();
if (existsSync('lib/transportation-data.ts')) {
  try { const m = readFileSync('lib/transportation-data.ts', 'utf8').match(/TRANSFERS: TransferProduct\[\] = (\[[\s\S]*?\]);/); if (m) JSON.parse(m[1]).forEach((p) => prevCodes.add(p.code)); } catch { /* first run */ }
}
const newCodes = new Set(transfers.map((t) => t.code));
const added = [...newCodes].filter((c) => !prevCodes.has(c));
const removed = [...prevCodes].filter((c) => !newCodes.has(c));
const summary = `Transfers: ${transfers.length} (added ${added.length}, removed ${removed.length}).\nAdded: ${added.join(', ') || 'none'}\nRemoved: ${removed.join(', ') || 'none'}`;
console.log('\n' + summary);
if (process.env.SUMMARY_OUT) writeFileSync(process.env.SUMMARY_OUT, summary + '\n');

// ---- Emit data files -------------------------------------------------------
const today = new Date().toISOString().slice(0, 10);
const dataTs = `// AUTO-GENERATED by scripts/sync-transfers.mjs on ${today} — do not edit by hand.
// Curated from the Viator Partner API (rating >= ${MIN_RATING}, reviews >= ${MIN_REVIEWS}).
// Prices are indicative "from" values checked on the date below; Viator controls live pricing.
export const TRANSFERS_CHECKED_AT = ${JSON.stringify(today)};
export interface TransferProduct {
  code: string; slug: string; title: string; origin: 'LIR' | 'SJO';
  zone: string; zoneName: string; service: 'private' | 'shared'; tripType: 'round-trip' | 'one-way' | 'either';
  rating: number; reviews: number; fromPrice: number | null; priceType: string;
  durationMin: number | null; durationMax: number | null; freeCancellation: boolean;
  image: { url: string; width: number; height: number; alt: string } | null;
}
export interface RentalProduct { code: string; slug: string; title: string; category: string; rating: number; reviews: number; freeCancellation: boolean; image: TransferProduct['image']; }
export const ZONES = ${JSON.stringify(ZONES.map(({ slug, name }) => ({ slug, name })), null, 2)} as const;
export const TRANSFERS: TransferProduct[] = ${JSON.stringify(transfers, null, 2)};
export const LOCAL_RENTALS: RentalProduct[] = ${JSON.stringify(rentals, null, 2)};
`;
writeFileSync('lib/transportation-data.ts', dataTs);

const urlTs = `// AUTO-GENERATED by scripts/sync-transfers.mjs on ${today} — do not edit by hand.
// Commissionable Viator affiliate URLs for /go/viator/<slug> (mcid/pid attribution baked in by the Partner API).
export const TRANSFER_URLS: Record<string, string> = ${JSON.stringify(urlMap, null, 2)};
`;
writeFileSync('lib/affiliate-transfers.ts', urlTs);

// ---- Summary ---------------------------------------------------------------
const byZone = {};
for (const t of transfers) (byZone[t.zone] ||= []).push(t);
console.log('\n=== transfers by zone ===');
for (const [z, arr] of Object.entries(byZone)) console.log(`  ${z.padEnd(18)} ${arr.length}  (LIR ${arr.filter(x => x.origin === 'LIR').length} / SJO ${arr.filter(x => x.origin === 'SJO').length})`);
console.log(`\nlocal rentals: ${rentals.length}`);
console.log('wrote lib/transportation-data.ts + lib/affiliate-transfers.ts');
