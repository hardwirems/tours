// ---------------------------------------------------------------------------
// lib/tours.ts — Tour data + categories + affiliate info.
// Used by the app and the SEO layer.
// ---------------------------------------------------------------------------

export interface TourFAQ {
  question: string
  answer: string
}

export interface TourImage {
  src: string
  alt: string
  caption?: string
}

export interface Tour {
  slug: string
  title: string
  category: string
  tags: string[]
  towns: string[]
  description: string
  duration: string
  durationMinutes?: number
  priceFrom: number
  priceNote: string
  difficulty: 'easy' | 'moderate' | 'adventurous'
  minAge?: number
  rating?: number
  reviewCount?: number
  affiliateUrl: string
  affiliateLabel: string
  freeCancellation: boolean
  whatIncluded: string[]
  whatToBring: string[]
  faq: TourFAQ[]
  images: TourImage[]
  bookingNotes?: string
  ogImage?: string
  schemaType?: 'TouristTrip' | 'Event' | 'Thing'
  // Fields used by TourCard + screens + seo-pages
  primaryAffiliate?: string
  languages?: string[]
  pickup?: 'hotel' | 'meeting-point' | 'both'
  bookedRecent?: string
  includes?: string[]
  itinerary?: string[]
  seasonalNote?: string
  tips?: string[]
}

// ---------------------------------------------------------------------------
// Tour data
// ---------------------------------------------------------------------------

