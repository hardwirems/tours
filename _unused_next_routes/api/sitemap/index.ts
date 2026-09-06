// Standalone route handler for sitemap.xml (web only).
// In production, generate a full sitemap.xml from tour data at build time.
// This handler is the fallback for crawlers that hit /sitemap.xml.

type SitemapResponse = {
  text: string
  headers?: Record<string, string>
}

export function GET(): SitemapResponse {
  const base = 'https://guanacaste.tours'

  const urls = [
    { loc: `${base}/`, priority: '1.0', changefreq: 'daily' },
    { loc: `${base}/tours`, priority: '0.9', changefreq: 'daily' },
    { loc: `${base}/tours/catamaran-sunset-tamarindo`, priority: '0.8', changefreq: 'monthly' },
    { loc: `${base}/tours/snorkeling-las-catalinas`, priority: '0.8', changefreq: 'monthly' },
    { loc: `${base}/tours/atv-tamarindo`, priority: '0.8', changefreq: 'monthly' },
    { loc: `${base}/tours/rincon-de-la-vieja-volcano`, priority: '0.8', changefreq: 'monthly' },
    { loc: `${base}/tours/palo-verde-birdwatching`, priority: '0.8', changefreq: 'monthly' },
    { loc: `${base}/tours/zip-lining-guanacaste`, priority: '0.8', changefreq: 'monthly' },
    { loc: `${base}/tours/sport-fishing-guanacaste`, priority: '0.8', changefreq: 'monthly' },
    { loc: `${base}/tours/horseback-riding-guanacaste`, priority: '0.8', changefreq: 'monthly' },
    { loc: `${base}/tours/liberia-town-tour`, priority: '0.7', changefreq: 'monthly' },
    { loc: `${base}/tours/nicaragua-day-trip`, priority: '0.7', changefreq: 'monthly' },
    { loc: `${base}/tours/guanacaste-adventure-week`, priority: '0.7', changefreq: 'monthly' },
    { loc: `${base}/compare`, priority: '0.7', changefreq: 'weekly' },
    { loc: `${base}/about`, priority: '0.6', changefreq: 'monthly' },
  ]

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url>
    <loc>${u.loc}</loc>
    <priority>${u.priority}</priority>
    <changefreq>${u.changefreq}</changefreq>
  </url>`).join('\n')}
</urlset>
`

  return {
    text: xml,
    headers: { 'Content-Type': 'application/xml' },
  }
}
