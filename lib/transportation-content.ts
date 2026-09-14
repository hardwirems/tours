// Original editorial content for the transportation section. Kept separate from
// the Viator-sourced product data (lib/transportation-data.ts) so page copy is
// hand-written, traveler-first, and honest about what is and isn't bookable.

export interface RouteContent {
  slug: string;               // /transportation/airport-transfers/lir/<slug>/
  name: string;               // "Tamarindo, Langosta & Playa Grande"
  short: string;              // "Tamarindo"
  driveFromLIR: string;       // approximate, clearly hedged
  destSlug?: string;          // matching /destinations/<slug>/ for internal linking
  title: string;              // <title>
  description: string;        // meta description
  h1: string;
  intro: string[];            // paragraphs
  tips: string[];             // bullet guidance
}

// Route pages exist only where verified inventory + original guidance justify them.
export const ROUTES: RouteContent[] = [
  {
    slug: 'tamarindo', name: 'Tamarindo, Langosta & Playa Grande', short: 'Tamarindo',
    driveFromLIR: 'about 1 hour to 1 hour 15 minutes', destSlug: 'tamarindo',
    title: 'LIR to Tamarindo Transfer — Liberia Airport to Tamarindo',
    description: 'Private airport transfers from Liberia (LIR) to Tamarindo, Langosta and Playa Grande. Verified Viator options, drive-time expectations and pickup tips.',
    h1: 'Liberia Airport (LIR) to Tamarindo transfers',
    intro: [
      'Tamarindo is one of the most popular bases in Guanacaste, and Liberia International Airport (LIR) is the practical gateway — the drive is **{drive}** depending on traffic and your exact hotel. San José (SJO) is on the far side of the country and adds four to five hours of driving, so most Tamarindo-bound travelers fly into LIR.',
      'The options below are private, door-to-door transfers booked through Viator. A private transfer means the vehicle is yours — useful after a long flight, with children, or if your arrival time is unpredictable. Pricing, availability and cancellation terms are confirmed on Viator at checkout.',
    ],
    tips: [
      'Have your hotel or villa name and address ready — drivers meet you in the arrivals area with a sign.',
      'The last stretch to some Tamarindo-area villas is unpaved; a standard vehicle is fine for the town itself.',
      'Travelling with small children? Ask the operator about car seats when you book — availability varies.',
    ],
  },
  {
    slug: 'papagayo-coco', name: 'Papagayo, Playas del Coco, Hermosa & Ocotal', short: 'Papagayo & Coco',
    driveFromLIR: 'roughly 25 to 40 minutes', destSlug: 'playa-hermosa',
    title: 'LIR to Papagayo & Playas del Coco Transfer — Liberia Airport',
    description: 'Private transfers from Liberia Airport (LIR) to the Gulf of Papagayo, Playas del Coco, Playa Hermosa and Ocotal. Verified Viator options and pickup guidance.',
    h1: 'Liberia Airport (LIR) to Papagayo & Playas del Coco',
    intro: [
      'The Gulf of Papagayo and the Coco/Hermosa area are the closest beach zones to Liberia Airport — usually **{drive}** by road, which makes them an easy first or last night of a trip. Many of the large resorts here (in the Papagayo peninsula and around Playas del Coco) are served by private transfers.',
      'All options below are private, door-to-door transfers booked and paid on Viator. Because the drive is short, this is one of the most straightforward transfers in the region.',
    ],
    tips: [
      'Resort names inside the Papagayo peninsula can be similar — confirm the exact resort at booking.',
      'This short hop is a good candidate for a private transfer even on a budget, since the distance keeps costs down.',
    ],
  },
  {
    slug: 'flamingo-conchal', name: 'Flamingo, Potrero, Brasilito & Conchal', short: 'Flamingo & Conchal',
    driveFromLIR: 'about 1 hour to 1 hour 15 minutes', destSlug: 'playa-flamingo',
    title: 'LIR to Flamingo & Conchal Transfer — Liberia Airport',
    description: 'Private transfers from Liberia Airport (LIR) to Playa Flamingo, Potrero, Brasilito and Playa Conchal. Verified Viator options, drive time and tips.',
    h1: 'Liberia Airport (LIR) to Flamingo & Conchal',
    intro: [
      'Playa Flamingo, neighbouring Potrero, Brasilito and the Westin/Reserva Conchal area sit north of Tamarindo along the same coast — usually **{drive}** from Liberia Airport. It is a calm, resort-and-marina stretch that pairs well with a private door-to-door transfer.',
      'The transfers below are private and booked through Viator. If you are staying at a specific resort (for example the Westin Playa Conchal), look for the option that names it, or use a flexible "to your selected location" transfer.',
    ],
    tips: [
      'Some listings name a specific resort (Westin Playa Conchal, RIU) — those confirm the drop-off up front.',
      'Roads in this area are mostly paved; the final approach to a few villas can be gravel.',
    ],
  },
  {
    slug: 'la-fortuna', name: 'La Fortuna & Arenal', short: 'La Fortuna',
    driveFromLIR: 'roughly 2 hours 45 minutes to 3 hours 30 minutes',
    title: 'LIR to La Fortuna Transfer — Liberia Airport to Arenal',
    description: 'Private transfers from Liberia Airport (LIR) to La Fortuna and Arenal Volcano. Verified Viator options and honest drive-time expectations for the longer route.',
    h1: 'Liberia Airport (LIR) to La Fortuna & Arenal',
    intro: [
      'La Fortuna, at the base of Arenal Volcano, is a common add-on to a Guanacaste beach trip. It is not on the coast — expect **{drive}** of driving from Liberia Airport, so a private transfer with a professional driver is the comfortable way to cover it.',
      'The options below are private transfers booked through Viator. This is a longer journey than the beach routes, so confirm the pickup time, number of passengers and luggage allowance when you book.',
    ],
    tips: [
      'It is a scenic but winding mountain drive near Arenal — build in a rest stop if anyone is prone to motion sickness.',
      'If you are continuing to the coast afterward, look for round-trip or multi-leg options rather than booking two one-ways.',
    ],
  },
];

