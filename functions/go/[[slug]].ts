/**
 * Cloudflare Pages Function — /go/ affiliate redirect + first-party click tracking.
 *
 * Handles all /go/* paths. Parses the program/tour-slug from the URL path.
 * Supabase credentials are set via wrangler pages secret put (not committed).
 */

interface Env {
  SUPABASE_URL: string
  SUPABASE_ANON_KEY: string
}

// Static URL map — keep in sync with lib/affiliateUrls.ts.
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
  'bookingcom/liberia-hotels': 'https://www.booking.com/search?ss=Liberia%2C+Costa+Rica',
  'bookingcom/tamarindo-hotels': 'https://www.booking.com/search?ss=Tamarindo%2C+Costa+Rica',
  'discovercars/liberia': 'https://www.discovercars.com/en/car-rental/costa-rica/liberia',
  'discovercars/tamarindo': 'https://www.discovercars.com/en/car-rental/costa-rica/tamarindo',
  'airalo/costa-rica': 'https://www.airalo.com/com/regions/latam/co',
}

function resolveUrl(slug: string): string | null {
  return URL_MAP[slug] ?? null
}

async function recordClick(
  slug: string,
  sourcePage: string | null,
  sessionId: string | null,
  userAgent: string | null,
  env: Env
): Promise<void> {
  const supabaseUrl = env.SUPABASE_URL
  const key = env.SUPABASE_ANON_KEY
  if (!supabaseUrl || !key) return
  const response = await fetch(`${supabaseUrl}/rest/v1/clicks`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': key,
      'Authorization': `Bearer ${key}`,
      'Prefer': 'return=minimal',
    },
    body: JSON.stringify({
      slug,
      source_page: sourcePage ?? null,
      session_id: sessionId ?? null,
      user_agent: userAgent ?? null,
      country: null,
      ip_hash: null,
      created_at: new Date().toISOString(),
    }),
  })
  if (!response.ok) {
    const text = await response.text()
    throw new Error(`Supabase insert failed (${response.status}): ${text}`)
  }
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const url = new URL(context.request.url)
  const pathAfterGo = url.pathname.slice('/go/'.length) // e.g. "getyourguide/zip-lining-guanacaste"
  const slug = pathAfterGo || ''

  if (!slug || !slug.includes('/')) {
    return new Response(
      JSON.stringify({ error: 'Invalid slug. Use /go/program/tour-slug' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    )
  }

  const redirectUrl = resolveUrl(slug)
  if (!redirectUrl) {
    return new Response(
      JSON.stringify({ error: `No mapping found for /go/${slug}` }),
      { status: 404, headers: { 'Content-Type': 'application/json' } }
    )
  }

  // --- capture context ---
  const rawReferer = context.request.headers.get('referer') ?? context.request.headers.get('referrer') ?? ''
  const sourcePage =
    url.searchParams.get('source') ??
    (rawReferer.startsWith('https://guanacaste.tours')
      ? new URL(rawReferer).pathname
      : null)

  const cookieHeader = context.request.headers.get('cookie') ?? ''
  const sid = cookieHeader
    .split(';')
    .map((c) => c.trim().split('='))
    .reduce<string | undefined>(
      (found, parts) =>
        found ??
        (parts[0] === '__secure_guanacaste_sid' || parts[0] === 'guanacaste_sid'
          ? parts.slice(1).join('=')
          : undefined),
      undefined
    )
  const sessionId = sid ?? null
  const userAgent = context.request.headers.get('user-agent') ?? null

  // Record the click BEFORE redirecting — first-party attribution that survives
  // Safari ITP and ad-blockers. Awaiting guarantees the INSERT completes.
  try {
    await recordClick(slug, sourcePage, sessionId, userAgent, context.env)
  } catch (err) {
    console.error('Click tracking failed:', err)
  }

  return new Response(null, {
    status: 302,
    headers: {
      Location: redirectUrl,
      'Set-Cookie': `guanacaste_go=${slug}; Path=/; Max-Age=${60 * 60 * 24 * 30}; SameSite=Lax; HttpOnly; Secure;`,
    },
  })
}
