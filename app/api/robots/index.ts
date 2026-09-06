// Standalone route handler for robots.txt (web only).
// Export is a plain function — Expo Router calls it for GET /robots.txt.

type RobotsResponse = {
  text: string
  headers?: Record<string, string>
}

export function GET(): RobotsResponse {
  return {
    text: `User-agent: *
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
    headers: { 'Content-Type': 'text/plain' },
  }
}