// Local-transport rental categories. Only "golf-cart" has a single qualifying
// Viator listing; the rest have no bookable Viator inventory and are prepared as
// NOINDEX informational drafts (not linked in nav, excluded from the sitemap).
export interface GapCategory {
  slug: string; name: string; title: string; description: string; h1: string;
  viatorStatus: string;             // honest one-liner
  intro: string[];
  whatToKnow: string[];             // safety / licensing / deposit / insurance
  hasQualifyingInventory: boolean;  // true only for golf-cart
}

export const LOCAL_CATEGORIES: GapCategory[] = [
  {
    slug: 'golf-cart-rentals', name: 'Golf-cart rentals', hasQualifyingInventory: true,
    title: 'Golf-Cart Rentals in Guanacaste — Tamarindo & Nearby',
    description: 'Golf-cart rentals for getting around beach towns like Tamarindo. What to know about licensing, roads and deposits, plus a verified Viator listing.',
    h1: 'Golf-cart rentals in Guanacaste',
    viatorStatus: 'One qualifying golf-cart rental is currently bookable through Viator (Tamarindo area).',
    intro: [
      'In flat, walkable beach towns like Tamarindo, a golf cart is a fun, low-speed way to reach the beach, restaurants and your villa without a full-size rental car. It is not a substitute for a car on highways or long drives.',
    ],
    whatToKnow: [
      'You typically need a valid driver’s licence; carts are road-legal only on certain local streets, not highways.',
      'Expect a security deposit (often held on a credit card) and a signed rental agreement.',
      'Confirm insurance/liability terms and fuel or charging responsibilities before you drive off.',
      'Golf carts have no doors or crash protection — drive slowly, especially with children.',
    ],
  },
  {
    slug: 'e-bike-rentals', name: 'E-bike rentals', hasQualifyingInventory: false,
    title: 'E-Bike Rentals in Guanacaste — What to Know',
    description: 'Electric-bike rentals in Guanacaste: what they suit, safety and road considerations, and current booking reality. Informational guide.',
    h1: 'E-bike rentals in Guanacaste',
    viatorStatus: 'We could not verify any qualifying e-bike rental bookable through our Viator partnership at this time.',
    intro: [
      'E-bikes are a pleasant way to explore flat beach towns and nearby trails. Availability is mostly through small local shops rather than large booking platforms, so we don’t currently have a bookable e-bike option we can stand behind.',
    ],
    whatToKnow: [
      'Wear a helmet; many roads are shared with cars and have no dedicated bike lane.',
      'Check the battery range against your planned distance and the local heat.',
      'Rentals usually require a deposit and ID; confirm insurance and damage terms locally.',
    ],
  },
  {
    slug: 'scooter-rentals', name: 'Scooter & moped rentals', hasQualifyingInventory: false,
    title: 'Scooter & Moped Rentals in Guanacaste — What to Know',
    description: 'Scooter and moped rentals in Guanacaste: licensing, helmet law, road safety and current booking reality. Informational guide.',
    h1: 'Scooter & moped rentals in Guanacaste',
    viatorStatus: 'We could not verify a scooter rental that meets our quality bar through our Viator partnership right now (limited inventory exists but below our review threshold).',
    intro: [
      'Scooters and mopeds are popular in towns like Tamarindo, but they carry real risk on unfamiliar, sometimes unpaved roads. We only feature rentals we can verify, and current options don’t clear our quality bar.',
    ],
    whatToKnow: [
      'Costa Rica requires a valid motorcycle/driver’s licence appropriate to the vehicle; helmets are mandatory.',
      'Roads can be gravel, wet or busy — riders should be experienced.',
      'Expect a deposit and to sign a liability/insurance agreement; confirm what damage you are responsible for.',
    ],
  },
  {
    slug: 'atv-rentals', name: 'ATV rentals', hasQualifyingInventory: false,
    title: 'ATV Rentals vs. Guided ATV Tours in Guanacaste',
    description: 'The difference between renting an ATV and booking a guided ATV tour in Guanacaste, and what’s actually bookable. Informational guide.',
    h1: 'ATV rentals in Guanacaste',
    viatorStatus: 'Viator carries guided ATV tours (with a guide and set route), not self-drive ATV rentals. We don’t misclassify one as the other.',
    intro: [
      'It is easy to confuse the two: a guided ATV **tour** includes a guide, equipment and a planned route, while an ATV **rental** hands you the keys to explore on your own. Our partnership carries excellent guided ATV tours — see the adventure tours — but not self-drive ATV rentals.',
    ],
    whatToKnow: [
      'A guided tour is usually the safer, simpler option for visitors unfamiliar with the terrain.',
      'Self-drive rentals, where available locally, require a licence, deposit and a liability waiver.',
      'ATVs are powerful — helmets and closed shoes are essential, and children may be restricted.',
    ],
  },
  {
    slug: 'side-by-side-rentals', name: 'Side-by-side / UTV rentals', hasQualifyingInventory: false,
    title: 'Side-by-Side / UTV Rentals vs. Guided Tours in Guanacaste',
    description: 'Side-by-side (UTV) rentals versus guided UTV tours in Guanacaste, and what’s bookable through our partners. Informational guide.',
    h1: 'Side-by-side (UTV) rentals in Guanacaste',
    viatorStatus: 'As with ATVs, Viator carries guided UTV/side-by-side tours, not self-drive rentals. We keep the distinction clear.',
    intro: [
      'Side-by-sides (UTVs) seat two or more and are popular for beach-and-mountain adventures. Our partnership includes guided UTV tours; it does not include self-drive UTV rentals, and we won’t label a guided excursion as a rental.',
    ],
    whatToKnow: [
      'Guided UTV tours include a route, safety briefing and equipment.',
      'Local self-drive rentals require a licence, a deposit and an insurance/liability agreement.',
      'Confirm passenger limits and child policies — UTVs vary widely.',
    ],
  },
  {
    slug: 'rental-cars', name: 'Rental cars', hasQualifyingInventory: false,
    title: 'Rental Cars in Guanacaste — Why We Don’t Sell Them (Yet)',
    description: 'Honest guidance on renting a car in Guanacaste: when it’s worth it, 4x4 and insurance considerations, and why we point you elsewhere for now.',
    h1: 'Rental cars in Guanacaste',
    viatorStatus: 'Traditional car rental is not part of the Viator marketplace, so we don’t offer it here — we won’t fabricate listings.',
    intro: [
      'A rental car earns its cost when you plan to move between beaches or reach places public transport serves poorly. Car rental isn’t sold through our Viator partnership, so rather than show you nothing useful, here is honest guidance — and our full write-up in the getting-around guide.',
    ],
    whatToKnow: [
      'Many beach and peninsula roads are unpaved; a higher-clearance vehicle (often 4x4) is wise, especially in the green season.',
      'Mandatory local liability insurance is added at the counter — factor it into quoted prices.',
      'A credit card hold for the deposit is standard; read the fuel and damage policy carefully.',
      'Drive in daylight where you can — unlit roads, animals and pedestrians make night driving harder.',
    ],
  },
];

