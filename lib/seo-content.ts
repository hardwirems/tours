// ---------------------------------------------------------------------------
// SEO content for category hub pages and destination pages.
// Copy here is intentionally general and factual (well-known geography) — no
// unverified claims about prices, travel times, safety, or availability.
// Tour data (counts, prices, ratings) is always pulled live from lib/tours.
// ---------------------------------------------------------------------------

export type HubContent = {
  h1: string;
  title: string; // <title>
  description: string; // meta description (~150-160 chars)
  intro: string; // opening paragraph shown on the page
};

// --- Category hubs (keys must match CATEGORIES in lib/tours) ---
export const CATEGORY_CONTENT: Record<string, HubContent> = {
  'beach-water': {
    h1: 'Beach & Water Tours in Guanacaste',
    title: 'Beach & Water Tours in Guanacaste, Costa Rica — Catamaran, Snorkel & Surf',
    description:
      'Catamaran sunset sails, snorkeling trips, surf lessons and sport fishing along Guanacaste’s Pacific coast. Compare beach and water tours and book direct.',
    intro:
      'Guanacaste’s Pacific coast is built for time on the water. From catamaran sunset sails out of Tamarindo and Playa Flamingo to snorkeling at the Catalina Islands, surf lessons on gentle beach breaks, and deep-sea sport fishing, these are the province’s most popular beach and water experiences — with real prices and reviews below.',
  },
  'wildlife-nature': {
    h1: 'Wildlife & Nature Tours in Guanacaste',
    title: 'Wildlife & Nature Tours in Guanacaste, Costa Rica — Parks, Volcanoes & Waterfalls',
    description:
      'National parks, volcano hikes, waterfalls and wildlife-watching in Guanacaste. Explore Rincón de la Vieja, Palo Verde and more, then book your tour.',
    intro:
      'Beyond the beaches, Guanacaste holds active volcanoes, tropical dry forest, wetland reserves and waterfalls. Guided trips to Rincón de la Vieja, Palo Verde’s birdlife, and Río Celeste-area nature reveal the province’s wilder side. Browse the wildlife and nature tours below by duration, price and traveler rating.',
  },
  adventure: {
    h1: 'Adventure & Adrenaline Tours in Guanacaste',
    title: 'Adventure Tours in Guanacaste, Costa Rica — Zip-lining, ATV & Rafting',
    description:
      'Zip-lining, ATV rides, white-water rafting, river tubing and adventure combos across Guanacaste. Compare adrenaline tours and book direct.',
    intro:
      'For travelers who want their pulse up, Guanacaste delivers canopy zip-lines, off-road ATV trails, river tubing and volcano adventure combos. Many tours bundle several activities into a single day. Compare the adventure and adrenaline options below by difficulty, duration and price.',
  },
  'culture-daytrip': {
    h1: 'Culture & Day Trips in Guanacaste',
    title: 'Culture Tours & Day Trips in Guanacaste, Costa Rica',
    description:
      'Town tours, cross-border day trips, coffee and local-culture experiences from Guanacaste. Explore beyond the beach and book your day trip.',
    intro:
      'Guanacaste’s culture runs from the colonial streets of Liberia — the “White City” — to day trips that cross into Nicaragua or reach the Nicoya Peninsula. These experiences pair easily with a beach stay when you want a change of pace. Browse the culture tours and day trips below.',
  },
  'multi-day': {
    h1: 'Multi-Day Tour Packages in Guanacaste',
    title: 'Multi-Day Tour Packages in Guanacaste, Costa Rica',
    description:
      'Multi-day itineraries combining Guanacaste’s best beaches, volcanoes and adventures into one trip. Compare packages and book direct.',
    intro:
      'When one day isn’t enough, multi-day packages string together Guanacaste’s highlights — beaches, volcanoes and adventure — into a single planned itinerary. Review the multi-day options below to see what each includes.',
  },
};

// --- Destination pages. `town` must exactly match values in tour `towns[]`. ---
export type Destination = HubContent & { slug: string; town: string; region?: string };

