import type { BlogPost } from '../../lib/blog';

export const post: BlogPost = {
  slug: 'getting-around-guanacaste-transport',
  title: 'Getting Around Guanacaste: Rental Car, Shuttle, or Tour Pickup?',
  metaTitle: 'Getting Around Guanacaste — Transport Options Compared',
  description:
    'How to get around Guanacaste, Costa Rica: flying into Liberia (LIR), when a rental car is worth it, shuttles and transfers, road realities, and tour pickups.',
  category: 'Practical',
  tags: ['transport', 'rental car', 'shuttle', 'liberia airport', 'driving', 'trip planning'],
  primaryQuery: 'how to get around guanacaste',
  intent: 'Help a traveler choose how to move around Guanacaste based on their itinerary.',
  author: { name: 'Guanacaste Experiences editorial team', role: 'Travel editors' },
  published: '2026-09-13',
  reviewBy: '2027-03-01',
  draft: true,
  hero: {
    src: '/images/blog/getting-around-guanacaste-street.webp',
    alt: 'A quiet palm-lined town street with a mountain in the distance, Costa Rica',
    width: 2400, height: 1500, focal: '50% 40%',
    credit: {
      source: 'Pexels', sourceUrl: 'https://www.pexels.com/photo/palm-tree-by-street-in-town-17302420/',
      author: 'Jean-Daniel Francoeur', license: 'Pexels License', licenseUrl: 'https://www.pexels.com/license/',
      downloaded: '2026-09-13', attributionRequired: false,
      depicts: 'A palm-lined town street with a mountain view in Costa Rica.',
    },
  },
  excerpt:
    'You don’t always need a rental car in Guanacaste — and sometimes you really do. Here’s how to match transport to your trip, from Liberia airport onward.',
  cta: { label: 'Browse tours (many include hotel pickup)', href: '/tours' },
  relatedTours: ['guachipelin-adventure-volcano-zipline-river-tubing-combo', 'sunset-catamaran-snorkeling-tour-in-playa-flamingo'],
  relatedDestinations: ['liberia', 'tamarindo'],
  relatedPosts: ['best-time-to-visit-guanacaste', 'rincon-de-la-vieja-volcano-guide'],
  sources: [
    { title: 'Aeropuerto Internacional Daniel Oduber Quirós (Liberia, LIR)', url: 'https://www.liberiacostaricaairport.net/', accessed: '2026-09-13', supports: 'That Liberia (LIR) is the main international gateway serving Guanacaste’s beaches, closer than San José (SJO).' },
    { title: 'Instituto Costarricense de Turismo — Visit Costa Rica (getting around)', url: 'https://www.visitcostarica.com/en/costa-rica/planning-your-trip/how-to-get-around', accessed: '2026-09-13', supports: 'Overview of transport options in Costa Rica: rental cars, shuttles, public buses and domestic flights.' },
  ],
  body: [
    { type: 'p', text: 'The honest answer to “do I need a car in Guanacaste?” is: it depends on your itinerary. If you’re basing in one beach town and doing tours that pick you up, you can skip the rental entirely. If you want to roam between beaches, reach the southern peninsula, or set your own schedule, a car earns its cost quickly. This guide walks through the options so you can match transport to the trip you’re actually taking.' },

    { type: 'h2', text: 'Start with the right airport' },
    { type: 'p', text: '**Liberia (LIR)** — Daniel Oduber Quirós International Airport — is the gateway to Guanacaste. It’s far closer to the northern beaches than San José (SJO), which sits on the other side of the country. Flying into Liberia can save you several hours of driving on arrival day. If your whole trip is Guanacaste-focused, prioritise a Liberia itinerary; save San José for trips that also take in the Central Valley or the Caribbean.' },

    { type: 'h2', text: 'Your options, compared' },
    {
      type: 'table',
      caption: 'How the main ways of getting around Guanacaste stack up.',
      headers: ['Option', 'Best for', 'Trade-offs'],
      rows: [
        ['Rental car', 'Multi-area trips, flexibility, remote beaches', 'Rougher roads; parking; you do the driving'],
        ['Private transfer', 'Door-to-door comfort, families, arrival day', 'Higher cost than shared options'],
        ['Shared shuttle', 'Getting between towns on a budget', 'Fixed times; some transfers en route'],
        ['Public bus', 'Cheapest travel, longer stays', 'Slow; routes hub through Liberia'],
        ['Tour pickup', 'Activity days without a car', 'Only covers that tour’s route'],
        ['Domestic flight', 'Skipping a long drive to far towns', 'Small planes, baggage limits, weather'],
      ],
    },

    { type: 'h2', text: 'When a rental car is worth it' },
    { type: 'p', text: 'A car makes sense if you plan to move between several beaches, chase sunsets on your own schedule, or reach places public transport serves poorly. A few realities to plan around:' },
    { type: 'ul', items: [
      'Distances are short but drive times are long — winding and unpaved sections mean a “30 km” hop can take far longer than you’d expect.',
      'Many beach and peninsula roads are unpaved. A higher-clearance vehicle (often a 4x4) is wise for the southern Nicoya Peninsula and some beach access roads, especially in the green season when a few routes cross rivers.',
      'Fuel stations thin out away from the main towns — top up when you can.',
      'Drive in daylight where possible: unlit roads, animals and pedestrians make night driving harder.',
    ] },
    { type: 'callout', variant: 'tip', title: 'Reaching Santa Teresa, Malpaís and Montezuma', text: 'The southern tip of the Nicoya Peninsula has the roughest roads in the region. Reaching it is either a long overland drive or a ferry crossing from Puntarenas to Paquera plus a drive. Build in extra time and don’t assume your map app’s estimate accounts for the surface.' },

    { type: 'h2', text: 'When you can skip the car' },
    { type: 'p', text: 'If your plan is a single base plus a handful of tours, a rental can be more hassle than help. Private and shared shuttles cover the airport-to-hotel and town-to-town legs, and a huge share of tours — [catamaran sails](/tours?category=beach-water), [volcano and adventure combos](/tours?category=adventure), snorkeling trips — include **hotel pickup and drop-off**. On those days you don’t need to drive at all. For a relaxed beach trip out of one town, shuttles plus tour pickups often work out simpler and cheaper than renting, parking and driving unfamiliar roads.' },
    { type: 'cta', label: 'See tours with hotel pickup', href: '/tours', note: 'Check each tour’s details — many include round-trip transport from the main beach towns.' },

    { type: 'h2', text: 'Shuttles, buses, taxis and apps' },
    { type: 'ul', items: [
      '**Private transfers** are the easy button for arrival day and for families with luggage — door to door, on your schedule.',
      '**Shared shuttles** run set routes between the popular towns at a lower price, with fixed departure times.',
      '**Public buses** are the cheapest way to travel and connect the main towns, with routes hubbing through Liberia. They’re slower and better suited to flexible, longer stays.',
      '**Taxis and ride apps** exist, but coverage varies by town — don’t assume an app will be available everywhere. Agree on fares or use official taxis where apps aren’t reliable.',
    ] },

    { type: 'h2', text: 'A simple rule of thumb' },
    { type: 'p', text: 'One base, mostly tours → **shuttles plus tour pickups**. Several beaches or the southern peninsula on your own clock → **rent a car**, and size the vehicle to the roads you’ll actually drive. Either way, book airport transport for arrival day in advance so you’re not sorting it out after a flight.' },

    { type: 'h2', text: 'Frequently asked questions' },
    { type: 'faq', items: [
      { q: 'Do I need a 4x4 in Guanacaste?', a: 'Not always, but it helps. Main highways are paved, while many beach and peninsula access roads are unpaved and rougher in the green season. If your itinerary includes the southern Nicoya Peninsula or remote beaches, a higher-clearance vehicle is the safer choice.' },
      { q: 'Should I fly into Liberia or San José?', a: 'For a Guanacaste-focused trip, Liberia (LIR) is much closer to the beaches and saves hours of driving. Choose San José (SJO) only if your trip also covers the Central Valley or other regions.' },
      { q: 'Can I visit Guanacaste without renting a car?', a: 'Yes. If you stay in one town and rely on shuttles and tours that include hotel pickup, you can have a full trip without driving. A car mainly pays off when you want to move around freely.' },
      { q: 'Are drive times really that long?', a: 'Often longer than the distance suggests. Winding and unpaved sections slow you down, so add a buffer to any map estimate and avoid tight, back-to-back plans on driving days.' },
    ] },
  ],
};
