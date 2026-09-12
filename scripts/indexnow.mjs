// Submit sitemap URLs to IndexNow (Bing, Yandex, etc.). Run after deploy:
//   node scripts/indexnow.mjs
const KEY = '6679b9ba2b467fb0fd6c0d7ed58fdba8';
const HOST = 'www.guanacasteexperiences.com';
const SITEMAP = `https://${HOST}/sitemap.xml`;

const xml = await (await fetch(SITEMAP)).text();
const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
console.log(`Submitting ${urls.length} URLs to IndexNow...`);
const res = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify({ host: HOST, key: KEY, keyLocation: `https://${HOST}/${KEY}.txt`, urlList: urls }),
});
console.log('IndexNow response:', res.status, res.statusText);