export const DISCLOSURE =
  'Guanacaste Experiences is an independent guide and may earn a commission when you book through our links, at no extra cost to you. Booking and payment take place on Viator; Viator and the listed operator control availability, pricing, cancellation and fulfilment. We do not operate these vehicles or transfers.';

export const LIR_FAQ = [
  { q: 'Which airport should I use for Guanacaste — LIR or SJO?', a: 'For almost every Guanacaste beach, Liberia (LIR) is the practical choice — it is far closer than San José (SJO), which adds four to five hours of driving. Choose SJO only if your trip also centres on the Central Valley or the Caribbean side.' },
  { q: 'Are these private or shared transfers?', a: 'The transfers we list for Guanacaste are private, door-to-door services — the vehicle is yours. We only label a transfer "shared" when the operator verifies it, and shared inventory for these routes is currently limited.' },
  { q: 'What happens if my flight is late?', a: 'Private-transfer operators typically track your flight and adjust pickup for delays, but policies differ. Confirm the operator’s late-arrival and wait-time policy on Viator before booking.' },
  { q: 'Can I get a car seat for my child?', a: 'Some operators provide car seats on request, sometimes for a fee, but it is never guaranteed. Ask at the time of booking and reconfirm — never assume a seat will be available.' },
  { q: 'How far in advance should I book?', a: 'Book your airport transfer before you travel, especially for arrival day and during the busy December–April season, so a driver is confirmed and waiting when you land.' },
];
