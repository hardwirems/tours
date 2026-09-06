// Standalone route handler for /go/[slug] — affiliate redirect + click tracking.
// Expo Router web route handler (no Next.js).

import { recordClickHttp } from '../../../lib/supabase'
import { TOURS } from '../../../lib/tours'

// ---------------------------------------------------------------------------
// Affiliate URL mappings — /go/ slug → real URL.
// ---------------------------------------------------------------------------

const URL_MAP: Record<string, string> = {
  'getyourguide/zip-lining-guanacaste': 'https://www.getyourguide.com/guanacaste-l170254/adventure-tours-c86/zip-line-canopy-tours-c49/sku1005799/',
  'getyourguide/catamaran-sunset-tamarindo': 'https://www.getyourguide.com/tamarindo-l169319/boat-tours-c93/plana-catamaran-private-sailing-tour-t49/sku1005795/',
  'getyourguide/atv-tamarindo': 'https://www.getyourguide.com/tamarindo-l169319/adventure-tours-c86/atv-beach-and-mountain-tour-t49/sku1005801/',
  'getyourguide/snorkeling-las-catalinas': 'https://www.getyourguide.com/tamarindo-l169319/boat-tours-c93/snorkeling-at-las-catalinas-islands-t49/sku1005796/',
  'getyourguide/rincon-de-la-vieja-volcano': 'https://www.getyourguide.com/santa-rosa-de-guanacaste-l171745/volcano-hiking-tours-c154/rincon-de-la-vieja-volcano-hike-hot-springs-t49/sku1006123/',
  'getyourguide/palo-verde-birdwatching': 'https://www.getyourguide.com/liberia-l170255/wildlife-tours-c126/palo-verde-national-park-t49/sku1005987/',
  'getyourguide/sport-fishing-guanacaste': 'https://www.getyourguide.com/flamingo-l170810/fishing-tours-c169/sport-fishing-charter-t49/sku2901234/',
  'getyourguide/horseback-riding-guanacaste': 'https://www.getyourguide.com/guanacaste-l170254/horse-riding-tours-c155/horseback-riding-tours-c49/sku1005802/',
  'getyourguide/liberia-town-tour': 'https://www.getyourguide.com/liberia-l170255/historical-sightseeing-tours-c30/liberia-historic-town-tour-t49/sku1005803/',
  'getyourguide/nicaragua-day-trip': 'https://www.getyourguide.com/liberia-l170255/day-trips-c88/nicaragua-day-trip-granada-san-juan-del-sur-t49/sku1005804/',
  'getyourguide/guanacaste-adventure-week': 'https://www.getyourguide.com/guanacaste-l170254/multi-day-tours-c94/guanacaste-adventure-week-t49/sku1005805/',
  'viator/ziplining-guanacaste': 'https://www.viator.com/Guanacaste-attractions-c2417079',
  'viator/catamaran-tamarindo': 'https://www.viator.com/Tamarindo-attractions-c2417099',
  'viator/atv-tamarindo': 'https://www.viator.com/Tamarindo-attractions-c2417099',
}

// ---------------------------------------------------------------------------
// Handler
// ---------------------------------------------------------------------------

export function GET(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  return handleGo(request, params)
}

async function handleGo(request: Request, params: Promise<{ slug: string }>) {
  const { slug } = await params

  if (!slug || !slug.includes('/')) {
    return new Response(
      JSON.stringify({ error: 'Invalid slug. Use /go/program/tour-slug' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    )
  }

  // Resolve the real URL.
  const url = URL_MAP[slug] ?? null
  if (!url) {
    return new Response(
      JSON.stringify({ error: `No mapping found for /go/${slug}` }),
      { status: 404, headers: { 'Content-Type': 'application/json' } }
    )
  }

  // Capture context for the click record.
  const sourcePage = getSourcePage(request)
  const sessionId = getSessionId(request)
  const userAgent = request.headers.get('user-agent') ?? undefined
  const country = getCountryFromRequest(request)

  // Record the click (fire-and-forget — don't block the redirect).
  recordClickHttp({ slug, sourcePage: sourcePage ?? undefined, sessionId: sessionId ?? undefined, userAgent, country: country ?? undefined })
    .catch((err: unknown) => {
      console.warn('[go/route] Click record failed:', err)
    })

  // 302 redirect to the real affiliate URL.
  const response = new Response(null, {
    status: 302,
    headers: {
      Location: url,
      'Set-Cookie': `guanacaste_go=${slug}; Path=/; Max-Age=${60 * 60 * 24 * 30}; SameSite=Lax; HttpOnly; Secure;`,
    },
  })

  return response
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getSourcePage(request: Request): string | undefined {
  const referrer = request.headers.get('referer') ?? request.headers.get('referrer')
  if (referrer && referrer.startsWith('https://guanacaste.tours')) {
    return new URL(referrer).pathname
  }
  const { searchParams } = new URL(request.url)
  return searchParams.get('source') ?? undefined
}

function getSessionId(request: Request): string | undefined {
  const cookieHeader = request.headers.get('cookie') ?? ''
  const cookies = Object.fromEntries(
    cookieHeader.split(';').map((c: string) => {
      const parts = c.trim().split('=')
      return [parts[0], parts.slice(1).join('=')]
    })
  )
  return cookies['__secure_guanacaste_sid'] ?? cookies['guanacaste_sid'] ?? undefined
}

function getCountryFromRequest(request: Request): string | undefined {
  return (request.headers.get('CF-IPCountry') as string | null) ?? undefined
}
