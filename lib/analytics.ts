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

// --- Booking-click conversions ---------------------------------------------
// Every outbound booking link (href="/go/...") is tracked by ONE site-wide click
// listener in app/+html.tsx, which sends the GA4 event `click_viator_booking`
// (mark it as a key event in GA4). Components don't call track() for these —
// they only attach the attributes below, so a click is never counted twice and
// the same tracking works on hydrated and de-hydrated pages.

// Viator pays affiliates 8% of the booking value, once the experience is
// completed (partnerresources.viator.com, checked 2026-09-15). GA4 can't see
// confirmed bookings, so the event value is an ESTIMATE: listed "from" price x 8%.
export const VIATOR_COMMISSION_RATE = 0.08;

export type BookingLink = {
  itemId: string; // our slug or the Viator product code
  itemName: string;
  category: string; // e.g. tour category, 'airport_transfer', 'rental'
  placement: string; // where the button sits, e.g. 'tour_page_book'
  list?: string; // optional list context, e.g. 'lir_tamarindo'
  price?: number | null; // per-person "from" price in USD; omit when not meaningful
};

// RN-Web `dataSet` for a booking link -> data-* attributes the tracker reads.
export function bookingDataSet(link: BookingLink): Record<string, string> {
  const d: Record<string, string> = {
    trackBooking: '1',
    itemId: link.itemId,
    itemName: link.itemName.slice(0, 100),
    itemCategory: link.category,
    placement: link.placement,
  };
  if (link.list) d.itemList = link.list;
  if (link.price != null && link.price > 0) {
    d.price = String(link.price);
    d.estCommission = (Math.round(link.price * VIATOR_COMMISSION_RATE * 100) / 100).toFixed(2);
  }
  return d;
}

// First-party list labels used on analytics events. The matching Viator
// `campaign` code (letters, numbers and dashes only, per Viator's attribution
// docs) is derived server-side from the referring page in functions/go.
export function campaignId(ctx: { section: string; airport?: string; destination?: string; category?: string }): string {
  const parts = [ctx.section];
  if (ctx.airport) parts.push(ctx.airport.toLowerCase());
  if (ctx.destination) parts.push(ctx.destination);
  if (ctx.category) parts.push(ctx.category);
  return parts.join('_');
}