export const TOURS: Tour[] = [
  {
    slug: 'catamaran-sunset-tamarindo',
    title: 'Catamaran Sunset Sail — Tamarindo',
    category: 'beach-water',
    tags: ['catamaran', 'sunset', 'sailing', 'tamarindo', 'private', 'romantic'],
    towns: ['Tamarindo', 'Flamingo'],
    description: 'Set sail on a 34-foot catamaran as the sun dips over Guanacaste. Cruise the bays, snorkel at a quiet reef, enjoy a homemade meal with cocktails on deck. Dolphins frequently ride the bow.',
    duration: '4 hours',
    priceFrom: 425,
    priceNote: 'per private group (up to 10)',
    difficulty: 'easy',
    rating: 4.9,
    reviewCount: 48,
    affiliateUrl: 'https://www.getyourguide.com/tamarindo-l169319/boat-tours-c93/plana-catamaran-private-sailing-tour-t49/sku1005795/',
    affiliateLabel: 'Check availability & book on GetYourGuide',
    freeCancellation: true,
    whatIncluded: ['Private 34ft catamaran', 'Captain + crew', 'Snorkel gear', 'Homemade dinner + cocktails', 'Pickup from Tamarindo hotels'],
    whatToBring: ['Swimsuit', 'Towel', 'Reef-safe sunscreen', 'Camera', 'Light jacket'],
    faq: [
      { question: 'Is the catamaran tour private?', answer: 'The top-rated version is a private charter for your group only (up to 10 people). Shared departures are available on some operators — check the listing.' },
      { question: 'What time does it start?', answer: 'Most sunset sails depart around 4:30–5:00 PM and return by 8:00–8:30 PM.' },
    ],
    images: [{ src: 'https://images.unsplash.com/photo-1591756413813-37aed080bbc4?w=800&q=80', alt: 'Catamaran at sunset off Tamarindo coast' }],
    bookingNotes: 'Book 2–3 days ahead in dry season (Dec–Apr).',
  },
  {
    slug: 'snorkeling-las-catalinas',
    title: 'Snorkeling at Las Catalinas Islands — Tamarindo',
    category: 'beach-water',
    tags: ['snorkeling', 'las-catalinas', 'tamarindo', 'marine-life', 'group', 'boat'],
    towns: ['Tamarindo', 'Brasilito'],
    description: 'Las Catalinas is a quiet island community with some of the best snorkeling on Costa Rica\'s Pacific coast. Charter a boat from Tamarindo to the protected coves and reef walls — tropical fish, reef sharks (harmless), rays, and occasional sea turtles.',
    duration: '5 hours',
    priceFrom: 140,
    priceNote: 'per person (small group)',
    difficulty: 'easy',
    minAge: 6,
    rating: 4.8,
    reviewCount: 124,
    affiliateUrl: 'https://www.getyourguide.com/tamarindo-l169319/boat-tours-c93/snorkeling-at-las-catalinas-islands-t49/sku1005796/',
    affiliateLabel: 'Check availability & book on GetYourGuide',
    freeCancellation: true,
    whatIncluded: ['Marine transportation', 'Guide', 'Snorkel gear', 'Drinks + snacks on board', 'Hotel pickup'],
    whatToBring: ['Swimsuit', 'Towel', 'Reef-safe sunscreen', 'Camera', 'Motion sickness meds (green season)'],
    faq: [
      { question: 'Is the water warm enough?', answer: 'Yes — Pacific water temps off Las Catalinas range from 79–84°F (26–29°C) year-round.' },
      { question: 'What marine life will we see?', answer: 'Tropical reef fish, white-tip reef sharks (harmless), sting rays, spotted eagle rays, and occasionally sea turtles. Whale sightings on the boat ride are common Dec–Apr.' },
    ],
    images: [{ src: 'https://images.unsplash.com/photo-1582739025411-23d4c6276232?w=800&q=80', alt: 'Snorkelers over reef at Las Catalinas' }],
    bookingNotes: 'Best Dec–Apr. Green season (May–Nov) is rougher but still doable — fewer tourists.',
  },
  {
    slug: 'atv-tamarindo',
    title: 'ATV Tours in Tamarindo — Beach & Mountain Adventures',
    category: 'adventure',
    tags: ['atv', 'tamarindo', 'beach', 'mountain', 'off-road', 'adventure'],
    towns: ['Tamarindo', 'Brasilito'],
    description: 'ATV tours from Tamarindo combine off-road riding through dry forest trails with a beach section — ride down to Playa Minas or Playa Flamingo, through hills and riverbeds, with a guide leading the way. Half-day tours are the standard.',
    duration: '2 hours',
    priceFrom: 99,
    priceNote: 'per person (small group)',
    difficulty: 'moderate',
    minAge: 16,
    rating: 4.3,
    reviewCount: 41,
    affiliateUrl: 'https://www.getyourguide.com/tamarindo-l169319/adventure-tours-c86/atv-beach-and-mountain-tour-t49/sku1005801/',
    affiliateLabel: 'Check availability & book on GetYourGuide',
    freeCancellation: true,
    whatIncluded: ['ATV (single or double cabin)', 'Helmet + safety gear', 'Guide', 'Hotel pickup'],
    whatToBring: ['Long pants', 'Sturdy closed-toe shoes', 'Shirt (no tank tops)', 'Sunscreen', 'Water', 'Camera/phone (secure pouch)', 'Motion sickness meds'],
    faq: [
      { question: 'Do I need ATV experience?', answer: 'No — the standard Tamarindo trails are designed for beginners. A practice loop covers handling, and a guide leads the way.' },
      { question: 'Can kids ride?', answer: 'Typically 16+ to drive solo, 12+ to ride double with an adult. Some operators have different minimums — check when booking.' },
    ],
    images: [{ src: 'https://images.unsplash.com/photo-1533473340266-f9e4385db36a?w=800&q=80', alt: 'ATV riding through dry forest near Tamarindo' }],
    bookingNotes: 'No experience required. Long pants + closed-toe shoes required.',
  },
  {
    slug: 'rincon-de-la-vieja-volcano',
    title: 'Rincón de la Vieja Volcano — Hike, Hot Springs & Waterfalls',
    category: 'wildlife-nature',
    tags: ['volcano', 'hiking', 'hot-springs', 'rincón-de-la-vieja', 'national-park', 'waterfall', 'wildlife'],
    towns: ['Liberia', 'Santa Rosa'],
    description: 'Rincón de la Vieja is Guanacaste\'s active volcano and one of the province\'s must-see natural attractions. A guided day trip takes you into the national park\'s dry tropical forest, past volcanic fumaroles and mud pots, to waterfalls and — often — a natural hot spring soak at the end of the day.',
    duration: 'Full day (7–8 hours)',
    priceFrom: 93,
    priceNote: 'per adult (incl. transport, guide, lunch)',
    difficulty: 'moderate',
    minAge: 6,
    rating: 4.7,
    reviewCount: 211,
    affiliateUrl: 'https://www.getyourguide.com/santa-rosa-de-guanacaste-l171745/volcano-hiking-tours-c154/rincon-de-la-vieja-volcano-hike-hot-springs-t49/sku1006123/',
    affiliateLabel: 'Check availability & book on GetYourGuide',
    freeCancellation: true,
    whatIncluded: ['Round-trip transport from Liberia/Santa Rosa', 'Certified naturalist guide', 'Park entrance fee', 'Lunch', 'Optional hot spring access'],
    whatToBring: ['Hiking shoes with grip', 'Light long pants', 'Sunscreen + hat', 'Binoculars', 'Water bottle', 'Cash for park entrance (if not included)', 'Swimsuit + towel (if hot springs included)'],
    faq: [
      { question: 'Is the volcano active?', answer: 'Rincón de la Vieja is classified as active — frequent fumaroles, mud pots, occasional small phreatic eruptions. It\'s safe to visit the park; guides know the current activity level.' },
      { question: 'What wildlife will we see?', answer: 'Coatis, white-faced capuchin monkeys, howler monkeys, toucans, motmots, and occasionally Baird\'s tapir. Birding is excellent.' },
      { question: 'Are the hot springs included?', answer: 'It depends on the tour. Some include a stop at natural hot springs or a nearby resort; others only do the park hike. Check the "What\'s included" section when booking.' },
    ],
    images: [{ src: 'https://images.unsplash.com/photo-1591756413813-37aed080bbc4?w=800&q=80', alt: 'Fumaroles and mud pots at Rincón de la Vieja' }],
    bookingNotes: 'Park entrance fee (~$15/person) usually not included — bring cash. Hot springs vary by operator.',
  },
  {
    slug: 'palo-verde-birdwatching',
    title: 'Palo Verde National Park — Birdwatching & Wildlife Boat Tour',
    category: 'wildlife-nature',
    tags: ['birdwatching', 'palo-verde', 'boat-tour', 'wetlands', 'wildlife', 'national-park'],
    towns: ['Liberia', 'Guácimo'],
    description: 'Palo Verde is a Ramsar wetland on the Tempisque River — one of the best birding spots in Central America. A guided boat tour through the mangroves and marsh gives you close-up views of kingfishers, egrets, herons, ospreys, and (in season) thousands of migratory waterfowl.',
    duration: 'Full day (6–7 hours)',
    priceFrom: 95,
    priceNote: 'per adult (incl. transport, guide, boat)',
    difficulty: 'easy',
    rating: 4.6,
    reviewCount: 89,
    affiliateUrl: 'https://www.getyourguide.com/liberia-l170255/wildlife-tours-c126/palo-verde-national-park-t49/sku1005987/',
    affiliateLabel: 'Check availability & book on GetYourGuide',
    freeCancellation: true,
    whatIncluded: ['Round-trip transport from Liberia area', 'Naturalist guide', 'Boat tour on Tempisque River', 'Park entrance fee', 'Lunch'],
    whatToBring: ['Binoculars', 'Camera with zoom', 'Insect repellent', 'Sunscreen + hat', 'Light long pants', 'Water bottle'],
    faq: [
      { question: 'What birds will we see?', answer: 'Green ibis, kingfishers, egrets, great blue heron, osprey, toucans, motmots, and in season (Nov–Mar) thousands of migratory ducks, sandpipers, and plovers from North America.' },
      { question: 'How long is the boat tour?', answer: 'Typically 1.5–2 hours on the water, plus time on land trails. Full day trips from Liberia are 6–7 hours including transport.' },
    ],
    images: [{ src: 'https://images.unsplash.com/photo-1582739025411-23d4c6276232?w=800&q=80', alt: 'Boat on Tempisque River at Palo Verde' }],
    bookingNotes: 'Early start (6:30 AM pickup) for best birding. Park fee (~$15) usually extra — bring cash.',
  },
  {
    slug: 'zip-lining-guanacaste',
    title: 'Zip-lining in Guanacaste — Best Canopy Tours 2026',
    category: 'adventure',
    tags: ['zip-line', 'canopy', 'adventure', 'guanacaste', 'diamante', 'blue-river', 'hacienda-guachipelin'],
    towns: ['Tamarindo', 'Papagayo', 'Rincón de la Vieja', 'Liberia'],
    description: 'Guanacaste has some of the most scenic zip-line courses in Costa Rica — flying through dry forest canopy over rivers, volcanoes, and (at Diamante) the ocean. Courses range from family-friendly to adrenaline-focused (Superman lines, Tarzan swings, rappels).',
    duration: '1–2 hours (per course)',
    priceFrom: 67,
    priceNote: 'per adult (varies by course)',
    difficulty: 'moderate',
    minAge: 6,
    rating: 4.8,
    reviewCount: 2400,
    affiliateUrl: 'https://www.getyourguide.com/guanacaste-l170254/adventure-tours-c86/zip-line-canopy-tours-c49/sku1005799/',
    affiliateLabel: 'Check availability & book on GetYourGuide — compare all courses',
    freeCancellation: true,
    whatIncluded: ['All zip-line equipment (harness, helmet, gloves)', 'Certified guides + safety briefing', 'Course access (all lines)'],
    whatToBring: ['Closed-toe shoes', 'Sunscreen', 'Camera (small, in pouch)', 'Water', 'Change of clothes (if combined with other activities)'],
    faq: [
      { question: 'Is zip-lining safe in Costa Rica?', answer: 'Yes — reputable courses use double-cable systems, redundant harness clips, and certified guides. Check ICT certification. The top Guanacaste courses all have strong safety records.' },
      { question: 'What is the weight/age limit?', answer: 'Most courses require minimum weight ~60 lbs (27 kg) for short lines, ~85 lbs (40 kg) for the full circuit. Maximum ~250 lbs (113 kg). Minimum age typically 6–10 depending on the course.' },
      { question: 'Which course has the best views?', answer: 'Diamante Eco Adventure Park\'s zip-line includes the only dual-cable ocean-view line in Costa Rica — you fly over the Pacific coastline. Hacienda Guachipelin offers canyon views. Blue River Resort has volcano views.' },
    ],
    images: [{ src: 'https://images.unsplash.com/photo-1551241884-425dfddb364b?w=800&q=80', alt: 'Zip-liner flying over forest canopy' }],
    bookingNotes: 'Weight limits apply. Closed-toe shoes required. Courses with ocean views (Diamante) are the most scenic — worth the extra drive.',
  },
  {
    slug: 'sport-fishing-guanacaste',
    title: 'Deep Sea Sport Fishing — Guanacaste (Papagayo / Flamingo)',
    category: 'beach-water',
    tags: ['sport-fishing', 'charter', 'private', 'marlin', 'sailfish', 'tuna', 'dorado', 'papagayo', 'flamingo'],
    towns: ['Papagayo', 'Flamingo', 'Tamarindo'],
    description: 'Guanacaste\'s Pacific coast is world-class sport fishing territory — sailfish, marlin, tuna, dorado, and roosterfish patrol the waters off Papagayo and Flamingo. Book a private charter on a 29ft sport fisher with a local captain who knows the seasonal runs.',
    duration: 'Full day (7–8 hours)',
    priceFrom: 850,
    priceNote: 'per private charter (up to 6, all gear)',
    difficulty: 'moderate',
    rating: 4.7,
    reviewCount: 36,
    affiliateUrl: 'https://www.getyourguide.com/flamingo-l170810/fishing-tours-c169/sport-fishing-charter-t49/sku2901234/',
    affiliateLabel: 'Check availability & book on GetYourGuide',
    freeCancellation: true,
    whatIncluded: ['29ft sport fisher with twin outboards', 'Captain', 'All fishing gear', 'Water + snacks', 'Photography + dockside photos'],
    whatToBring: ['Sunglasses (polarized)', 'Hat + sunscreen', 'Motion sickness meds (green season)', 'Camera', 'Costa Rica sport fishing license (if keeping catch)'],
    faq: [
      { question: 'What fish can we expect?', answer: 'Sailfish, marlin, tuna, dorado (mahi-mahi), roosterfish, wahoo, and snapper depending on season and grounds. The captain chooses coordinates based on the target and current reports.' },
      { question: 'Do we have to keep the fish?', answer: 'No — most billfish are catch-and-release. If you want to keep fillets of tuna or dorado, confirm with the captain upfront and arrange a license.' },
    ],
    images: [{ src: 'https://images.unsplash.com/photo-1544551763-46a013bb70d1?w=800&q=80', alt: 'Sailfish caught on charter off Papagayo' }],
    bookingNotes: 'Bring your own license if you plan to keep fish. Most charters are catch-and-release for billfish. Private charter = you set the target and pace.',
  },
  {
    slug: 'horseback-riding-guanacaste',
    title: 'Horseback Riding in Guanacaste — Beach, Jungle & Volcano Views',
    category: 'adventure',
    tags: ['horseback', 'horse-riding', 'beach', 'jungle', 'volcano-views', 'blue-river', 'guachipelin'],
    towns: ['Tamarindo', 'Rincón de la Vieja', 'Papagayo'],
    description: 'Horseback riding through Guanacaste\'s dry forest, along the beach at sunrise or sunset, or with views of the Rincón de la Vieja volcano — tours range from gentle beach rides to multi-activity combos (horseback + zip-line + spa).',
    duration: '1.5–3 hours (varies by tour)',
    priceFrom: 67,
    priceNote: 'per adult (combo tours higher)',
    difficulty: 'easy',
    rating: 4.7,
    reviewCount: 156,
    affiliateUrl: 'https://www.getyourguide.com/guanacaste-l170254/horse-riding-tours-c155/horseback-riding-tours-c49/sku1005802/',
    affiliateLabel: 'Check availability & book on GetYourGuide — compare all rides',
    freeCancellation: true,
    whatIncluded: ['Horse + tack', 'Guide', 'Safety briefing', 'Photos (varies — confirm)'],
    whatToBring: ['Long pants', 'Closed-toe shoes or boots', 'Sunscreen', 'Water', 'Camera', 'Change of clothes (if riding in heat/sun)'],
    faq: [
      { question: 'Is horseback riding safe for beginners?', answer: 'Yes — the standard beach and forest rides from reputable operators are designed for beginners. Guides brief you, match you to a calm horse, and lead the group.' },
      { question: 'What should I wear?', answer: 'Long pants (jeans or riding pants) to prevent chafing, closed-toe shoes or boots, and sunscreen. Avoid shorts and flip-flops on rides.' },
      { question: 'Are the horses well cared for?', answer: 'Reputable operators (Blue River Resort, Hacienda Guachipelin, Jacamar) maintain their horses to high standards. Look for ICT-certified operators and read recent reviews on horse care.' },
    ],
    images: [{ src: 'https://images.unsplash.com/photo-1599594327085-50c0d5c1e1b5?w=800&q=80', alt: 'Horse and rider on the beach at sunrise' }],
    bookingNotes: 'Tell the operator your experience level. Long pants required. Combo tours (horseback + zip-line, horseback + spa) often give more value.',
  },
  {
    slug: 'liberia-town-tour',
    title: 'Liberia Historic Town Tour — Costa Rica\'s "White City"',
    category: 'culture-daytrip',
    tags: ['liberia', 'town-tour', 'history', 'culture', 'day-trip', 'guanacaste'],
    towns: ['Liberia'],
    description: 'Liberia is Guanacaste\'s capital and one of Costa Rica\'s oldest cities — founded in 1824, known as the "White City" for its colonial architecture. A walking tour covers the Parque Central, the Catedral de San Nicolás, the Museo de la Historia, and the local food markets.',
    duration: '2–3 hours (walking tour)',
    priceFrom: 35,
    priceNote: 'per person (private guide, varies)',
    difficulty: 'easy',
    rating: 4.5,
    reviewCount: 28,
    affiliateUrl: 'https://www.getyourguide.com/liberia-l170255/historical-sightseeing-tours-c30/liberia-historic-town-tour-t49/sku1005803/',
    affiliateLabel: 'Check availability & book on GetYourGuide',
    freeCancellation: true,
    whatIncluded: ['Private or small-group guide', 'Museo de la Historia entrance (typically small fee)'],
    whatToBring: ['Water', 'Sunscreen + hat', 'Comfortable walking shoes', 'Cash for small entrance fees + market snacks'],
    faq: [
      { question: 'How long is the tour?', answer: 'Most walking tours are 2–3 hours. You can do a quick 1-hour highlights walk or a more in-depth 3-hour tour with the museum and market.' },
      { question: 'Is Liberia worth visiting?', answer: 'If you\'re in Guanacaste for a few days, Liberia is worth a half-day — it\'s the cultural heart of the province, and it\'s a good place to pick up supplies, eat local food, and get a sense of Costa Rican history before heading to the coast.' },
    ],
    images: [{ src: 'https://images.unsplash.com/photo-1589985261513-84652?w=800&q=80', alt: 'Parque Central in Liberia with cathedral' }],
    bookingNotes: 'Most sights are walkable from Parque Central. Museo de la Historia often closed Mondays.',
  },
  {
    slug: 'nicaragua-day-trip',
    title: 'Nicaragua Day Trip from Guanacaste — Granada & San Juan del Sur',
    category: 'culture-daytrip',
    tags: ['nicaragua', 'day-trip', 'granada', 'san-juan-del-sur', 'cross-border', 'culture'],
    towns: ['Liberia', 'Tamarindo'],
    description: 'Cross the border from Guanacaste into Nicaragua for a day — most tours depart from Liberia and take you to Granada (colonial architecture, Parque Central, chocolate tour) and/or San Juan del Sur (Pacific beach town, surf, sunsets). Long day (10–12 hours) but a lot of ground covered.',
    duration: 'Full day (10–12 hours)',
    priceFrom: 180,
    priceNote: 'per person (group tour, varies by inclusions)',
    difficulty: 'easy',
    rating: 4.4,
    reviewCount: 67,
    affiliateUrl: 'https://www.getyourguide.com/liberia-l170255/day-trips-c88/nicaragua-day-trip-granada-san-juan-del-sur-t49/sku1005804/',
    affiliateLabel: 'Check availability & book on GetYourGuide',
    freeCancellation: true,
    whatIncluded: ['Round-trip transport from Liberia', 'Border assistance', 'Guide (varies)', 'Some meals (lunch typically included)'],
    whatToBring: ['Valid passport', 'Cash (USD + Córdoba)', 'Sunscreen + hat', 'Water + snacks', 'Camera', 'Motion sickness meds'],
    faq: [
      { question: 'Do I need a visa for Nicaragua?', answer: 'For most nationalities, no visa is required for short tourist stays, but entry requirements (passport validity, reciprocity fees) change. Check the current rules before booking.' },
      { question: 'How long is the day?', answer: '10–12 hours including border crossing and return. It\'s a full day — start early and come back late.' },
    ],
    images: [{ src: 'https://images.unsplash.com/photo-1589985261513-84652?w=800&q=80', alt: 'Colonial streets of Granada, Nicaragua' }],
    bookingNotes: 'Confirm current border requirements before booking. Morning departure is early — pack snacks and water. Don\'t schedule a tight return flight the same day.',
  },
  {
    slug: 'guanacaste-adventure-week',
    title: 'Guanacaste Adventure Week — 7-Day Itinerary',
    category: 'multi-day',
    tags: ['multi-day', 'itinerary', 'guanacaste', 'adventure', 'beach', 'volcano', 'wildlife'],
    towns: ['Tamarindo', 'Liberia', 'Rincón de la Vieja', 'Papagayo'],
    description: 'The ultimate Guanacaste adventure week — a hand-picked sequence of the province\'s best activities, arranged so you never waste a day on travel or duplicates. Zip-line through dry forest, surf or relax on the best beaches, hike the volcano and soak in hot springs, and finish with a sunset catamaran.',
    duration: '7 days',
    priceFrom: 1200,
    priceNote: 'per person (estimate, excluding accommodation)',
    difficulty: 'moderate',
    rating: 4.9,
    reviewCount: 19,
    affiliateUrl: 'https://www.getyourguide.com/guanacaste-l170254/multi-day-tours-c94/guanacaste-adventure-week-t49/sku1005805/',
    affiliateLabel: 'Check each day\'s activities on GetYourGuide',
    freeCancellation: true,
    whatIncluded: ['Suggested itinerary + booking links for each activity', 'Transport recommendations', 'Daily timing and logistics'],
    whatToBring: ['Full packing list for Guanacaste', 'Activity-specific gear', 'Passport + license (if renting car)'],
    faq: [
      { question: 'Is this a packaged tour or a suggested itinerary?', answer: 'This is a suggested itinerary — you book each day\'s activity individually using the links. This gives you flexibility on timing, pace, and budget.' },
      { question: 'Where should I stay?', answer: 'Base in Tamarindo for Days 1–3 and 5–6. Move to a volcano-area hotel for Day 4. Liberia is a good single base if you don\'t want to move hotels.' },
    ],
    images: [{ src: 'https://images.unsplash.com/photo-1591756413813-37aed080bbc4?w=800&q=80', alt: 'Zip-line flying over Guanacaste dry forest' }],
    bookingNotes: 'Book each day\'s activity 2–3 days ahead in dry season. The catamaran and ATV tours have the longest advance-booking windows — book those first.',
  },
]

