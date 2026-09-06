import { Tour, TourCategory, CATEGORY_LABELS, TOURS } from '../lib/tours'

// ---------------------------------------------------------------------------
// Programmatic SEO page definitions.
// Each entry generates a static page at a predictable URL targeting a specific
// long-tail search query. The page content is assembled from the tour data.
//
// URL pattern: /seo/[type]/[...slug]
//   e.g. /seo/best/zip-lining-guanacaste
//        /seo/cost/zip-lining-cost-guanacaste-2026
//        /seo/town/tamarindo
//        /seo/season/january
//        /seo/audience/families
//        /seo/compare/zip-lining-vs-atv
//        /seo/guide/rincon-de-la-vieja
//
// In production, these are pre-rendered at build time (SSG) and included in
// the sitemap. Each page is real, useful content — not thin affiliate stubs.
// ---------------------------------------------------------------------------

export interface SeOPage {
  type: SeoPageType
  slug: string                    // URL slug after /seo/[type]/
  title: string                   // <title>
  description: string             // meta description (150–160 chars)
  h1: string                      // on-page H1
  targetKeyword: string           // primary keyword this page targets
  relatedKeywords: string[]       // secondary keywords (for context + internal links)
  category: TourCategory | 'mixed'
  canonical: string               // canonical URL
  ogImage?: string

  // Content builders — these assemble the page from tour data.
  intro: (lang: 'en' | 'es') => string       // opening paragraph
  body: (lang: 'en' | 'es') => SeoPageBody
  faq: (lang: 'en' | 'es') => SeoPageFAQ[]
  internalLinks: (lang: 'en' | 'es') => SeoInternalLink[]
  affiliateCallouts?: SeoAffiliateCallout[]
}

export type SeoPageType =
  | 'best'           // "Best X in Guanacaste" roundup
  | 'cost'           // "How much does X cost in Guanacaste 2026"
  | 'town'           // "Things to do in [town]"
  | 'season'         // "Best tours in Guanacaste in [month]"
  | 'audience'       // "Best tours in Guanacaste for [audience]"
  | 'compare'        // "X vs Y in Guanacaste"
  | 'guide'          // Deep-dive guide on a specific tour/area
  | 'vs'             // Review-style: "Is X worth it?"

export interface SeoPageBody {
  sections: SeoSection[]
  comparisonTable?: SeoComparisonRow[]   // for 'best' and 'compare' pages
  featuredTours?: string[]               // tour slugs to feature (call-to-action)
}

export interface SeoSection {
  heading: string
  body: string
  listItems?: string[]
  image?: string | { src: string; alt: string; caption?: string }
}

export interface SeoComparisonRow {
  label: string
  tours: Record<string, string>         // tour slug → value
}

export interface SeoPageFAQ {
  question: string
  answer: string
}

export interface SeoInternalLink {
  text: string
  url: string
  context?: string
}

export interface SeoAffiliateCallout {
  label: string                          // e.g. "Check availability on GetYourGuide"
  tours: string[]                        // tour slugs
  program: string                        // affiliate program key
  position: 'intro' | 'mid' | 'end'
}

// ---------------------------------------------------------------------------
// Helper: get tours for a category
// ---------------------------------------------------------------------------

function toursInCategory(category: TourCategory): Tour[] {
  return TOURS.filter((t) => t.category === category).sort((a, b) => b.rating! - a.rating!)
}

function toursByTown(town: string): Tour[] {
  return TOURS.filter((t) => t.towns.includes(town)).sort((a, b) => b.rating! - a.rating!)
}

function findTour(slug: string): Tour | undefined {
  return TOURS.find((t) => t.slug === slug)
}

// ---------------------------------------------------------------------------
// The full list of programmatic SEO pages.
// Add more as you research new keywords — the pattern scales.
// ---------------------------------------------------------------------------

