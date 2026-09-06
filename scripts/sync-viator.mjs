import { writeFileSync } from 'node:fs';

const KEY = process.env.VIATOR_API_KEY;
if (!KEY) { console.error('VIATOR_API_KEY not set'); process.exit(1); }

const HEADERS = {
  'exp-api-key': KEY,
  'Accept': 'application/json;version=2.0',
  'Content-Type': 'application/json',
  'Accept-Language': 'en-US',
};

const DEST = '4137';        // Guanacaste and Northwest
const WANT = 60;            // products to keep
const PAGE = 50;            // API max per request
const SCAN = 600;           // how many to scan before ranking

async function search(start, count) {
  const r = await fetch('https://api.viator.com/partner/products/search', {
    method: 'POST', headers: HEADERS,
    body: JSON.stringify({
      filtering: { destination: DEST, rating: { from: 4.0 } },
      sorting: { sort: 'DEFAULT' },
      pagination: { start, count },
      currency: 'USD',
    }),
  });
  if (!r.ok) throw new Error(`search ${start}: HTTP ${r.status} ${await r.text()}`);
  return r.json();
}

const all = [];
for (let start = 1; start <= SCAN; start += PAGE) {
  const { products = [] } = await search(start, PAGE);
  if (!products.length) break;
  all.push(...products);
  console.log(`fetched ${all.length}`);
  await new Promise(r => setTimeout(r, 250));   // be polite
}

const ranked = all
  .filter(p => p.reviews?.totalReviews >= 25 && p.pricing?.summary?.fromPrice)
  .filter(p => !/transfer|transportation|airport|shuttle|taxi/i.test(p.title))
  .filter(p => p.pricing.summary.fromPrice <= 500)
  .sort((a, b) => b.reviews.totalReviews - a.reviews.totalReviews)
  .slice(0, WANT);

console.log(`\nscanned ${all.length}, keeping ${ranked.length}`);
writeFileSync('viator-raw.json', JSON.stringify(ranked, null, 2));

console.log('\ntop 15 by review count:');
for (const p of ranked.slice(0, 15)) {
  console.log(
    String(p.reviews.totalReviews).padStart(5),
    p.reviews.combinedAverageRating.toFixed(2),
    '$' + String(Math.round(p.pricing.summary.fromPrice)).padStart(4),
    p.title.slice(0, 68)
  );
}