// ---------------------------------------------------------------------------
// Categories + affiliate info
// ---------------------------------------------------------------------------

export const CATEGORIES: Record<string, string> = {
  'beach-water': 'Beach & Water',
  'wildlife-nature': 'Wildlife & Nature',
  adventure: 'Adventure & Adrenaline',
  'culture-daytrip': 'Culture & Day Trips',
  'multi-day': 'Multi-Day Packages',
}

export const CATEGORY_LABELS = CATEGORIES

export type TourCategory = keyof typeof CATEGORIES

export const CATEGORY_ICONS: Record<string, string> = {
  'beach-water': 'sunny',
  'wildlife-nature': 'leaf',
  adventure: 'flash',
  'culture-daytrip': 'camera',
  'multi-day': 'calendar',
}

export const AFFILIATE_PROGRAMS: Record<string, { name: string; commission: number; cookieDays: number }> = {
  getyourguide: { name: 'GetYourGuide', commission: 0.08, cookieDays: 31 },
  viator: { name: 'Viator', commission: 0.08, cookieDays: 30 },
  bookingcom: { name: 'Booking.com', commission: 0.25, cookieDays: 0 },
  discovercars: { name: 'Discover Cars', commission: 0.07, cookieDays: 30 },
  airalo: { name: 'Airalo eSIM', commission: 0.20, cookieDays: 30 },
  expedia: { name: 'Expedia', commission: 0.06, cookieDays: 30 },
}

export const AFFILIATE_LABELS: Record<string, string> = {
  getyourguide: 'GetYourGuide',
  viator: 'Viator',
  bookingcom: 'Booking.com',
  discovercars: 'Discover Cars',
  airalo: 'Airalo eSIM',
  expedia: 'Expedia',
}

export type AffiliateProgram = keyof typeof AFFILIATE_PROGRAMS

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

export function getTourBySlug(slug: string): Tour | undefined {
  return TOURS.find((t) => t.slug === slug)
}

export function getToursByCategory(category: string): Tour[] {
  return TOURS.filter((t) => t.category === category)
}

export function getToursByTown(town: string): Tour[] {
  return TOURS.filter((t) => t.towns.includes(town))
}

export function searchTours(query: string): Tour[] {
  if (!query.trim()) return TOURS
  const q = query.toLowerCase()
  return TOURS.filter(
    (t) =>
      t.title.toLowerCase().includes(q) ||
      t.description.toLowerCase().includes(q) ||
      t.tags.some((tag) => tag.toLowerCase().includes(q)) ||
      t.towns.some((town) => town.toLowerCase().includes(q)),
  )
}
