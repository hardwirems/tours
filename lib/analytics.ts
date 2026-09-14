// Privacy-conscious analytics helper. Pushes GA4 (gtag) events when available,
// falling back to dataLayer. NEVER send names, emails, phone numbers or other
// personal data — only category / airport / destination / route / product code /
// campaign context. Consent is handled by GA4 Consent Mode (see app/+html.tsx).

type Params = Record<string, string | number | boolean | undefined | null>;

export function track(event: string, params: Params = {}): void {
  if (typeof window === 'undefined') return;
  const clean: Record<string, string | number | boolean> = {};
  for (const [k, v] of Object.entries(params)) {
    if (v === undefined || v === null || v === '') continue;
    clean[k] = v;
  }
  const w = window as unknown as { gtag?: (...a: unknown[]) => void; dataLayer?: unknown[] };
  try {
    if (typeof w.gtag === 'function') w.gtag('event', event, clean);
    else { w.dataLayer = w.dataLayer || []; w.dataLayer.push({ event, ...clean }); }
  } catch { /* analytics must never break the page */ }
}

// Documented campaign identifiers for attribution reporting. These are OUR
// first-party campaign labels (used on analytics events + /go click tracking).
// A matching Viator dashboard sub-campaign parameter, if desired, must be
// confirmed in the Partner dashboard before use — we don't invent Viator params.
export function campaignId(ctx: { section: string; airport?: string; destination?: string; category?: string }): string {
  const parts = [ctx.section];
  if (ctx.airport) parts.push(ctx.airport.toLowerCase());
  if (ctx.destination) parts.push(ctx.destination);
  if (ctx.category) parts.push(ctx.category);
  return parts.join('_');
}
