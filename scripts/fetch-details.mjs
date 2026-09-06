import { readFileSync, writeFileSync } from 'node:fs';

const KEY = process.env.VIATOR_API_KEY;
if (!KEY) { console.error('VIATOR_API_KEY not set'); process.exit(1); }

const HEADERS = {
  'exp-api-key': KEY,
  'Accept': 'application/json;version=2.0',
  'Accept-Language': 'en-US',
};

const products = JSON.parse(readFileSync('viator-raw.json', 'utf8'));
const out = [];
let failed = 0;

for (const [i, p] of products.entries()) {
  const url = `https://api.viator.com/partner/products/${encodeURIComponent(p.productCode)}`;
  try {
    const r = await fetch(url, { headers: HEADERS });
    if (!r.ok) { console.log(`  ${r.status} ${p.productCode}`); failed++; }
    else out.push({ ...p, detail: await r.json() });
  } catch (e) {
    console.log(`  ERR ${p.productCode}: ${e.message}`); failed++;
  }
  if ((i + 1) % 10 === 0) console.log(`${i + 1}/${products.length}`);
  await new Promise(r => setTimeout(r, 300));
}

writeFileSync('viator-detailed.json', JSON.stringify(out, null, 2));
console.log(`\nfetched ${out.length}, failed ${failed}`);

const d = out[0].detail;
console.log('\n=== detail keys ===');
console.log(Object.keys(d).join(', '));
console.log('\n=== images in detail:', d.images?.length ?? 0, '===');
console.log('\n=== inclusions sample ===');
console.log(JSON.stringify(d.inclusions?.slice(0, 3) ?? null, null, 2).slice(0, 500));
console.log('\n=== additionalInfo sample ===');
console.log(JSON.stringify(d.additionalInfo?.slice(0, 3) ?? null, null, 2).slice(0, 500));
console.log('\n=== cancellationPolicy ===');
console.log(JSON.stringify(d.cancellationPolicy ?? null).slice(0, 300));
