// ---------------------------------------------------------------------------
// /api/robots/route.ts — robots.txt for web crawlers.
// Expo Router web route handler (no Next.js).
// ---------------------------------------------------------------------------

export function GET() {
  return new Response(
    `User-agent: *
Allow: /

# AI crawlers — allow so the site is citable by ChatGPT, Claude, Perplexity, etc.
User-agent: GPTBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: Claude-Web
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: AI-SearchBot
Allow: /

User-agent: OAI-SearchBot
Allow: /

# Block functional routes from indexing (not content).
User-agent: *
Disallow: /go/
Disallow: /api/
Disallow: /_expo/
Disallow: /assets/
Disallow: /static/

Sitemap: https://guanacaste.tours/sitemap.xml
`,
    {
      status: 200,
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    }
  )
}
