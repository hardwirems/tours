import type { BlogPost } from '../../lib/blog';

export const post: BlogPost = {
  slug: 'how-many-days-in-guanacaste',
  title: 'How Many Days in Guanacaste? 3-, 5- and 7-Day Itineraries',
  metaTitle: 'How Many Days in Guanacaste? 3, 5 & 7-Day Itineraries',
  description:
    'How many days do you need in Guanacaste? Realistic 3-, 5- and 7-day itineraries with honest drive times, current park rules and the tours that fit each day.',
  category: 'Planning',
  tags: ['itinerary', 'trip planning', 'how many days', 'rincon de la vieja', 'palo verde', 'tamarindo', 'nosara'],
  primaryQuery: 'how many days in guanacaste',
  intent: 'Help a traveler decide how long to spend in Guanacaste and what a realistic day-by-day plan looks like.',
  author: { name: 'Guanacaste Experiences editorial team', role: 'Travel editors' },
  published: '2026-09-15',
  reviewBy: '2027-03-15',
  draft: true,
  hero: {
    src: '/images/blog/how-many-days-in-guanacaste.webp',
    alt: 'Witch’s Rock (Roca Bruja) rising offshore beyond breaking waves on the coast of Santa Rosa National Park, Guanacaste',
    width: 1400, height: 934, focal: '60% 50%',
    credit: {
      source: 'Wikimedia Commons', sourceUrl: 'https://commons.wikimedia.org/wiki/File:Roca_Bruja_-_Guanacaste_-_Costa_Rica.jpg',
      author: 'dog4aday', license: 'CC BY 2.0', licenseUrl: 'https://creativecommons.org/licenses/by/2.0/',
      downloaded: '2026-09-15', attributionRequired: true,
      depicts: 'Witch’s Rock (Roca Bruja), Santa Rosa National Park, Guanacaste. Resized and converted to WebP.',
    },
  },
  excerpt:
    'Five days is the sweet spot for a first trip to Guanacaste. Here’s how to plan 3, 5 or 7 days without spending your holiday in a car — with the park rules that trip people up.',
  cta: { label: 'Browse Guanacaste tours', href: '/tours' },
  relatedTours: [
    'volcano-hike-waterfall-swim-hot-springs-combo-on-rincon-de-l',
    'sunset-catamaran-snorkeling-tour-in-playa-flamingo',
    'palo-verde-boat-tours-ortega',
    'rio-celeste-hiking-sloth-sanctuary-llanos-de-cortes-waterfal',
  ],
  relatedDestinations: ['tamarindo', 'playa-flamingo', 'liberia', 'nosara'],
  relatedPosts: ['lir-vs-sjo-airport-guide', 'rincon-de-la-vieja-volcano-guide', 'best-time-to-visit-guanacaste'],
  sources: [
    { title: 'SINAC — Parque Nacional Rincón de la Vieja', url: 'https://www.sinac.go.cr/ES/ac/acg/pnrv/Paginas/default.aspx', accessed: '2026-09-15', supports: 'Las Pailas hours (Tue–Sun 8am–3pm, closed Mondays), Santa María hours (closed Tue–Wed), non-resident fees, online-only tickets, the 3 km Las Pailas loop, closed crater trail and no swimming at the waterfalls.' },
    { title: 'Área de Conservación Guanacaste — Sector Las Pailas', url: 'https://www.acguanacaste.ac.cr/turismo/sector-pailas', accessed: '2026-09-15', supports: 'Las Pailas sits about 25 km from Liberia via Curubandé; online-only ticket sales since August 2023.' },
    { title: 'SINAC — Parque Nacional Palo Verde', url: 'https://www.sinac.go.cr/ES/ac/acat/pnpv/Paginas/default.aspx', accessed: '2026-09-15', supports: 'Palo Verde’s wetlands (Ramsar site), 280+ bird species, daily 8am–4pm hours and the recommendation of a 4x4 in the rainy season.' },
    { title: 'Organization for Tropical Studies — Palo Verde natural history', url: 'https://tropicalstudies.org/portfolio/natural-history-visitors-palo-verde/', accessed: '2026-09-15', supports: 'The Tempisque River’s large crocodile population and the unpaved access road from Bagaces.' },
    { title: 'SINAC — Parque Nacional Volcán Tenorio (Río Celeste)', url: 'https://www.sinac.go.cr/ES/ac/acat/pnvt/Paginas/default.aspx', accessed: '2026-09-15', supports: 'Río Celeste hours, online-only tickets, the no-entry-to-the-river rule and the 6 km round-trip Misterios del Tenorio trail.' },
    { title: 'Visit Costa Rica (ICT) — Llanos de Cortés waterfall', url: 'https://www.visitcostarica.com/planning-your-trip/other-activities/cataratas-llanos-del-cortes', accessed: '2026-09-15', supports: 'Llanos de Cortés is about 3 km from central Bagaces.' },
    { title: 'Visit Costa Rica (ICT) — Guanacaste weather', url: 'https://www.visitcostarica.com/climate/guanacaste-weather-forecast', accessed: '2026-09-15', supports: 'Guanacaste’s dry season (December–March, with April as a transition) and rainy season pattern.' },
    { title: 'My Tan Feet — Road conditions in Costa Rica', url: 'https://mytanfeet.com/costa-rica-travel-tips/road-conditions-in-costa-rica/', accessed: '2026-09-15', supports: 'The coastal road between Tamarindo and Nosara has unpaved stretches and river crossings that are unreliable in the rainy season.' },
    { title: 'Sunrise-Sunset.org API — sunset times for Liberia, Costa Rica (2026)', url: 'https://api.sunrise-sunset.org/json?lat=10.632&lng=-85.4393&date=2026-11-15&tzid=America/Costa_Rica', accessed: '2026-09-15', supports: 'Sunset ranges from about 5:17pm in mid-November to about 6:07pm in late June.' },
  ],
  body: [
    { type: 'p', text: 'For most first-time visitors, **five days** is the sweet spot for Guanacaste: enough for a beach base, a day at a volcano and a day on the water without rushing. **Three days** works if you stay in one beach town close to Liberia airport and pick one inland trip. With **seven days** you can add a second base further south, such as Nosara or Sámara.' },
    { type: 'callout', variant: 'note', title: 'The short answer', text: '**3 days:** one beach base + one inland day. **5 days:** beach + volcano + a boat or wildlife day. **7 days:** two bases — the northern beaches, then Nosara or Sámara.' },

    { type: 'h2', text: 'How to decide how long you need' },
    { type: 'ul', items: [
      '**Which airport you fly into.** Liberia (LIR) is 30 minutes to 1½ hours from most beaches; San José (SJO) adds roughly four to five hours each way. See [LIR vs. SJO](/blog/lir-vs-sjo-airport-guide).',
      '**How many bases you want.** Every hotel change costs about half a day. In five days or fewer, stay in one place.',
      '**Park schedules.** Rincón de la Vieja’s main sector is **closed on Mondays**, and national park tickets are sold **online only** — build those in before you fix your days.',
      '**Season.** December–March is dry; May–November brings sunny mornings and afternoon showers, so plan hikes and boat trips early.',
      '**Daylight.** Sunset ranges from about 5:15pm in November to about 6:05pm in June. Plan drives to finish before dark.',
    ] },
    {
      type: 'table',
      caption: 'Which trip length fits your plans.',
      headers: ['Trip length', 'Best base', 'What fits', 'Pace'],
      rows: [
        ['3 days', 'Playas del Coco, Flamingo or Tamarindo', 'Beach time + one inland day', 'Relaxed'],
        ['5 days', 'Tamarindo or Flamingo', 'Beach, volcano, a boat or wildlife day', 'Balanced'],
        ['7 days', 'Northern beach, then Nosara or Sámara', 'Everything above + a second coast', 'Full but unhurried'],
      ],
    },

    { type: 'h2', text: '3 days in Guanacaste: one base, no rushing' },
    { type: 'p', text: 'Pick a base close to Liberia airport: [Playas del Coco and Papagayo](/transportation/airport-transfers/lir/papagayo-coco) are about 30–45 minutes away, [Flamingo and Conchal](/destinations/playa-flamingo) about an hour, and [Tamarindo](/destinations/tamarindo) about 1¼–1½ hours.' },
    { type: 'h3', text: 'Day 1 — Arrive and slow down' },
    { type: 'p', text: 'Land at Liberia, transfer to your hotel and spend the afternoon on the beach. Walk down for sunset — it comes early in the tropics.' },
    { type: 'h3', text: 'Day 2 — Rincón de la Vieja (not a Monday)' },
    { type: 'p', text: 'Drive or take a tour to Rincón de la Vieja National Park, about 25 km from Liberia. The **Las Pailas loop** is about 3 km and takes around two hours, past steaming fumaroles and bubbling mud pots. Buy tickets in advance on SINAC’s online system, or book a [volcano, waterfall and hot-springs combo](/tours/volcano-hike-waterfall-swim-hot-springs-combo-on-rincon-de-l) that includes park fees and pickup. More detail in our [Rincón de la Vieja guide](/blog/rincon-de-la-vieja-volcano-guide).' },
    { type: 'h3', text: 'Day 3 — Morning on the water, then fly out' },
    { type: 'p', text: 'If your flight is in the afternoon, fit in a short morning activity near your base, such as a [Tamarindo estuary boat safari](/tours/tamarindo-estuary-boat-safari) or snorkeling at Playa Conchal. Leave a generous buffer for the drive back to Liberia.' },

    { type: 'h2', text: '5 days in Guanacaste: beach, volcano and water' },
    { type: 'p', text: 'Base yourself in Tamarindo or Flamingo for all five nights. This is the itinerary we’d suggest for most first trips.' },
    { type: 'ol', items: [
      '**Day 1 — Arrive.** Settle in, beach afternoon, sunset.',
      '**Day 2 — Volcano day.** Rincón de la Vieja, as above. Avoid Mondays.',
      '**Day 3 — Catamaran and snorkel.** A half-day sail with snorkeling, lunch and drinks — see our [best catamaran tours in Guanacaste](/blog/best-catamaran-tours-guanacaste) roundup, or book the [Flamingo sunset catamaran](/tours/sunset-catamaran-snorkeling-tour-in-playa-flamingo).',
      '**Day 4 — Wildlife and a waterfall.** Take a [Palo Verde boat tour](/tours/palo-verde-boat-tours-ortega) on the Tempisque River — the park’s wetlands host more than 280 bird species and plenty of crocodiles — then cool off at Llanos de Cortés waterfall near Bagaces, where swimming is allowed in the roped-off area.',
      '**Day 5 — Your pick, then depart.** A surf lesson, a zipline, or simply more beach before the drive back to Liberia.',
    ] },
    { type: 'callout', variant: 'tip', title: 'Birdwatchers', text: 'Palo Verde is at its best in the dry season (roughly December–April), when water birds crowd into the shrinking wetlands. The access road is unpaved, and SINAC recommends a 4x4 in the rainy season — a guided tour avoids that drive.' },

    { type: 'h2', text: '7 days in Guanacaste: two bases' },
    { type: 'p', text: 'Follow the 5-day plan for your first four days in the north, then move south to the Nicoya Peninsula for a quieter, more rugged coast.' },
    { type: 'ol', items: [
      '**Days 1–4 — Northern beaches.** Arrival, Rincón de la Vieja, a catamaran day and Palo Verde, based in Tamarindo or Flamingo.',
      '**Day 5 — Move to Nosara or Sámara.** Take the paved route through Nicoya: about 2 hours from Tamarindo to Sámara and roughly 2½ hours to Nosara. The coastal road looks shorter on a map but has unpaved stretches and river crossings — skip it in the rainy season.',
      '**Day 6 — Surf, yoga or horseback.** Nosara is known for surf and wellness; Sámara’s calm bay suits beginners and families. Try a [jungle and beach horseback ride in Sámara](/tours/jungle-and-beach-horseback-riding-tour-2h-1-2).',
      '**Day 7 — Back to Liberia.** Allow a full half-day for the drive and don’t book a tight flight.',
    ] },
    { type: 'p', text: 'If you’d rather stay north all week, swap the second base for a day trip to **Río Celeste** in Tenorio Volcano National Park — about 1¾–2 hours each way from Liberia. The [Río Celeste, sloth sanctuary and Llanos de Cortés tour](/tours/rio-celeste-hiking-sloth-sanctuary-llanos-de-cortes-waterfal) combines it with the waterfall.' },

    { type: 'h2', text: 'Park rules to plan around' },
    { type: 'callout', variant: 'warning', title: 'Check these before you set your days', text: '**Rincón de la Vieja:** Las Pailas is open Tuesday–Sunday, 8am–3pm (closed Mondays); the Santa María sector is closed Tuesdays and Wednesdays; the crater trail is closed and swimming at its waterfalls isn’t allowed. **Río Celeste:** entry 8am–2pm, and you can’t go in the river. **Both parks sell tickets online only**, through SINAC’s booking site. Rules change — confirm with SINAC before you go.' },

    { type: 'h2', text: 'Pacing tips that make the trip better' },
    { type: 'ul', items: [
      'Change hotels no more than once in a 5-day trip.',
      'Drive in daylight; sunset can come before 5:30pm from October to December.',
      'Do the active things in the morning, especially in the green season.',
      'Book tours with free cancellation — every tour linked in this guide offers it — so a rainy day doesn’t cost you.',
      'Keep your departure day light: Liberia is 30 minutes to 1½ hours from most beaches.',
    ] },
    { type: 'cta', label: 'Compare tours for your itinerary', href: '/tours', note: 'Volcano, catamaran, wildlife and surf tours across Guanacaste — booked through Viator with free cancellation on most.' },

    { type: 'h2', text: 'Frequently asked questions' },
    { type: 'faq', items: [
      { q: 'Is 3 days enough for Guanacaste?', a: 'Yes, if you stay in one beach town near Liberia airport and pick one inland trip, such as Rincón de la Vieja. You won’t see both coasts, but you’ll have a relaxed trip.' },
      { q: 'Can I visit Rincón de la Vieja from Tamarindo?', a: 'Yes, but it’s a long day — the park is about 25 km past Liberia, which is itself over an hour from Tamarindo. Most visitors take a tour with hotel pickup, and remember the main sector is closed on Mondays.' },
      { q: 'Is Río Celeste in Guanacaste?', a: 'Tenorio Volcano National Park straddles the border, and the main El Pilón entrance is on the Alajuela side — but it’s a popular day trip from Liberia, about 1¾–2 hours away.' },
      { q: 'Do I need a car?', a: 'Not necessarily. With one base and tours that include pickup, you can manage without one. A car helps on a two-base, 7-day trip.' },
    ] },
  ],
};
