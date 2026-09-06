// ---------------------------------------------------------------------------
// Affiliate URL mappings — /go/ slug → real URL.
// Keep this in sync with the Supabase affiliate_mappings table.
// In production, the /go/ route pulls from Supabase first, then falls back
// to this static map.
// ---------------------------------------------------------------------------

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mappings: Record<string, string> = {
  // GetYourGuide
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

  // Viator
  'viator/ziplining-guanacaste': 'https://www.viator.com/Guanacaste-attractions-c2417079',
  'viator/catamaran-tamarindo': 'https://www.viator.com/Tamarindo-attractions-c2417099',
  'viator/atv-tamarindo': 'https://www.viator.com/Tamarindo-attractions-c2417099',

  // Booking.com
  'bookingcom/liberia-hotels': 'https://www.booking.com/search?ss=Liberia%2C+Costa+Rica',
  'bookingcom/tamarindo-hotels': 'https://www.booking.com/search?ss=Tamarindo%2C+Costa+Rica',

  // Discover Cars
  'discovercars/liberia': 'https://www.discovercars.com/en/car-rental/costa-rica/liberia',
  'discovercars/tamarindo': 'https://www.discovercars.com/en/car-rental/costa-rica/tamarindo',

  // Airalo eSIM
  'airalo/costa-rica': 'https://www.airalo.com/com/regions/latam/co',
}

export function resolveAffiliateUrl(slug: string): string | null {
  return mappings[slug] ?? null
}
