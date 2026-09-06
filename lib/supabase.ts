export interface ClickPayload {
  slug: string
  sourcePage?: string
  sessionId?: string
  userAgent?: string
  country?: string
  ipHash?: string
}

export interface LeadPayload {
  name?: string
  email?: string
  phone?: string
  message?: string
  tourSlug?: string
  source?: string
  affiliateRef?: string
  utmSource?: string
  utmMedium?: string
  utmCampaign?: string
}

/**
 * Record a click via direct Supabase REST API.
 * Used by the web /go/ route handler (server-side).
 */
export async function recordClickHttp(payload: ClickPayload): Promise<{ recorded: boolean; id?: string; reason?: string }> {
  const supabaseUrl = process.env.SUPABASE_URL ?? ''
  const supabaseKey = process.env.SUPABASE_ANON_KEY ?? ''

  if (!supabaseUrl || !supabaseKey) {
    return { recorded: false, reason: 'not_configured' }
  }

  try {
    const res = await fetch(`${supabaseUrl}/rest/v1/clicks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Prefer': 'return=minimal',
      },
      body: JSON.stringify({
        slug: payload.slug,
        source_page: payload.sourcePage ?? null,
        session_id: payload.sessionId ?? null,
        user_agent: payload.userAgent ?? null,
        country: payload.country ?? null,
        ip_hash: payload.ipHash ?? null,
        created_at: new Date().toISOString(),
      }),
    })

    if (!res.ok) {
      const text = await res.text().catch(() => '')
      return { recorded: false, reason: `HTTP ${res.status}: ${text.slice(0, 200)}` }
    }

    const json = await res.json()
    return {
      recorded: true,
      id: Array.isArray(json) ? (json[0]?.id as string | undefined) : undefined,
    }
  } catch (err) {
    console.warn('[supabase] Click record fetch failed:', err)
    return { recorded: false, reason: String(err) }
  }
}

export async function recordLeadHttp(payload: LeadPayload): Promise<{ recorded: boolean; id?: string; reason?: string }> {
  const supabaseUrl = process.env.SUPABASE_URL ?? ''
  const supabaseKey = process.env.SUPABASE_ANON_KEY ?? ''

  if (!supabaseUrl || !supabaseKey) {
    return { recorded: false, reason: 'not_configured' }
  }

  try {
    const res = await fetch(`${supabaseUrl}/rest/v1/leads`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Prefer': 'return=minimal',
      },
      body: JSON.stringify({
        name: payload.name ?? null,
        email: payload.email ?? null,
        phone: payload.phone ?? null,
        message: payload.message ?? null,
        tour_slug: payload.tourSlug ?? null,
        source: payload.source ?? null,
        affiliate_ref: payload.affiliateRef ?? null,
        utm_source: payload.utmSource ?? null,
        utm_medium: payload.utmMedium ?? null,
        utm_campaign: payload.utmCampaign ?? null,
        created_at: new Date().toISOString(),
      }),
    })

    if (!res.ok) {
      const text = await res.text().catch(() => '')
      return { recorded: false, reason: `HTTP ${res.status}: ${text.slice(0, 200)}` }
    }

    return { recorded: true }
  } catch (err) {
    console.warn('[supabase] Lead record fetch failed:', err)
    return { recorded: false, reason: String(err) }
  }
}