export const DESTINATIONS: Destination[] = [
  {
    slug: 'tamarindo',
    town: 'Tamarindo',
    h1: 'Tours & Things to Do in Tamarindo, Costa Rica',
    title: 'Tamarindo Tours & Things to Do — Guanacaste, Costa Rica',
    description:
      'The best tours and things to do in Tamarindo, Guanacaste: catamaran sunsets, surfing, snorkeling, ATV, zip-lining and day trips. Compare and book direct.',
    intro:
      'Tamarindo is the most popular beach town on Guanacaste’s Pacific coast and the easiest base for tours across the region. It’s known for its surf, catamaran sunset sails and a long sweep of beach, with quick access to snorkeling, ATV trails and volcano day trips. Here are the tours that depart from or are easily reached from Tamarindo.',
  },
  {
    slug: 'playa-flamingo',
    town: 'Playa Flamingo',
    h1: 'Tours & Things to Do in Playa Flamingo, Costa Rica',
    title: 'Playa Flamingo Tours & Things to Do — Guanacaste, Costa Rica',
    description:
      'Top tours and things to do in Playa Flamingo, Guanacaste: catamaran and snorkel cruises, sport fishing, and adventure day trips. Compare and book direct.',
    intro:
      'Playa Flamingo is an upscale beach on Guanacaste’s north Pacific coast, prized for its pale sand and calm bay. It’s a launch point for catamaran and snorkel cruises, sport fishing charters and boat trips to nearby coves and islands. Browse the tours available around Playa Flamingo below.',
  },
  {
    slug: 'playa-hermosa',
    town: 'Playa Hermosa',
    h1: 'Tours & Things to Do in Playa Hermosa, Guanacaste',
    title: 'Playa Hermosa Tours & Things to Do — Guanacaste, Costa Rica',
    description:
      'Tours and things to do in Playa Hermosa, Guanacaste — calm-water beach near the Papagayo area, ideal for catamaran trips, diving and family outings.',
    intro:
      'Playa Hermosa is a calm, crescent-shaped beach in the Papagayo area of northern Guanacaste, popular with families and divers for its sheltered water. It’s well placed for catamaran cruises, snorkeling and boat tours. See the experiences available around Playa Hermosa below.',
  },
  {
    slug: 'liberia',
    town: 'Liberia',
    h1: 'Tours & Day Trips from Liberia, Guanacaste',
    title: 'Liberia Tours & Day Trips — Guanacaste, Costa Rica',
    description:
      'Tours and day trips from Liberia, Guanacaste — the province capital and airport gateway. Volcano hikes, national parks, town tours and cross-border trips.',
    intro:
      'Liberia is the capital of Guanacaste and the region’s main gateway, home to Daniel Oduber International Airport (LIR). Known as the “White City” for its colonial architecture, it’s a practical base for volcano and national-park day trips and cultural tours. Browse the tours that depart from or near Liberia below.',
  },
  {
    slug: 'samara',
    town: 'Sámara',
    h1: 'Tours & Things to Do in Sámara, Guanacaste',
    title: 'Sámara Tours & Things to Do — Guanacaste, Costa Rica',
    description:
      'Tours and things to do in Sámara, Guanacaste — a laid-back Nicoya Peninsula beach town with a calm, reef-protected bay. Compare experiences and book direct.',
    intro:
      'Sámara is a relaxed beach town on the Nicoya Peninsula, known for its calm, reef-protected bay and unhurried pace. It’s a gentle spot for time on the water and easygoing days. See the tours available around Sámara below.',
  },
  {
    slug: 'santa-teresa',
    town: 'Santa Teresa',
    region: 'Nicoya Peninsula',
    h1: 'Tours & Things to Do in Santa Teresa, Malpaís & Montezuma',
    title: 'Santa Teresa, Malpaís & Montezuma Tours — Nicoya Peninsula, Costa Rica',
    description:
      'Tours and things to do around Santa Teresa, Malpaís and Montezuma on the southern Nicoya Peninsula — surf lessons, bioluminescence paddles, and Isla Tortuga and Curú day trips.',
    intro:
      'Santa Teresa, neighbouring Malpaís and the beach town of Montezuma sit at the southern tip of the Nicoya Peninsula, known for world-class surf, long sunsets and a laid-back, off-the-grid feel. The area is a base for surf lessons and night-time bioluminescence paddles, with boat day trips to Isla Tortuga and the Curú Wildlife Refuge on the peninsula’s eastern side. Browse the tours around Santa Teresa, Malpaís and Montezuma below.',
  },
  {
    slug: 'nosara',
    town: 'Nosara',
    region: 'Nicoya Peninsula',
    h1: 'Tours & Things to Do in Nosara, Costa Rica',
    title: 'Nosara Tours & Things to Do — Nicoya Peninsula, Costa Rica',
    description:
      'Tours and things to do in Nosara on the Nicoya Peninsula — surf, a cooking class, cycling and mountain tours, river floats, waterfall rappelling and birdwatching.',
    intro:
      'Nosara sits on the western coast of the Nicoya Peninsula, known for its consistent surf at Playa Guiones, a laid-back wellness and yoga scene, and easy access to wildlife and nature. Inland from the beach you’ll find birdwatching, river floats and waterfall adventures, with a jungle-meets-beach feel throughout. Browse the tours and things to do around Nosara below.',
  },
];

export function getDestinationBySlug(slug: string): Destination | undefined {
  return DESTINATIONS.find((d) => d.slug === slug);
}
