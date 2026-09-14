import type { BlogPost } from '../../lib/blog';

export const post: BlogPost = {
  slug: 'best-time-to-visit-guanacaste',
  title: 'The Best Time to Visit Guanacaste: Dry Season vs. Green Season',
  metaTitle: 'Best Time to Visit Guanacaste — Dry vs. Green Season Guide',
  description:
    'When to visit Guanacaste, Costa Rica: how the dry and green seasons compare on weather, crowds, prices and scenery — and which one fits the trip you want.',
  category: 'Seasons & Weather',
  tags: ['when to visit', 'dry season', 'green season', 'weather', 'trip planning'],
  primaryQuery: 'best time to visit guanacaste',
  intent: 'Help a traveler choose which season to visit Guanacaste based on weather, crowds, price and scenery.',
  author: { name: 'Guanacaste Experiences editorial team', role: 'Travel editors' },
  published: '2026-09-13',
  reviewBy: '2027-03-01',
  featured: true,
  draft: false,
  hero: {
    src: '/images/blog/best-time-guanacaste-sunset.webp',
    alt: 'Sunset with layered clouds over a beach on the Guanacaste coast, Costa Rica',
    width: 2400,
    height: 1350,
    credit: {
      source: 'Pexels', sourceUrl: 'https://www.pexels.com/photo/clouds-at-sunset-over-beach-15365641/',
      author: 'Jean Paul Montanaro', license: 'Pexels License', licenseUrl: 'https://www.pexels.com/license/',
      downloaded: '2026-09-13', attributionRequired: false,
      depicts: 'A sunset over a beach on the Guanacaste (Pacific northwest) coast of Costa Rica.',
    },
  },
  excerpt:
    'Guanacaste has two clear seasons, and the “best” one depends on what you want. Here’s how the dry and green seasons really compare — and how to pick.',
  cta: { label: 'Browse Guanacaste tours', href: '/tours' },
  relatedTours: ['surf-lessons-in-tamarindo-costa-rica', 'sunset-catamaran-snorkeling-tour-in-playa-flamingo', 'bioluminescent-kayak-tour'],
  relatedDestinations: ['tamarindo', 'playa-flamingo'],
  relatedPosts: ['rincon-de-la-vieja-volcano-guide', 'getting-around-guanacaste-transport'],
  sources: [
    { title: 'Instituto Costarricense de Turismo — Visit Costa Rica (weather & when to go)', url: 'https://www.visitcostarica.com/en/costa-rica/planning-your-trip/weather', accessed: '2026-09-13', supports: 'Costa Rica’s dry and rainy (“green”) season framing and the Guanacaste/North Pacific being the country’s driest region.' },
    { title: 'Instituto Meteorológico Nacional de Costa Rica (IMN) — climate regions', url: 'https://www.imn.ac.cr/', accessed: '2026-09-13', supports: 'North Pacific climate pattern: a long dry season and a wet season concentrated May–November.' },
    { title: 'SINAC — Costa Rica national parks and protected areas', url: 'https://www.sinac.go.cr/', accessed: '2026-09-13', supports: 'National-park context in Guanacaste (Rincón de la Vieja, Palo Verde, Santa Rosa) and that conditions and access vary by season.' },
  ],
  body: [
    { type: 'p', text: 'The short answer: **December to April** is Guanacaste’s dry season and the safest bet for uninterrupted beach days and dependable sun. **May to November** is the green season — greener, quieter and cheaper, with rain that usually arrives as an afternoon downpour rather than an all-day washout. Guanacaste is the driest region of Costa Rica, so even its wet season tends to be milder than the Caribbean or the south Pacific.' },
    { type: 'p', text: 'Neither season is “better” in the abstract. The right choice depends on how much you value guaranteed sun versus lower prices, thinner crowds and a landscape that has actually turned green. Below is how they compare and who each one suits.' },

    { type: 'h2', text: 'The two seasons at a glance' },
    {
      type: 'table',
      caption: 'General patterns for the Guanacaste (North Pacific) coast. Exact conditions vary year to year.',
      headers: ['', 'Dry season (Dec–Apr)', 'Green season (May–Nov)'],
      rows: [
        ['Weather', 'Reliably sunny, low rain, breezy', 'Sunny mornings, afternoon showers; Sep–Oct wettest'],
        ['Landscape', 'Golden, dry tropical forest', 'Lush and green; rivers and waterfalls fuller'],
        ['Crowds', 'Peak season; busiest Dec–Jan & Easter', 'Quieter, especially Sep–Oct'],
        ['Prices', 'Highest; book well ahead', 'Lower rates and more availability'],
        ['Best for', 'Beach time, sailing, dependable plans', 'Value, greenery, wildlife, fewer people'],
        ['Watch-outs', 'Book early; sun is strong', 'Pack a rain layer; a few tours pause in Oct'],
      ],
    },

    { type: 'h2', text: 'Dry season (December to April)' },
    { type: 'p', text: 'This is high season for a reason. Rain is uncommon, the sky stays clear, and the trade winds keep the coast comfortable. Catamaran sails, snorkeling trips and beach days run on schedule, and sunsets are consistently good. The trade-off is company and cost: the last two weeks of December, plus Semana Santa (Easter week), are the busiest and priciest stretch of the year, and popular tours and hotels fill up early.' },
    { type: 'ul', items: [
      'Most dependable weather for a beach-focused trip.',
      'Strong, dry heat by midday — plan water activities for the morning and carry sun protection.',
      'The dry forest turns gold and loses its leaves, which actually makes wildlife easier to spot.',
      'Reserve flights, lodging and marquee tours weeks ahead for late December and Easter.',
    ] },

    { type: 'h2', text: 'Green season (May to November)' },
    { type: 'p', text: 'The green season gets an unfair reputation. For most of it, mornings are bright and clear, and the rain shows up as a warm afternoon or evening downpour that clears as quickly as it came. In return you get a landscape that has come back to life, fuller rivers and waterfalls, noticeably lower prices and beaches you can have closer to yourself. The exception is the heart of the wet season — roughly September and October — when rain is more frequent and a handful of boat tours reduce their schedule.' },
    { type: 'ul', items: [
      'Best value of the year on lodging and tours, with more last-minute availability.',
      'Green, photogenic scenery and waterfalls with real flow.',
      'Plan outdoor activities for the morning and keep afternoons flexible.',
      'September and October are the wettest months; build in buffer days and a rain layer.',
    ] },
    { type: 'callout', variant: 'note', title: 'One honest caveat', text: 'Weather is a pattern, not a promise. Dry-season cold fronts can bring a rare cloudy stretch, and a green-season week can be almost entirely sunny. Treat the seasons as odds, not guarantees, and keep one flexible day in your plan.' },

    { type: 'h2', text: 'Which season suits you?' },
    { type: 'p', text: 'Choose the **dry season** if you want the surest weather and you’re building a trip around beaches, sailing and a packed tour schedule — and you’re comfortable booking early and paying peak rates.' },
    { type: 'p', text: 'Choose the **green season** if you care more about value, greenery and space than about a guaranteed rain-free week, and you’re happy to plan around mornings. May, June and November are the sweet spot: green and quiet, but not yet at peak rainfall.' },

    { type: 'h2', text: 'How the season changes what you can do' },
    { type: 'p', text: 'Coastal experiences — [catamaran sails](/tours?category=beach-water), snorkeling and surf lessons — run essentially year-round, with the dry season offering the calmest, clearest days. Waterfall and river tours are at their most dramatic in the green season, when there’s water actually moving. Wildlife is rewarding either way: the bare dry forest makes animals easier to see in the dry months, while the green season brings nesting and more active birdlife. If your trip is flexible, match the season to the experiences you care about most, then browse what’s available in [Tamarindo](/destinations/tamarindo), [Playa Flamingo](/destinations/playa-flamingo) and along the coast.' },
    { type: 'cta', label: 'See tours by activity', href: '/tours', note: 'Filter by beach & water, adventure, wildlife and more.' },

    { type: 'h2', text: 'Frequently asked questions' },
    { type: 'faq', items: [
      { q: 'What are the wettest months in Guanacaste?', a: 'September and October are typically the wettest, with more frequent and heavier afternoon rain. They’re also the quietest and cheapest — a fair trade if you’re flexible.' },
      { q: 'Does it rain all day in the green season?', a: 'Usually no. For most of the green season, rain comes as an afternoon or evening shower after a clear morning. All-day rain is more common only at the peak in September and October.' },
      { q: 'When is Guanacaste most crowded?', a: 'The last two weeks of December and Easter week (Semana Santa) are the busiest and most expensive. July also sees a bump during the northern-hemisphere summer.' },
      { q: 'Is the green season a bad time to visit?', a: 'Not at all. If you value lower prices, greener scenery and fewer people — and you plan activities for the morning — it can be the better trip. Just avoid building a rigid, weather-dependent itinerary at the September–October peak.' },
    ] },
  ],
};