const SEO_PAGES: SeOPage[] = [
  // ─── "Best X in Guanacaste" roundups ──────────────────────────────────────

  {
    type: 'best',
    slug: 'zip-lining-guanacaste',
    title: 'Best Zip-lining in Guanacaste — Top Canopy Tours 2026',
    description: 'Compare the best zip-line courses in Guanacaste, Costa Rica — Diamante, Blue River, Hacienda Guachipelin, and more. Real prices, real reviews, which course has the best views.',
    h1: 'The Best Zip-lining in Guanacaste: 2026 Comparison',
    targetKeyword: 'best zip lining guanacaste',
    relatedKeywords: ['zip line guanacaste', 'best canopy tours guanacaste', 'diamante eco adventure park zip line', 'zip lining near liberia costa rica'],
    category: 'adventure',
    canonical: 'https://guanacaste.tours/seo/best/zip-lining-guanacaste',
    ogImage: '/images/og-best-zipline.jpg',

    intro: () =>
      'Guanacaste has some of the most scenic zip-line courses in Costa Rica — flying through dry forest canopy over rivers, volcanoes, and (at Diamante) the Pacific Ocean. This guide compares the top courses so you can pick the one that matches what you want to see.',

    body: () => ({
      sections: [
        {
          heading: 'How to choose a zip-line course in Guanacaste',
          body: 'Not all canopy tours are the same. The right choice depends on what you want to see, who you\'re with, and how much adventure you want. Here\'s what to weigh:',
          listItems: [
            'Views: Diamante offers the only dual-cable ocean-view zip-line in Costa Rica — you fly over the Pacific coastline. Other courses offer forest and volcano views.',
            'Length: Courses range from 4–9 cables (short) to full circuits with 7+ lines, Tarzan swings, and rappels.',
            'Difficulty: Most courses are suitable for beginners with a safety briefing. Advanced riders can ask about longer, faster lines.',
            'What\'s included: Some courses are zip-line-only; others are part of a combo (zip-line + horseback + spa, zip-line + ATV). Combos often give better value.',
            'Age & weight: Minimum weight ~60 lbs (27 kg) for short lines, ~85 lbs (40 kg) for full circuits. Maximum ~250 lbs (113 kg). Minimum age typically 6–10.',
          ],
        },
        {
          heading: 'The top zip-line courses in Guanacaste',
          body: 'Here are the highest-rated and most popular zip-line experiences in the province, based on recent traveler reviews and what each course offers.',
        },
        {
          heading: 'Diamante Eco Adventure Park — the ocean-view dual cable',
          body: 'Diamante, near Playa Hermosa, runs Guanacaste\'s most scenic zip-line course — and the only one with a dual-cable ocean-view line where you fly side-by-side over the Pacific. The full Adventure Pass also includes the animal sanctuary (sloths, monkeys, jaguars, toucans, pumas, crocodiles, snakes), botanical garden, and hammock beach.',
          listItems: [
            'Price from: $78/adult (zip-line only), $93+ for the full Adventure Pass.',
            'Duration: ~1 hour on the zip-line course; full day if you do the full park.',
            'Rating: consistently among the highest-rated in the region.',
            'Best for: travelers who want the most dramatic views + a full day of activities.',
          ],
          image: { src: '/images/diamante-zipline.jpg', alt: 'Dual-cable ocean-view zip line at Diamante Eco Adventure Park', caption: 'Diamante\'s dual-cable line — the only ocean-view zip-line in Costa Rica.' },
        },
        {
          heading: 'Hacienda Guachipelin — canyon views + a full adventure',
          body: 'Hacienda Guachipelin, near the Rincón de la Vieja area, offers a Canyon Canopy Tour with 7 zip-line cables, 1 hanging bridge, 2 Tarzan swings, a controlled 65ft rappel, a natural rock climbing wall, and via ferrata. The combo (zip-line + horseback + river tubing) is a full-day adventure.',
          listItems: [
            'Price from: $93/adult for the Adventure Pass (zip-line + horseback + river tubing).',
            'Duration: ~2 hours on the zip-line course; full day for the combo.',
            'Best for: travelers who want a multi-activity day and canyon/forest views.',
          ],
        },
        {
          heading: 'Blue River Resort — zip-line reached by horseback',
          body: 'Blue River Resort, on the slopes of the Rincón de la Vieja volcano, offers a unique combination: you ride a horse to the zip-line course, then fly through 9 cables and 1 Tarzan swing through the jungle with views of waterfalls and wildlife. The longest cable is over 1,968 ft (600m).',
          listItems: [
            'Price from: $67/adult, $53/kid.',
            'Duration: ~1 hour on the zip-line course.',
            'Best for: travelers who want a scenic approach (horseback) + volcano views.',
          ],
        },
        {
          heading: 'Jacamar — canopy tours in Papagayo and around the volcano',
          body: 'Jacamar, near the Papagayo peninsula and Hotel Borinquen, offers canopy tours in the dry forest, plus combo days (zip-line + horseback + ATV + hot springs). The dry forest canopy is a different experience from the lush jungle courses — more open, with wide views.',
          listItems: [
            'Price from: $128/adult for the Canopy Tour Papagayo (half day).',
            'Best for: travelers based in Papagayo/Rincón de la Vieja who want a shorter, focused canopy experience.',
          ],
        },
      ],
      comparisonTable: [
        { label: 'Course', tours: { 'diamante-eco': 'Diamante Eco Adventure Park', 'hacienda-guachipelin': 'Hacienda Guachipelin', 'blue-river': 'Blue River Resort', 'jacamar-papagayo': 'Jacamar (Papagayo)' } },
        { label: 'Price from (USD)', tours: { 'diamante-eco': '$78 (zipline) / $93+ (full pass)', 'hacienda-guachipelin': '$93 (adventure pass)', 'blue-river': '$67/adult', 'jacamar-papagayo': '$128 (half day)' } },
        { label: 'Duration', tours: { 'diamante-eco': '~1hr zipline / full day park', 'hacienda-guachipelin': '~2hr zipline / full day combo', 'blue-river': '~1hr', 'jacamar-papagayo': '~half day' } },
        { label: 'Cable count', tours: { 'diamante-eco': '4 cables + Quick Jump + Superman', 'hacienda-guachipelin': '7 cables + bridge + 2 Tarzan swings + rappel', 'blue-river': '9 cables + 1 Tarzan swing', 'jacamar-papagayo': 'multiple' } },
        { label: 'Signature view', tours: { 'diamante-eco': 'Pacific Ocean (dual-cable)', 'hacienda-guachipelin': 'Canyon/forest', 'blue-river': 'Volcano + waterfalls', 'jacamar-papagayo': 'Dry forest canopy' } },
        { label: 'Min age', tours: { 'diamante-eco': '6+ (short), 10+ (full)', 'hacienda-guachipelin': '7+', 'blue-river': '7+', 'jacamar-papagayo': '7+' } },
      ],
      featuredTours: ['zip-lining-guanacaste'],
    }),

    faq: () => [
      { question: 'Which zip-line in Guanacaste has the best views?', answer: 'Diamante Eco Adventure Park offers the only dual-cable ocean-view zip-line in Costa Rica — you fly side-by-side over the Pacific. If you prefer volcano and waterfall views, Blue River Resort is the top pick.' },
      { question: 'Is zip-lining safe in Costa Rica?', answer: 'Yes, when you choose a reputable, ICT-certified operator. The courses listed here (Diamante, Hacienda Guachipelin, Blue River, Jacamar) all have strong safety records and certified guides. Always check that the operator uses double-cable systems and redundant harness clips.' },
      { question: 'What is the minimum age and weight?', answer: 'Most courses require a minimum weight of ~60 lbs (27 kg) for short lines and ~85 lbs (40 kg) for the full circuit. Maximum weight is typically ~250 lbs (113 kg). Minimum age is usually 6–10 depending on the course.' },
      { question: 'Can I do zip-lining if I\'m afraid of heights?', answer: 'Yes — most people ease in on the first short line. Guides are experienced with nervous first-timers and let you control the pace. If you prefer not to fly, many courses offer alternative activities (hanging bridges, garden walks).' },
      { question: 'Are combo tours worth it?', answer: 'Often yes. The Hacienda Guachipelin Adventure Pass (zip-line + horseback + river tubing) and Blue River\'s horseback-to-zipline combo give more value than a zip-line-only booking, especially if you\'d do those activities separately anyway.' },
    ],

    internalLinks: () => [
      { text: 'Full list of zip-line tours in Guanacaste', url: '/tours?category=adventure' },
      { text: 'Zip-lining tour detail page', url: '/tours/zip-lining-guanacaste' },
      { text: 'Diamante Eco Adventure Park on GetYourGuide', url: '/go/getyourguide/zip-lining-guanacaste' },
      { text: 'Blue River Resort zip-line', url: '/go/getyourguide/horseback-riding-guanacaste' },
      { text: 'ATV tours in Tamarindo', url: '/tours/atv-tamarindo' },
    ],

    affiliateCallouts: [
      { label: 'Check availability & book on GetYourGuide', tours: ['zip-lining-guanacaste'], program: 'getyourguide', position: 'end' },
    ],
  },

  // ─── "How much does X cost in Guanacaste 2026" ───────────────────────────

  {
    type: 'cost',
    slug: 'zip-lining-cost-guanacaste-2026',
    title: 'How Much Does Zip-lining Cost in Guanacaste? 2026 Prices',
    description: 'Zip-lining in Guanacaste costs $67–$93+ per person depending on the course, inclusions, and whether it\'s part of a combo. Here\'s the full price breakdown by operator, what\'s included, and how to get the best value.',
    h1: 'Zip-lining Prices in Guanacaste: What to Expect in 2026',
    targetKeyword: 'how much does zip lining cost in guanacaste',
    relatedKeywords: ['zip line guanacaste price', 'cost of canopy tour guanacaste', 'diamante zip line price', 'cheapest zip line guanacaste'],
    category: 'adventure',
    canonical: 'https://guanacaste.tours/seo/cost/zip-lining-cost-guanacaste-2026',
    ogImage: '/images/og-cost-zipline.jpg',

    intro: () =>
      'Zip-lining in Guanacaste ranges from about $67 per person for a basic course to $93+ for a full adventure pass that includes more activities. The price depends on the course, the views, what\'s included, and whether you book a combo. Here\'s the full breakdown so you know what you\'re paying for.',

    body: () => ({
      sections: [
        {
          heading: 'Zip-lining price range in Guanacaste',
          body: 'Most zip-line courses in Guanacaste fall into three tiers:',
          listItems: [
            'Basic course: $40–$67 per person. Shorter courses (4–5 cables), forest views, no extras.',
            'Mid-range course: $67–$78 per person. 7–9 cables, better views, sometimes horseback or other activity included.',
            'Premium / adventure pass: $78–$93+ per person. Ocean views (Diamante), full-day combos, multiple activities.',
          ],
        },
        {
          heading: 'Price by operator',
          body: 'Here\'s what the major operators charge (per adult, USD):',
        },
        {
          heading: 'What affects the price',
          body: 'A few factors push the price up or down:',
          listItems: [
            'Combo vs. single activity: A zip-line-only booking is cheaper than a zip-line + horseback + spa combo, but the combo is often better value if you\'d do those activities anyway.',
            'Private vs. group: Private tours (e.g. the catamaran or a private zip-line session) cost more per person but you have the experience to yourselves.',
            'Pickup: Tours with hotel pickup may cost slightly more than meeting-point tours, but the convenience is worth it.',
            'Season: Prices are fairly stable year-round, but operators occasionally run discounts in the green season (May–November) to fill spots.',
            'Booking channel: Booking directly with the operator vs. through GetYourGuide or Viator can change the price. Affiliate partners sometimes offer better availability or last-minute deals.',
          ],
        },
        {
          heading: 'How to get the best value',
          body: 'If you want to maximize what you get for your money:',
          listItems: [
            'Compare combo vs. single: Work out if you\'d do the other activities (horseback, spa, ATV) on the same day — if yes, the combo is almost always better value.',
            'Book the right season: Green season (May–Nov) often has better availability and occasional discounts, though trails are muddier and seas are choppier.',
            'Look for multi-day itineraries: The Guanacaste Adventure Week packs several paid activities into a week — you can book each day individually but the overall cost per activity is lower if you bundle.',
            'Check GetYourGuide and Viator: Both have the same operators but sometimes different availability or last-minute deals. Compare before booking.',
          ],
        },
        {
          heading: 'What\'s usually included (and what\'s extra)',
          body: 'Most zip-line tours include the equipment (harness, helmet, gloves), certified guide, and course access. What\'s typically extra:',
          listItems: [
            'Park entrance fees (if the course is inside a national park or private reserve).',
            'Photos/video packages — many courses offer professional photos for an extra fee.',
            'Transportation — some tours include hotel pickup; others require you to drive.',
            'Meals/snacks — a few courses include lunch; most don\'t.',
            'Tips for the guide — expected in Costa Rica, typically 10% or a few dollars.',
          ],
        },
      ],
      comparisonTable: [
        { label: 'Operator / Course', tours: { 'diamante-eco': 'Diamante Eco Adventure Park', 'blue-river': 'Blue River Resort', 'hacienda-guachipelin': 'Hacienda Guachipelin', 'jacamar-papagayo': 'Jacamar (Papagayo)' } },
        { label: 'Price from (USD, per adult)', tours: { 'diamante-eco': '$78 (zipline) / $93+ (full pass)', 'blue-river': '$67', 'hacienda-guachipelin': '$93 (adventure pass)', 'jacamar-papagayo': '$128 (half day canopy)' } },
        { label: 'Kids price (USD)', tours: { 'diamante-eco': 'varies', 'blue-river': '$53', 'hacienda-guachipelin': '$83', 'jacamar-papagayo': '$68' } },
        { label: 'What\'s included', tours: { 'diamante-eco': 'zipline equipment, guide, park access', 'blue-river': 'zipline equipment, guide, horseback to course', 'hacienda-guachipelin': 'zipline + horseback + river tubing', 'jacamar-papagayo': 'zipline equipment, guide, transport' } },
        { label: 'Duration', tours: { 'diamante-eco': '~1hr zipline', 'blue-river': '~1hr', 'hacienda-guachipelin': '~2hr zipline / full day combo', 'jacamar-papagayo': 'half day' } },
      ],
    }),

    faq: () => [
      { question: 'Is zip-lining expensive in Costa Rica?', answer: 'Not compared to many adventure activities. A zip-line course in Guanacaste typically costs $67–$93 per person, which is in the mid-range for adventure tours in Costa Rica. For comparison, a full-day catamaran charter can be $425+ for a private group, and a sport-fishing charter can be $850+.' },
      { question: 'Are there any hidden costs?', answer: 'Most courses are transparent about what\'s included. The main extras to watch for are photo packages, tips, and transportation if it\'s not included. Always check the "What\'s included" section before booking.' },
      { question: 'Can I pay less by booking directly?', answer: 'Sometimes, but not always. Booking through GetYourGuide or Viator can give you better availability, free cancellation, and a single payment — which can be worth the small difference. Compare before booking.' },
      { question: 'What is the cheapest zip-line in Guanacaste?', answer: 'Blue River Resort\'s horseback + zip-line tour starts at $67/adult, which is among the most affordable in the province for a course with good views. Basic forest courses in the area can be $40–$50 but check the reviews — the cheapest isn\'t always the best value.' },
    ],

    internalLinks: () => [
      { text: 'Best zip-lining in Guanacaste — full comparison', url: '/seo/best/zip-lining-guanacaste' },
      { text: 'Zip-lining tour detail page', url: '/tours/zip-lining-guanacaste' },
      { text: 'ATV tours in Tamarindo (another popular adventure)', url: '/tours/atv-tamarindo' },
      { text: 'Horseback riding in Guanacaste', url: '/tours/horseback-riding-guanacaste' },
    ],

    affiliateCallouts: [
      { label: 'Check current prices on GetYourGuide', tours: ['zip-lining-guanacaste'], program: 'getyourguide', position: 'end' },
    ],
  },

  // ─── "Things to do in [town]" ─────────────────────────────────────────────

  {
    type: 'town',
    slug: 'tamarindo',
    title: 'Things to Do in Tamarindo, Costa Rica — Complete Guide 2026',
    description: 'Tamarindo is Guanacaste\'s most popular beach town. Here\'s everything to do: surf lessons, catamaran sunsets, ATV tours, snorkeling at Las Catalinas, zip-lining, sport fishing, and day trips to Rincon de la Vieja and Palo Verde.',
    h1: 'Things to Do in Tamarindo, Costa Rica: The Complete 2026 Guide',
    targetKeyword: 'things to do in tamarindo costa rica',
    relatedKeywords: ['tamarindo activities', 'tamarindo tours', 'what to do in tamarindo', 'tamarindo beach town guide'],
    category: 'mixed',
    canonical: 'https://guanacaste.tours/seo/town/tamarindo',
    ogImage: '/images/og-tamarindo.jpg',

    intro: () =>
      'Tamarindo is Guanacaste\'s best-known beach town — a long stretch of sand with surf breaks, restaurants, bars, and a full calendar of tours and activities. Whether you\'re here for a few days or a week, there\'s more to do than just sit on the beach. Here\'s the complete list, organized by interest.',

    body: () => ({
      sections: [
        {
          heading: 'Surfing and surf lessons',
          body: 'Tamarindo is one of Costa Rica\'s classic surf towns. The main break is a consistent right-hand point break suitable for intermediate surfers; beginners can take lessons at the beach. Surf camps and rentals are everywhere along the beachfront.',
          listItems: [
            'Best for: beginners to intermediate surfers.',
            'Lessons: available from local instructors, typically 2 hours, ~$50–$70.',
            'Rentals: boards for $10–$20/day.',
            'Best time: year-round, but December–April has the most consistent swell.',
          ],
        },
        {
          heading: 'Catamaran sunset sails',
          body: 'One of the most popular Tamarindo experiences is a sunset catamaran cruise — a 34-foot catamaran with a Mexican-French crew, snorkeling stop, homemade dinner, and cocktails on deck. Dolphins frequently ride the bow.',
          listItems: [
            'Duration: ~4 hours (late afternoon departure).',
            'Price from: $425 for a private group (up to 10).',
            'Best for: couples, groups, anyone who wants a memorable evening on the water.',
            'Review highlight: "The food, the snorkeling, the storks that came in and watching them do what they do, exceptional."',
          ],
        },
        {
          heading: 'Snorkeling at Las Catalinas Islands',
          body: 'A 30–40 minute boat ride from Tamarindo takes you to Las Catalinas — a quiet island community with some of the best snorkeling on Costa Rica\'s Pacific coast. Clear water, tropical fish, reef sharks (harmless), sting rays, spotted eagle rays, and occasional sea turtles.',
          listItems: [
            'Duration: ~5 hours (half day).',
            'Price from: $140/person (small group).',
            'Best for: snorkelers of all levels, including non-swimmers (guide stays close).',
            'Best season: December–April (clearest water, calmest seas).',
          ],
        },
        {
          heading: 'ATV tours — beach and mountain',
          body: 'ATV tours from Tamarindo combine off-road riding through dry forest trails with a beach section (typically Playa Minas or Playa Flamingo). Half-day tours are the standard — enough to get into the rhythm and see a good amount of terrain.',
          listItems: [
            'Duration: ~2 hours.',
            'Price from: $99/person (small group).',
            'Best for: adventure seekers, families with teens (16+ to drive solo, 12+ to ride double).',
            'Note: no experience required for standard trails; a practice loop covers handling.',
          ],
        },
        {
          heading: 'Zip-lining and canopy tours',
          body: 'Several zip-line courses are accessible from Tamarindo, including Diamante Eco Adventure Park (ocean-view dual cable). A zip-line session makes a great contrast to a beach day.',
          listItems: [
            'Closest major course: Diamante Eco Adventure Park (ocean-view dual cable).',
            'Duration: ~1 hour on the course; full day if you do the full Adventure Pass.',
            'Price from: $78/adult (zip-line), $93+ for the full pass.',
          ],
        },
        {
          heading: 'Sport fishing',
          body: 'Tamarindo and nearby Flamingo are sport-fishing territory — sailfish, marlin, tuna, dorado, and roosterfish. Charter a 29ft sport fisher for a full or half day.',
          listItems: [
            'Price from: $850 for a private charter (up to 6, all gear).',
            'Best season: sailfish Dec–Apr, tuna/dorado year-round, marlin Jun–Aug.',
            'Pickup: meeting point at the marina.',
          ],
        },
        {
          heading: 'Day trips from Tamarindo',
          body: 'Two of Guanacaste\'s top day trips are doable from Tamarindo:',
          listItems: [
            'Rincón de la Vieja volcano: hike the national park, see fumaroles and mud pots, optional hot springs. ~7–8 hour day trip.',
            'Palo Verde National Park: birdwatching and wildlife boat tour on the Tempisque River. Early start (6:30 AM pickup) for best birding.',
          ],
        },
        {
          heading: 'Beach life, dining, and nightlife',
          body: 'Tamarindo\'s beachfront is lined with restaurants, bars, and shops. The town has a laid-back surf-town vibe with enough nightlife to be interesting without being overwhelming.',
          listItems: [
            'Dining: fresh fish, ceviche, international options.',
            'Bars: beach bars with music, sunset drinks.',
            'Shops: surf shops, souvenir shops, tour operators.',
            'Best time to walk the beach: early morning (fewer people, calm water) or sunset.',
          ],
        },
      ],
      featuredTours: ['catamaran-sunset-tamarindo', 'snorkeling-las-catalinas', 'atv-tamarindo', 'zip-lining-guanacaste', 'sport-fishing-guanacaste'],
    }),

    faq: () => [
      { question: 'Is Tamarindo good for families?', answer: 'Yes — Tamarindo is one of Guanacaste\'s most family-friendly towns. The beach is calm in parts, there are surf lessons for kids, family-friendly restaurants, and tours like catamaran sails, snorkeling, and ATV (for older kids) that work for families.' },
      { question: 'How many days should I spend in Tamarindo?', answer: 'Two to four days is typical — enough for a couple of tours, some surf, a catamaran sunset, and beach time. If you want to do a volcano day trip or multiple adventure activities, add a day or base yourself in Liberia for easier access to day trips.' },
      { question: 'Do I need a car in Tamarindo?', answer: 'Not necessarily — the town is walkable and tour operators offer hotel pickup. But a rental car gives you flexibility to visit nearby beaches (Playa Grande, Playa Flamingo) and day-trip to the volcano more easily. Most visitors pick up a rental at Liberia airport.' },
      { question: 'What is the best time of year to visit Tamarindo?', answer: 'December–April (dry season) has the best weather — clear skies, calm seas, great for snorkeling and catamaran sails. May–November (green season) is lush and less crowded, with dramatic sunsets, but expect afternoon rains and choppier seas.' },
    ],

    internalLinks: () => [
      { text: 'Catamaran sunset sail in Tamarindo', url: '/tours/catamaran-sunset-tamarindo' },
      { text: 'Snorkeling at Las Catalinas', url: '/tours/snorkeling-las-catalinas' },
      { text: 'ATV tours in Tamarindo', url: '/tours/atv-tamarindo' },
      { text: 'Zip-lining in Guanacaste', url: '/tours/zip-lining-guanacaste' },
      { text: 'Sport fishing in Guanacaste', url: '/tours/sport-fishing-guanacaste' },
      { text: 'Rincón de la Vieja volcano day trip', url: '/tours/rincon-de-la-vieja-volcano' },
      { text: 'Palo Verde birdwatching', url: '/tours/palo-verde-birdwatching' },
      { text: 'Car rental in Liberia', url: '/go/discovercars/liberia' },
    ],

    affiliateCallouts: [
      { label: 'Book your Tamarindo tours on GetYourGuide', tours: ['catamaran-sunset-tamarindo', 'snorkeling-las-catalinas', 'atv-tamarindo'], program: 'getyourguide', position: 'end' },
    ],
  },

  {
    type: 'town',
    slug: 'liberia',
    title: 'Things to Do in Liberia, Costa Rica — Base Town Guide',
    description: 'Liberia is Guanacaste\'s capital and the main base for travelers — close to the airport, Rincón de la Vieja volcano, and day trips to the beaches. Here\'s what to do in and around Liberia, plus how to use it as a hub.',
    h1: 'Things to Do in and Around Liberia, Costa Rica',
    targetKeyword: 'things to do in liberia costa rica',
    relatedKeywords: ['liberia costa rica guide', 'liberia airport base', 'what to do near liberia airport'],
    category: 'mixed',
    canonical: 'https://guanacaste.tours/seo/town/liberia',
    ogImage: '/images/og-liberia.jpg',

    intro: () =>
      'Liberia is Guanacaste\'s capital and one of Costa Rica\'s oldest cities — founded in 1824 and known as the "White City." It\'s also the closest major town to the international airport (LIR), making it a natural base for travelers who want easy access to the province\'s tours and beaches without staying on the coast.',

    body: () => ({
      sections: [
        {
          heading: 'Why base yourself in Liberia',
          body: 'Liberia has a few advantages as a base:',
          listItems: [
            'Proximity to the airport: 10–15 minutes from LIR. Easy in/out without long transfers.',
            'Central location: 45–60 minutes to Tamarindo, 30 minutes to Rincón de la Vieja, 1.5–2 hours to the farther beaches.',
            'Lower prices: accommodation and food are generally cheaper than on the beach towns.',
            'Less crowded: it\'s a working town, not a tourist resort — quieter, more local.',
          ],
        },
        {
          heading: 'What to do in Liberia itself',
          body: 'Liberia is a small city — you won\'t spend days here, but a half-day is worthwhile:',
          listItems: [
            'Parque Central — the main square with the Catedral de San Nicolás.',
            'Museo de la Historia — Guanacaste\'s independence and regional history (check opening hours — often closed Mondays).',
            'Local markets and bakeries — try the pastel de leche and granizado.',
            'Walk the colonial streets — the "White City" nickname comes from the painted colonial buildings.',
          ],
        },
        {
          heading: 'Day trips from Liberia',
          body: 'Liberia\'s central location makes it a good hub for day trips:',
          listItems: [
            'Rincón de la Vieja volcano: 30–45 minutes. Hike, fumaroles, mud pots, optional hot springs.',
            'Tamarindo: 45–60 minutes. Surf, catamaran, ATV, snorkeling.',
            'Palo Verde National Park: 45–60 minutes. Birdwatching and wildlife boat tour.',
            'Papagayo / Flamingo: 30–45 minutes. Sport fishing, quieter beaches.',
            'Nicoya Peninsula (Santa Teresa, Nosara): 2–3 hours — a longer day or an overnight.',
          ],
        },
        {
          heading: 'Airport logistics',
          body: 'If you\'re using Liberia as a base, the airport logistics are simple:',
          listItems: [
            'Airport: Juan Santamaría International (LIR) — actually closer to Liberia than to San José.',
            'Getting to town: 10–15 minutes by taxi or rental car.',
            'Rental cars: pick up at the airport — Liberia is a good place to start a road trip around the province.',
            'Currency: Costa Rican colones and USD are both widely accepted. ATMs in town.',
          ],
        },
      ],
      featuredTours: ['rincon-de-la-vieja-volcano', 'palo-verde-birdwatching', 'liberia-town-tour'],
    }),

    faq: () => [
      { question: 'Is Liberia worth staying in instead of the beach?', answer: 'If you want lower prices, an easy airport transfer, and central access to the province\'s tours, yes — Liberia is a good base. You\'ll drive 45–60 minutes to the beaches, but you\'ll save on accommodation and have more options for day trips. If your priority is being on the beach every day, stay in Tamarindo, Flamingo, or a similar beach town.' },
      { question: 'How far is Liberia from the beaches?', answer: 'Tamarindo is ~45–60 minutes by car. Flamingo is ~30–45 minutes. Playa Hermosa is ~15–20 minutes. The farther beaches on the Nicoya Peninsula are 2–3 hours.' },
      { question: 'Is Liberia safe?', answer: 'Liberia is a small, quiet town and generally safe for tourists. Standard precautions apply: don\'t leave valuables in an unattended car, keep your passport secure, and be aware of your surroundings at night. The main tourist areas are well-patrolled.' },
    ],

    internalLinks: () => [
      { text: 'Liberia historic town tour', url: '/tours/liberia-town-tour' },
      { text: 'Rincón de la Vieja volcano from Liberia', url: '/tours/rincon-de-la-vieja-volcano' },
      { text: 'Car rental in Liberia', url: '/go/discovercars/liberia' },
      { text: 'Hotels in Liberia on Booking.com', url: '/go/bookingcom/liberia-hotels' },
    ],
  },

  // ─── "Best tours in Guanacaste in [month]" ────────────────────────────────

  {
    type: 'season',
    slug: 'january',
    title: 'Best Tours in Guanacaste in January — Dry Season Guide',
    description: 'January is peak dry-season in Guanacaste — perfect for catamaran sunsets, snorkeling, zip-lining, and volcano hikes. Here are the best tours to book in January and what to know about crowds and prices.',
    h1: 'The Best Tours in Guanacaste in January',
    targetKeyword: 'best tours guanacaste january',
    relatedKeywords: ['guanacaste in january', 'january costa rica tours', 'what to do in guanacaste in january'],
    category: 'mixed',
    canonical: 'https://guanacaste.tours/seo/season/january',
    ogImage: '/images/og-season-january.jpg',

    intro: () =>
      'January is one of the best months to visit Guanacaste — the dry season is in full swing, seas are calm, skies are clear, and the province\'s tours run at their best. The trade-off: it\'s also peak tourist season, so popular tours fill up and prices are at their highest. Here\'s what to prioritize and how to plan.',

    body: () => ({
      sections: [
        {
          heading: 'Why January is a great month in Guanacaste',
          body: 'January offers near-ideal conditions for most Guanacaste activities:',
          listItems: [
            'Dry, sunny days — little rain, clear skies for catamaran sails and sunset views.',
            'Calm seas — excellent for snorkeling at Las Catalinas and catamaran cruises.',
            'Clear volcano views — Rincón de la Vieja hikes have the best visibility.',
            'Whale season is starting — humpback whales begin arriving in January (peak is later in the season).',
            'Surf is consistent — Tamarindo\'s breaks are active and clean.',
          ],
        },
        {
          heading: 'Top tours to book in January',
          body: 'These are the tours that shine in January\'s dry-season conditions:',
        },
        {
          heading: 'Catamaran sunset sails',
          body: 'January\'s calm seas and clear skies make catamaran sunset sails especially rewarding. The visibility is excellent for snorkeling stops, and the sunset is reliably dramatic.',
          listItems: [
            'Book at least 3–5 days ahead — these fill up in peak season.',
            'The private version (up to 10 people) is the top-rated option.',
          ],
        },
        {
          heading: 'Snorkeling at Las Catalinas',
          body: 'The clearest water of the year makes January the best month for snorkeling at Las Catalinas. Tropical fish, rays, and reef sharks are reliably visible.',
          listItems: [
            'Wear reef-safe sunscreen — Las Catalinas is a protected area.',
            'Bring an underwater camera or GoPro — visibility is excellent.',
          ],
        },
        {
          heading: 'Rincón de la Vieja volcano hike',
          body: 'Dry-season hikes on the volcano trails are cool in the morning and offer clear views of the crater and fumaroles. The muddy trail conditions of green season are gone.',
          listItems: [
            'Start early (7:00 AM pickup) to avoid the midday heat.',
            'Wear closed-toe hiking shoes with grip — volcanic soil can still be slippery.',
            'Bring binoculars — the park is excellent for birding and wildlife spotting.',
          ],
        },
        {
          heading: 'Zip-lining',
          body: 'Zip-lining is a year-round activity, but January\'s calmer winds and clearer views (especially at Diamante\'s ocean-view dual cable) make it particularly enjoyable.',
          listItems: [
            'Diamante\'s dual-cable ocean-view line is the standout in clear weather.',
            'Check weight/age limits before booking.',
          ],
        },
        {
          heading: 'ATV tours',
          body: 'January\'s dry, firm trails are ideal for ATV riding — less mud, easier handling, and more comfortable conditions than green season.',
          listItems: [
            'Standard trails require no experience — a practice loop covers handling.',
            'Wear long pants, closed-toe shoes, and a shirt (no tank tops on trails).',
          ],
        },
        {
          heading: 'Crowds and booking advice for January',
          body: 'January is peak tourist season in Costa Rica. Here\'s how to manage it:',
          listItems: [
            'Book popular tours 3–7 days in advance — catamaran sails, ATV, and sport fishing fill up fastest.',
            'Expect higher prices — January is the most expensive month for tours in Guanacaste.',
            'Consider a rental car — it gives you flexibility to visit multiple spots without relying on tour schedules.',
            'If you\'re flexible on dates, the very beginning or end of January can be slightly less crowded than the middle.',
            'Book accommodation early — beach towns fill up quickly for the New Year season.',
          ],
        },
        {
          heading: 'What to pack for January in Guanacaste',
          body: 'January is hot and dry — pack for warm beach days and cooler mornings:',
          listItems: [
            'Light, breathable clothing for the day.',
            'A light jacket or sweater for early mornings and boat rides.',
            'Sunscreen, hat, and sunglasses — the sun is strong.',
            'Swimsuit + towel for beach and boat tours.',
            'Hiking shoes for volcano and waterfall tours.',
            'Reef-safe sunscreen for snorkeling.',
            'Motion sickness meds if you\'re sensitive (for boat tours and ATVs).',
          ],
        },
      ],
      featuredTours: ['catamaran-sunset-tamarindo', 'snorkeling-las-catalinas', 'rincon-de-la-vieja-volcano', 'zip-lining-guanacaste', 'atv-tamarindo'],
    }),

    faq: () => [
      { question: 'Is January the best month to visit Guanacaste?', answer: 'January is one of the best months — dry, sunny, calm seas, clear views. It\'s also peak season, so it\'s the most expensive and most crowded. If you prioritize perfect weather, January is a great choice. If you prefer fewer crowds and don\'t mind afternoon rain, May–June or November can be better values.' },
      { question: 'How far in advance should I book tours in January?', answer: 'For the most popular tours (catamaran sunset sails, private charters, ATV, sport fishing), book 3–7 days in advance. Less popular tours can often be booked a day or two ahead, but it\'s safer to book early in peak season.' },
      { question: 'Are there any tours that are better later in the season?', answer: 'Whale watching gets better later in the season (February–April for humpbacks, July–November for the other population). If whale watching is a priority, February or March may be better than January. For everything else, January is excellent.' },
    ],

    internalLinks: () => [
      { text: 'Catamaran sunset sail', url: '/tours/catamaran-sunset-tamarindo' },
      { text: 'Snorkeling at Las Catalinas', url: '/tours/snorkeling-las-catalinas' },
      { text: 'Rincón de la Vieja volcano hike', url: '/tours/rincon-de-la-vieja-volcano' },
      { text: 'Zip-lining in Guanacaste', url: '/tours/zip-lining-guanacaste' },
      { text: 'ATV tours in Tamarindo', url: '/tours/atv-tamarindo' },
    ],
  },

  // ─── "Best tours in Guanacaste for [audience]" ────────────────────────────

  {
    type: 'audience',
    slug: 'families',
    title: 'Best Tours in Guanacaste for Families — 2026 Guide',
    description: 'Guanacaste is a great family destination. Here are the best tours for families: catamaran sails, snorkeling at Las Catalinas, zip-lining, ATV (for older kids), horseback riding, and wildlife day trips — with age limits and tips for each.',
    h1: 'The Best Tours in Guanacaste for Families',
    targetKeyword: 'best tours guanacaste for families',
    relatedKeywords: ['guanacaste family activities', 'tourist activities guanacaste with kids', 'family friendly tours guanacaste'],
    category: 'mixed',
    canonical: 'https://guanacaste.tours/seo/audience/families',
    ogImage: '/images/og-audience-families.jpg',

    intro: () =>
      'Guanacaste is one of Costa Rica\'s most family-friendly regions — calm beaches, engaging wildlife, and tours that work for a range of ages. The key is picking tours that match your kids\' ages and interests. This guide breaks down the best family-friendly options by age group and what to expect.',

    body: () => ({
      sections: [
        {
          heading: 'Best tours for all ages (families with young kids)',
          body: 'These tours work well for families with younger children (ages 4+):',
          listItems: [
            'Catamaran sunset sail — relaxing, safe, kids love seeing dolphins. The private version lets you set the pace. Most operators don\'t have a strict age limit for the standard sail, but check with the operator.',
            'Snorkeling at Las Catalinas — the guide stays close to non-swimmers and kids, the sites are shallow, and the marine life is engaging. Age 6+ is typical.',
            'Wildlife boat tour at Palo Verde — quiet boat through the wetlands, close-up views of birds and wildlife. Great for all ages who can sit still for an hour or two.',
            'Hanging bridges / aerial tram — slower than zip-lining, more accessible for young kids, still gives a canopy experience.',
          ],
        },
        {
          heading: 'Best tours for older kids and teens (ages 10+)',
          body: 'Once kids are a bit older, the adventure options open up:',
          listItems: [
            'Zip-lining — most courses accept ages 6–10+ depending on the course. Older kids and teens can handle the full circuits. Diamante\'s ocean-view dual cable is a highlight.',
            'ATV tours — teens 16+ can drive solo; younger teens (12+) can ride double with an adult. No experience required for standard trails.',
            'Horseback riding — beach rides and forest trails work for most ages with a guide-matched horse.',
            'Sport fishing — older kids who are interested in fishing can join a charter (catch-and-release billfish is a good introduction).',
          ],
        },
        {
          heading: 'Best day trips for families',
          body: 'Two day trips work particularly well for families:',
          listItems: [
            'Rincón de la Vieja volcano — the guided hike to fumaroles and mud pots is engaging for kids who like nature and geology. Hot springs (if included) are a hit with all ages. Age 6+ is typical.',
            'Palo Verde birdwatching — the boat tour is the highlight for kids (close-up wildlife on the water). The land walk can be long for very young kids, so consider a shorter version or just the boat.',
          ],
        },
        {
          heading: 'What to look for when booking family tours',
          body: 'A few things to check before booking any tour with kids:',
          listItems: [
            'Age limits — confirm the minimum age for the specific tour, not just the operator.',
            'Pickup — hotel pickup is convenient with kids; avoid tours that require a long drive to a meeting point.',
            'Duration — younger kids do better with shorter tours (half-day or less). Full-day volcano hikes can be long for young children.',
            'Restrooms — check if the tour includes restroom stops, especially for longer tours.',
            'Food — some tours include lunch; for others, plan a lunch stop or bring snacks.',
            'Safety briefing — make sure the operator does a proper safety briefing for kids before any adventure activity.',
            'Weather flexibility — in green season, have a backup plan for rainy afternoon tours.',
          ],
        },
        {
          heading: 'Pacing a family trip in Guanacaste',
          body: 'With kids, one tour per day is usually the right pace — especially if it\'s an active tour. A sample family day:',
          listItems: [
            'Morning: one active tour (snorkeling, ATV, zip-line, or volcano hike).',
            'Midday: beach time or pool time to recover.',
            'Late afternoon: a relaxed activity (catamaran sunset, beach walk, ice cream).',
            'Evening: early dinner and easy night — kids will be tired after a day of adventure.',
          ],
        },
      ],
      featuredTours: ['catamaran-sunset-tamarindo', 'snorkeling-las-catalinas', 'zip-lining-guanacaste', 'atv-tamarindo', 'horseback-riding-guanacaste', 'rincon-de-la-vieja-volcano'],
    }),

    faq: () => [
      { question: 'What is the best age for zip-lining in Guanacaste?', answer: 'Most courses accept ages 6–10+ depending on the course and line. The minimum weight for short lines is typically ~60 lbs (27 kg), which many 6–7 year olds meet. For the full circuit, some courses require ~85 lbs (40 kg), which is more like age 9–10. Always check the specific course\'s requirements.' },
      { question: 'Can toddlers come on catamaran sails?', answer: 'Yes — catamaran sails are one of the most toddler-friendly activities in Guanacaste. The boat is stable, the crew is experienced with families, and kids enjoy seeing dolphins and being on the water. Bring snacks and a light jacket for when the sun goes down.' },
      { question: 'Are ATV tours safe for kids?', answer: 'ATV tours are safe when you follow the operator\'s rules. Teens 16+ can drive solo on standard trails; younger teens (12+) ride double with an adult. Younger children typically ride as passengers. Everyone gets a safety briefing and a practice loop before the main trails.' },
      { question: 'What should I pack for a family day of tours?', answer: 'Pack a day bag with: swimsuits, towels, sunscreen (reef-safe for snorkeling), water, snacks, motion sickness meds if needed, a change of clothes for after water activities, and any comfort items for younger kids (small toy, tablet for the drive).' },
    ],

    internalLinks: () => [
      { text: 'Catamaran sunset sail (family-friendly)', url: '/tours/catamaran-sunset-tamarindo' },
      { text: 'Snorkeling at Las Catalinas (ages 6+)', url: '/tours/snorkeling-las-catalinas' },
      { text: 'Zip-lining in Guanacaste (ages 6–10+)', url: '/tours/zip-lining-guanacaste' },
      { text: 'ATV tours in Tamarindo (ages 12+ to ride)', url: '/tours/atv-tamarindo' },
      { text: 'Horseback riding in Guanacaste', url: '/tours/horseback-riding-guanacaste' },
      { text: 'Rincón de la Vieja volcano (day trip)', url: '/tours/rincon-de-la-vieja-volcano' },
    ],
  },

  // ─── "X vs Y in Guanacaste" ────────────────────────────────────────────────

  {
    type: 'compare',
    slug: 'zip-lining-vs-atv',
    title: 'Zip-lining vs ATV in Guanacaste — Which Should You Book?',
    description: 'Both zip-lining and ATV tours are among Guanacaste\'s most popular adventure activities. This comparison breaks down the experience, price, age limits, physical demands, and which is better for different types of travelers.',
    h1: 'Zip-lining vs ATV in Guanacaste: Which Adventure Should You Choose?',
    targetKeyword: 'zip lining vs atv guanacaste',
    relatedKeywords: ['guanacaste adventure tour comparison', 'best adventure activity guanacaste', 'zip line or atv guanacaste'],
    category: 'adventure',
    canonical: 'https://guanacaste.tours/seo/compare/zip-lining-vs-atv',
    ogImage: '/images/og-compare-zipline-atv.jpg',

    intro: () =>
      'Zip-lining and ATV tours are two of Guanacaste\'s most popular adventure activities — and they\'re very different experiences. Zip-lining is about the views: flying through the canopy with a bird\'s-eye perspective of the forest. ATV is about the ride: powering through trails, mud, and river crossings on a rugged vehicle. Here\'s how to decide which is right for you — or whether to do both.',

    body: () => ({
      sections: [
        {
          heading: 'What zip-lining is like in Guanacaste',
          body: 'Zip-lining in Guanacaste means flying through the forest canopy on steel cables, usually 4–9 lines ranging from short (to get comfortable) to long (the highlight). The experience is about the views — especially at Diamante, where the dual-cable line flies over the Pacific Ocean — and the mild adrenaline of the longer lines. It\'s guided, safety-briefed, and suitable for most able-bodied travelers age 6+.',
          listItems: [
            'Duration: ~1 hour on the course (half day or full day if it\'s part of a combo).',
            'Physical demand: moderate — you need to be able to harness up and hold on, but it\'s not physically exhausting.',
            'Age range: 6–10+ depending on the course; weight limits typically 60–250 lbs (27–113 kg).',
            'Best views: ocean (Diamante), volcano and waterfalls (Blue River), canyon/forest (Hacienda Guachipelin), dry forest (Jacamar).',
            'Good for: travelers who want views + mild adrenaline + a photo-worthy experience.',
          ],
        },
        {
          heading: 'What ATV touring is like in Guanacaste',
          body: 'ATV tours in Guanacaste mean riding a quad bike through dry forest trails, hills, riverbeds, and (often) a beach section. The experience is about the ride — handling the bike, navigating the terrain, and the fun of off-road driving. It\'s guided (a lead bike and sweep), and suitable for most able-bodied travelers with no experience required for the standard trails.',
          listItems: [
            'Duration: ~2 hours (half day).',
            'Physical demand: moderate — you\'re actively riding and maneuvering the bike for the full tour.',
            'Age range: 16+ to drive solo; 12+ to ride double with an adult; younger children ride as passengers.',
            'Best terrain: dry forest trails, hills, river crossings, beach sections (Tamarindo-based tours).',
            'Good for: travelers who want the fun of driving off-road + a more active, hands-on experience.',
            'Note: no experience required for standard trails, but you do need to be comfortable sitting on and controlling a quad bike.',
          ],
        },
        {
          heading: 'Side-by-side comparison',
          body: 'Here\'s how they stack up across the factors that matter most:',
        },
        {
          heading: 'Can you do both in one day?',
          body: 'Yes — many travelers combine a zip-line and an ATV on the same trip (not necessarily the same day). A common pattern: zip-line in the morning (cooler, calmer winds), ATV in the afternoon, or vice versa. Some operators offer combo packages that include both, but it\'s also easy to book them separately from different operators.',
          listItems: [
            'If you have a full day, doing both is a lot of adventure — pace yourself.',
            'If you have a half day each, they work well on consecutive days.',
            'Combos (zip-line + ATV) exist but check what\'s actually included — some are just two separate bookings sold together.',
          ],
        },
        {
          heading: 'Which should you choose?',
          body: 'Here\'s a quick rule of thumb:',
          listItems: [
            'Choose zip-lining if: you want the best views, a more relaxed pace, something that works for a wider age range, and a photo-worthy experience.',
            'Choose ATV if: you want to be in control, you enjoy driving/riding, you\'re 16+ (or traveling with teens who can drive), and you want a more physical, hands-on adventure.',
            'Do both if: you have the time, you\'re not short on energy, and you want the full Guanacaste adventure experience — they complement each other well.',
            'Skip both if: you prefer lower-impact activities (hiking, wildlife watching, beach time) or you have mobility/health concerns that make either activity uncomfortable. In that case, consider hanging bridges, wildlife boat tours, or a catamaran sail instead.',
          ],
        },
      ],
      comparisonTable: [
        { label: 'Factor', tours: { 'zipline': 'Zip-lining', 'atv': 'ATV Tour' } },
        { label: 'What you do', tours: { 'zipline': 'Fly through canopy on cables', 'atv': 'Drive a quad bike on trails' } },
        { label: 'Primary appeal', tours: { 'zipline': 'Views + mild adrenaline', 'atv': 'Off-road driving fun' } },
        { label: 'Duration', tours: { 'zipline': '~1 hour (course) / half day (with extras)', 'atv': '~2 hours' } },
        { label: 'Price from (USD)', tours: { 'zipline': '$67–$93+ per person', 'atv': '$99 per person (small group)' } },
        { label: 'Min age', tours: { 'zipline': '6–10+ (varies by course)', 'atv': '16 to drive solo; 12+ to ride double' } },
        { label: 'Physical demand', tours: { 'zipline': 'Moderate (harness, hold on)', 'atv': 'Moderate (actively riding)' } },
        { label: 'Experience needed', tours: { 'zipline': 'None — safety briefing included', 'atv': 'None for standard trails — practice loop included' } },
        { label: 'Best views', tours: { 'zipline': 'Forest canopy, ocean (Diamante), volcano', 'atv': 'Dry forest, beach sections, hills' } },
        { label: 'Good for families with young kids', tours: { 'zipline': 'Yes (ages 6–10+)', 'atv': 'Only as passengers (younger kids ride with adult)' } },
      ],
    }),

    faq: () => [
      { question: 'Which is more expensive — zip-lining or ATV?', answer: 'ATV tours in Tamarindo typically start at $99 per person for a small-group half-day tour. Zip-lining ranges from $67–$93+ per person depending on the course. They\'re in a similar price range, though the most premium zip-line courses (Diamante full pass, combos) can cost more than a standard ATV tour.' },
      { question: 'Can younger kids do either activity?', answer: 'Zip-lining accepts ages 6–10+ depending on the course, so younger kids can participate (with the weight/age requirements met). ATV tours accept younger kids only as passengers (riding double with an adult) — the youngest drivers are typically 16. For families with young kids who want an adventure, zip-lining is the more accessible option.' },
      { question: 'Which is better for photos?', answer: 'Zip-lining wins for photos — the views from the cables (especially the ocean at Diamante) are dramatic and unique. ATV tours produce great action photos on the trails and beach, but most people are busy riding. Both courses and tours often offer photo packages — ask before booking.' },
      { question: 'Are both activities safe?', answer: 'Yes, when you choose reputable operators. Zip-lining courses use double-cable systems and certified guides; ATV tours start with a safety briefing and practice loop. The main risks are: for zip-lining, failing to follow instructions; for ATV, losing control on trails. Both are well-managed by good operators.' },
    ],

    internalLinks: () => [
      { text: 'Zip-lining in Guanacaste — full guide', url: '/tours/zip-lining-guanacaste' },
      { text: 'ATV tours in Tamarindo', url: '/tours/atv-tamarindo' },
      { text: 'Zip-lining vs ATV — detailed cost comparison', url: '/seo/cost/zip-lining-cost-guanacaste-2026' },
      { text: 'Best zip-lining courses — comparison', url: '/seo/best/zip-lining-guanacaste' },
    ],

    affiliateCallouts: [
      { label: 'Book zip-lining on GetYourGuide', tours: ['zip-lining-guanacaste'], program: 'getyourguide', position: 'end' },
      { label: 'Book ATV tours on GetYourGuide', tours: ['atv-tamarindo'], program: 'getyourguide', position: 'end' },
    ],
  },

  // ─── Deep-dive guide ───────────────────────────────────────────────────────

  {
    type: 'guide',
    slug: 'rincon-de-la-vieja',
    title: 'Rincón de la Vieja Volcano Complete Guide — Hikes, Hot Springs & Waterfalls',
    description: 'Rincón de la Vieja is Guanacaste\'s active volcano and one of the province\'s must-see natural attractions. This complete guide covers the best hikes, how to see the fumaroles and mud pots, the hot springs, the waterfalls, wildlife, and how to plan the perfect day trip.',
    h1: 'Rincón de la Vieja Volcano: The Complete Guide',
    targetKeyword: 'rincon de la vieja volcano guide',
    relatedKeywords: ['rincon de la vieja hiking', 'rincon de la vieja hot springs', 'guanacaste volcano day trip', 'rincon de la vieja national park'],
    category: 'wildlife-nature',
    canonical: 'https://guanacaste.tours/seo/guide/rincon-de-la-vieja',
    ogImage: '/images/og-guide-rincon.jpg',

    intro: () =>
      'Rincón de la Vieja is Guanacaste\'s most iconic natural attraction — an active volcano rising 6,286 ft (1,918m) above the dry tropical forest of the province\'s interior. The national park around it is one of the best places in the region to hike, see volcanic features (fumaroles, mud pots, steam vents), spot wildlife, and — on many tours — unwind in natural hot springs at the end of the day. This guide covers everything you need to know to plan the perfect visit.',

    body: () => ({
      sections: [
        {
          heading: 'What is Rincón de la Vieja?',
          body: 'Rincón de la Vieja is an active composite volcano in the Guanacaste mountain range, near the town of Santa Rosa and Liberia. The volcano is part of a national park (Parque Nacional Rincón de la Vieja) that protects 34,000 acres of dry tropical forest, volcanic features, and waterfalls. The volcano is classified as active — it has frequent fumaroles, mud pots, and occasional small phreatic eruptions — but it\'s safe to visit the park; the guides know the current activity level.',
          listItems: [
            'Height: 6,286 ft (1,918m) at the highest peak (Santa María).',
            'Last major eruption: 1995 (phreatic). Since then, mostly fumarolic activity.',
            'Park size: ~34,000 acres (13,800 hectares).',
            'Best time to visit: dry season (December–April) for clear views and good hiking weather. Green season (May–November) is lush and dramatic but trails can be muddy.',
            'Entrance fee: ~$15/person (often not included in tours — bring cash).',
          ],
        },
        {
          heading: 'The main attractions in the park',
          body: 'The park has several distinct areas, each with a different experience:',
        },
        {
          heading: 'Fumaroles and mud pots (Volcano Lodge trail)',
          body: 'The most popular trail in the park leads from the Volcano Lodge area to the fumaroles — steam vents, boiling mud pots, and hot springs (natural, not developed). This is the classic Rincón de la Vieja experience: walking through the forest to a landscape of steaming earth. The trail is moderate — about 1–2 km of uneven volcanic terrain.',
          listItems: [
            'What you\'ll see: steam vents (fumaroles), boiling mud pots (turbas), hot springs (natural pools), and views of the volcano crater.',
            'Duration on this trail: ~1–2 hours including the walk from the lodge.',
            'Difficulty: moderate — uneven volcanic soil, can be slippery when wet.',
            'Best time: morning (cooler, more steam visible, fewer people).',
            'Safety: stay on the trail — the volcanic soil can be hot and unstable in places.',
          ],
        },
        {
          heading: 'Waterfalls (La Fajina, Oarto, and others)',
          body: 'The park has several waterfalls, the most popular being La Fajina. A hike to the waterfall is a common addition to the fumaroles trail — more distance, more forest, and a rewarding waterfall at the end. Some tours combine the waterfall hike with the fumaroles walk; others focus on one or the other.',
          listItems: [
            'La Fajina waterfall: the most accessible and popular. A moderate hike through the forest.',
            'Oarto waterfall: a longer, more strenuous hike, less visited.',
            'Best time to visit waterfalls: morning or late afternoon — midday can be hot on the exposed sections.',
            'Swimming: sometimes possible at the base of the waterfall, depending on the season and water level — check with the guide.',
          ],
        },
        {
          heading: 'Wildlife in the park',
          body: 'Rincón de la Vieja is one of the best wildlife-watching spots in Guanacaste\'s interior. The dry tropical forest is home to:',
          listItems: [
            'White-faced capuchin monkeys — common, visible, often heard before seen.',
            'Howler monkeys — deeper in the forest, heard by their loud calls.',
            'Coatis — frequently seen foraging near the trails and lodge.',
            'Toucans (chestnut-mandibled, sometimes keel-billed) — iconic, seen in the canopy.',
            'Motmots, parrots, tanagers, and many other bird species.',
            'Baird\'s tapir — rare but occasionally spotted, especially near water and at dawn/dusk.',
            'Iguanas — often seen sunning on rocks and trails.',
            'Best wildlife viewing: early morning, quiet walking, binoculars, patience.',
          ],
        },
        {
          heading: 'Hot springs — natural and developed',
          body: 'Hot springs are a common addition to a Rincón de la Vieja day trip. There are two types:',
          listItems: [
            'Natural hot springs in the park: rustic, undeveloped pools fed by volcanic hot springs. These are often included in guided tours (a short walk from the trail). They\'re free/cheap but basic — no facilities, just the natural pools.',
            'Developed hot springs at nearby resorts: Hotel Borinquen, Blue River Resort, and others have developed hot spring facilities (pools, some with views of the volcano). These are more comfortable (changing rooms, drinks, schedules) but cost more.',
            'Which to choose: natural hot springs if you want the authentic volcanic experience and don\'t mind rustic conditions. Developed hot springs if you want comfort, a scheduled soak, and a more relaxed end to the day.',
            'Tip: hot springs are especially enjoyable in green season (May–November) when the air is cooler and rainier — a warm soak after a muddy hike is hard to beat.',
          ],
        },
        {
          heading: 'How to visit — day trip vs. staying nearby',
          body: 'Most visitors do Rincón de la Vieja as a day trip from Tamarindo, Liberia, or a beach town. A few stay overnight near the volcano for a more relaxed visit. Here\'s how to choose:',
          listItems: [
            'Day trip from Tamarindo: ~1.5–2 hours each way. Doable, but a long drive. Best if you\'re combining it with another activity or have a full day to dedicate.',
            'Day trip from Liberia: ~45–60 minutes each way. Much more manageable — Liberia is a good base for a volcano day.',
            'Stay near the volcano: Hotel Borinquen, Hotel Stafiosis, or similar. Staying overnight lets you do the park in the morning (best light, cooler, fewer people) and relax in the afternoon/hot springs without the drive.',
            'Guided tour vs. self-guided: guided tours include transport, a naturalist guide (valuable for wildlife and geology), park entrance, and often lunch/hot springs. Self-guided is cheaper but you\'ll need your own transport, entrance fee, and you\'ll miss the guide\'s expertise.',
          ],
        },
        {
          heading: 'What to pack for a Rincón de la Vieja visit',
          body: 'A day at the volcano requires a different kit than a beach day:',
          listItems: [
            'Hiking shoes with grip — the volcanic soil is slippery when wet. No flip-flops.',
            'Light long pants — protects against ticks, scrub, and sun.',
            'Light long-sleeve shirt — sun protection and bug protection.',
            'Sunscreen and hat — the exposed sections (fumaroles area) have little shade.',
            'Insect repellent — the forest has mosquitoes, especially in green season.',
            'Water bottle — there\'s limited water on the trails.',
            'Binoculars — for wildlife.',
            'Cash for park entrance (~$15) if not included in your tour.',
            'Swimsuit + towel + change of clothes — if your tour includes hot springs.',
            'Camera — the volcanic landscape and wildlife are photogenic.',
          ],
        },
      ],
      featuredTours: ['rincon-de-la-vieja-volcano'],
    }),

    faq: () => [
      { question: 'Is Rincón de la Vieja safe to visit?', answer: 'Yes — the national park is open and safe to visit. The volcano is classified as active (fumaroles, mud pots, occasional small phreatic eruptions), but the park trails are well-maintained and the guides monitor activity. There have been no major eruptions in recent decades. The main safety considerations are standard hiking safety: stay on trails, wear appropriate footwear, and follow the guide\'s instructions near the fumaroles.' },
      { question: 'What is the best time of day to visit the volcano?', answer: 'Morning is best — the light is better for views and photos, the temperature is cooler for hiking, and the fumaroles and mud pots are more active (more steam visible). Afternoon visits are fine but can be hot on the exposed sections. If you\'re doing a guided day trip, most depart around 7:00 AM for this reason.' },
      { question: 'Can you hike to the crater?', answer: 'No — the crater is not open to visitors. The park\'s trails go to viewpoints of the crater and to the fumaroles and mud pots on the volcano\'s flanks, but you cannot hike to the summit crater. The main trail (Volcano Lodge trail) takes you to the fumarole field, which is the closest most visitors get to the active volcanic zone.' },
      { question: 'Are the hot springs included in the tour?', answer: 'It depends on the tour. Some include a stop at natural hot springs in the park; others include a developed hot spring at a nearby resort; others only do the park hike. Check the "What\'s included" section before booking. Natural hot springs are usually free/cheap; developed hot springs cost more.' },
      { question: 'Is the park good for birdwatching?', answer: 'Yes — Rincón de la Vieja is one of the better birdwatching spots in Guanacaste\'s interior. Toucans, motmots, parrots, tanagers, and many other species are visible, especially in the early morning. Bring binoculars and a guide who knows the birds (a naturalist guide is worth it for this).' },
    ],

    internalLinks: () => [
      { text: 'Rincón de la Vieja day trip on GetYourGuide', url: '/go/getyourguide/rincon-de-la-vieja-volcano' },
      { text: 'Hot springs and adventure at Blue River Resort', url: '/tours/horseback-riding-guanacaste' },
      { text: 'Zip-lining near the volcano (Hacienda Guachipelin)', url: '/tours/zip-lining-guanacaste' },
      { text: 'Palo Verde birdwatching (another nature day trip)', url: '/tours/palo-verde-birdwatching' },
      { text: 'Liberia — good base for a volcano day', url: '/seo/town/liberia' },
    ],
  },
]

// ---------------------------------------------------------------------------
// Lookups
// ---------------------------------------------------------------------------

export function getSeoPage(type: SeoPageType, slug: string): SeOPage | undefined {
  return SEO_PAGES.find((p) => p.type === type && p.slug === slug)
}

export function getSeoPagesByType(type: SeoPageType): SeOPage[] {
  return SEO_PAGES.filter((p) => p.type === type)
}

export function getAllSeoPages(): SeOPage[] {
  return SEO_PAGES
}
