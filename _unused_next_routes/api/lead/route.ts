import { recordLeadHttp } from '../../../lib/supabase'

// ---------------------------------------------------------------------------
// /api/lead/route.ts — Lead / inquiry form endpoint.
// Expo Router web route handler (no Next.js).
// ---------------------------------------------------------------------------

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      name,
      email,
      phone,
      message,
      tourSlug,
      source,
      affiliateRef,
      utmSource,
      utmMedium,
      utmCampaign,
    } = body as {
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

    if (!email || !message) {
      return Response.json(
        { error: 'email and message are required' },
        { status: 400 }
      )
    }

    const result = await recordLeadHttp({
      name,
      email,
      phone,
      message,
      tourSlug,
      source: source ?? 'unknown',
      affiliateRef,
      utmSource,
      utmMedium,
      utmCampaign,
    })

    if (!result.recorded) {
      return Response.json(
        { error: result.reason ?? 'failed to record lead' },
        { status: 500 }
      )
    }

    return Response.json(
      { success: true, id: result.id, message: 'Lead recorded' },
      { status: 201 }
    )
  } catch (err) {
    console.error('[api/lead] Error:', err)
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export function GET() {
  return Response.json({ status: 'ok', endpoint: 'lead form POST' })
}
