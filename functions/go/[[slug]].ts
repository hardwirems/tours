/**
 * Cloudflare Pages Function — /go/ affiliate redirect + first-party click tracking.
 *
 * Handles all /go/* paths. Parses the program/tour-slug from the URL path.
 * Supabase credentials are set via wrangler pages secret put (not committed).
 */

import { TRANSFER_URLS } from '../../lib/affiliate-transfers'

interface Env {
  SUPABASE_URL: string
  SUPABASE_ANON_KEY: string
}

// Static URL map — keep in sync with lib/affiliateUrls.ts.
const URL_MAP: Record<string, string> = {
  'viator/surf-lessons-in-tamarindo-costa-rica': 'https://www.viator.com/tours/Tamarindo/Surf-Lessons-in-Tamarindo/d24763-8153P1?mcid=42383&pid=P00318538&medium=api&api_version=2.0',
  'viator/guachipelin-adventure-volcano-zipline-river-tubing-combo': 'https://www.viator.com/tours/Tamarindo/Guachipelin-Adventure-Zipline-Horseback-River-Tubing-Combo/d24763-17279P2?mcid=42383&pid=P00318538&medium=api&api_version=2.0',
  'viator/diamante-eco-adventure-park-day-pass-with-lunch': 'https://www.viator.com/tours/Playa-Hermosa/Adventure-Pass/d24946-32267P1?mcid=42383&pid=P00318538&medium=api&api_version=2.0',
  'viator/rio-celeste-hiking-sloth-sanctuary-llanos-de-cortes-waterfal': 'https://www.viator.com/tours/Tamarindo/Rio-Celeste-and-Llanos-de-Cortes-Waterfall/d24763-17279P13?mcid=42383&pid=P00318538&medium=api&api_version=2.0',
  'viator/sunset-catamaran-snorkeling-tour-in-playa-flamingo': 'https://www.viator.com/tours/Playa-Flamingo/Sailing-Sunset-Tour-in-Playa-Flamingo/d24471-8124P1?mcid=42383&pid=P00318538&medium=api&api_version=2.0',
  'viator/flamingo-guanacaste-all-inclusive-catamaran-snorkel-adventur': 'https://www.viator.com/tours/Playa-Flamingo/All-Inclusive-Nauyaca-Waterfall-Adventure/d24471-57580P9?mcid=42383&pid=P00318538&medium=api&api_version=2.0',
  'viator/blue-dolphin-public-catamaran-tour-tamarindo': 'https://www.viator.com/tours/Tamarindo/Blue-Dolphin-Sailing-Adventure/d24763-31513P2?mcid=42383&pid=P00318538&medium=api&api_version=2.0',
  'viator/sloth-wildlife-experience-coffee-chocolate-waterfall': 'https://www.viator.com/tours/Liberia/Private-Sloth-Forest-Coffee-Chocolate-and-Waterfall-Tour/d22740-438577P2?mcid=42383&pid=P00318538&medium=api&api_version=2.0',
  'viator/atv-or-buggy-guided-tour-from-tamarindo-conchal-or-riu-hotel': 'https://www.viator.com/tours/Tamarindo/Private-Tour-ATV-Adventure-with-Free-Snorkeling/d24763-144991P25?mcid=42383&pid=P00318538&medium=api&api_version=2.0',
  'viator/skip-the-line-diamante-eco-adventure-park-animal-sanctuary-d': 'https://www.viator.com/tours/Playa-Hermosa/Diamante-Eco-Adventure-Park-Animal-Sanctuary-Discovery-Pass/d24946-32267P2?mcid=42383&pid=P00318538&medium=api&api_version=2.0',
  'viator/volcano-hike-waterfall-swim-hot-springs-combo-on-rincon-de-l': 'https://www.viator.com/tours/Tamarindo/Hiking-Tour-of-Rincon-de-la-Vieja-Volcano-National-Park/d24763-17279P1?mcid=42383&pid=P00318538&medium=api&api_version=2.0',
  'viator/surf-lesson-in-tamarindo-stand-up-or-your-money-back': 'https://www.viator.com/tours/Tamarindo/Surf-lessons-in-Tamarindo/d24763-331007P2?mcid=42383&pid=P00318538&medium=api&api_version=2.0',
  'viator/tamarindo-estuary-boat-safari': 'https://www.viator.com/tours/Tamarindo/Tamarindo-Estuary-Boat-Safari/d24763-17279P30?mcid=42383&pid=P00318538&medium=api&api_version=2.0',
  'viator/tropical-rainforest-hanging-bridges-and-jungle-sloths-sanctu': 'https://www.viator.com/tours/Liberia/TROPICAL-RAINFOREST-HANGING-BRIDGES-AND-JUNGLE-SLOTHS-SANCTUARY/d22740-63887P2?mcid=42383&pid=P00318538&medium=api&api_version=2.0',
  'viator/marlin-del-rey-catamaran-tamarindo-playas-del-coco': 'https://www.viator.com/tours/Tamarindo/TAMARINDO/d24763-39790P1?mcid=42383&pid=P00318538&medium=api&api_version=2.0',
  'viator/la-leona-waterfall-adventure-hike-private-tour': 'https://www.viator.com/tours/Guanacaste-and-Northwest/La-Leona-Waterfall-Adventure-Tour/d4137-308289P1?mcid=42383&pid=P00318538&medium=api&api_version=2.0',
  'viator/diamante-adventure-park-ocean-view-zip-line': 'https://www.viator.com/tours/Playa-Hermosa/Aerial-Pass/d24946-32267P3?mcid=42383&pid=P00318538&medium=api&api_version=2.0',
  'viator/nicaragua-full-day-tour-from-costa-rica': 'https://www.viator.com/tours/Tamarindo/Full-Day-Nicaragua-Tour/d24763-17279P6?mcid=42383&pid=P00318538&medium=api&api_version=2.0',
  'viator/explore-day-pass-adventure-relaxation-in-one-day': 'https://www.viator.com/tours/Liberia/Explorer-Pass/d22740-382350P1?mcid=42383&pid=P00318538&medium=api&api_version=2.0',
  'viator/timarouba-catamaran-sunset-cruise-with-open-bar-lunch-snorke': 'https://www.viator.com/tours/Tamarindo/Sailing-Catamaran-Tour/d24763-116726P1?mcid=42383&pid=P00318538&medium=api&api_version=2.0',
  'viator/atv-and-utv-beach-tour-from-tamarindo-flamingo-and-conchal-b': 'https://www.viator.com/tours/Tamarindo/ATV-Beach-Adventure-Tour-in-Tamarindo/d24763-12671P1?mcid=42383&pid=P00318538&medium=api&api_version=2.0',
  'viator/two-tanks-scuba-diving-tour-at-catalina-islands-north-island': 'https://www.viator.com/tours/Playa-Flamingo/Certified-without-equipment/d24471-31262P1?mcid=42383&pid=P00318538&medium=api&api_version=2.0',
  'viator/la-leona-waterfall-hike': 'https://www.viator.com/tours/Guanacaste-and-Northwest/La-Leona-Waterfall-Hike/d4137-278999P6?mcid=42383&pid=P00318538&medium=api&api_version=2.0',
  'viator/palo-verde-boat-tours-ortega': 'https://www.viator.com/tours/Guanacaste-and-Northwest/PALO-VERDE-BOAT-TOURS-ORTEGA-A-family-run-business/d4137-112389P2?mcid=42383&pid=P00318538&medium=api&api_version=2.0',
  'viator/best-surf-lessons-in-tamarindo-and-surf-funcional-surf-skate': 'https://www.viator.com/tours/Tamarindo/No1-Surf-School-in-Tamarindo-Lessons-Surfskate-Surfers-apnea-Ginastica-Natural/d24763-316753P1?mcid=42383&pid=P00318538&medium=api&api_version=2.0',
  'viator/atv-beach-and-mountain-tour': 'https://www.viator.com/tours/Playa-Flamingo/ATV-2-Hours-Beach-and-Mountain-Tour/d24471-107293P2?mcid=42383&pid=P00318538&medium=api&api_version=2.0',
  'viator/catamaran-snorkeling-sunset-sailing-tour': 'https://www.viator.com/tours/Playa-Hermosa/Playas-del-Coco/d24946-39790P2?mcid=42383&pid=P00318538&medium=api&api_version=2.0',
  'viator/fundive-catalina-islands-2-dives-only-for-certified-divers': 'https://www.viator.com/tours/Tamarindo/FunDive-Catalina-Islands/d24763-112293P1?mcid=42383&pid=P00318538&medium=api&api_version=2.0',
  'viator/guanacaste-zipline-safe-fun-for-kids-2-families': 'https://www.viator.com/tours/Tamarindo/Skyline-Canopy-Tour/d24763-332292P1?mcid=42383&pid=P00318538&medium=api&api_version=2.0',
  'viator/jet-ski-guided-tour-in-playa-conchal': 'https://www.viator.com/tours/Playa-Flamingo/JET-SKI-guided-tour/d24471-72547P2?mcid=42383&pid=P00318538&medium=api&api_version=2.0',
  'viator/catamaran-snorkel-sunset-cruise-from-tamarindo-or-playas-del': 'https://www.viator.com/tours/Tamarindo/Marlin-del-Rey-Catamaran-Snorkel-Sunset-Cruise-from-Tamarindo/d24763-17279P28?mcid=42383&pid=P00318538&medium=api&api_version=2.0',
  'viator/rain-forest-canopy-tour-from-tamarindo-zipline-hanging-bridg': 'https://www.viator.com/tours/Tamarindo/pinilla-canopy-tour/d24763-60079P1?mcid=42383&pid=P00318538&medium=api&api_version=2.0',
  'viator/palo-verde-boat-safari-coffee-culture-wildlife-flavor': 'https://www.viator.com/tours/Guanacaste-and-Northwest/PALO-VERDE-NATIONAL-PARK-RIVER-SAFARI/d4137-63887P3?mcid=42383&pid=P00318538&medium=api&api_version=2.0',
  'viator/la-fortuna-atv-adventure-with-mud-mask-and-arenal-volcano-vi': 'https://www.viator.com/tours/La-Fortuna/La-Fortuna-ATV-Adventure-with-Mud-Mask-and-Arenal-Volcano-Views/d821-20933P6?mcid=42383&pid=P00318538&medium=api&api_version=2.0',
  'viator/jungle-and-beach-horseback-riding-tour-2h-1-2': 'https://www.viator.com/tours/Samara/Horseriding-Mountain-and-Beach-Tour/d24505-152473P1?mcid=42383&pid=P00318538&medium=api&api_version=2.0',
  'viator/flamingo-family-fun-catamaran-snorkel-comfortable-shaded-sea': 'https://www.viator.com/tours/Playa-Flamingo/Full-Day-Chasing-Waterfalls-Off-the-Beaten-Path/d24471-57580P7?mcid=42383&pid=P00318538&medium=api&api_version=2.0',
  'viator/tamarindo-estuary-tour': 'https://www.viator.com/tours/Tamarindo/Tamarindo-Estuary-Tours-by-Discover-Tamarindo-Travel-Agency/d24763-344882P1?mcid=42383&pid=P00318538&medium=api&api_version=2.0',
  'viator/zipline-monkey-jungle-family-canopy-tour-in-tamarindo': 'https://www.viator.com/tours/Tamarindo/Monkey-Jungle-Zipline-in-Costa-Rica/d24763-57496P1?mcid=42383&pid=P00318538&medium=api&api_version=2.0',
  'viator/adventure-in-volcano-combo-tour-zip-line-waterfall-hot-sprin': 'https://www.viator.com/tours/Liberia/Adventure-in-Volcano-Combo-Tour-Zip-Line-Waterfall-Hot-Springs-and-more/d22740-259166P1?mcid=42383&pid=P00318538&medium=api&api_version=2.0',
  'viator/guachipelin-zipline-river-tubing-horseback-ride-hot-springs-': 'https://www.viator.com/tours/Playa-Hermosa/Rincon-de-la-Vieja-National-Park-One-Day-Adventure-Pass/d24946-15501P1?mcid=42383&pid=P00318538&medium=api&api_version=2.0',
  'viator/frogs-sloths-waterfall-coffee-and-chocolate-tour': 'https://www.viator.com/tours/Playa-Flamingo/Palo-Verde-Combo-rum-tour-class-rum-cultural-tour-and-Philadelphia-town/d24471-246744P5?mcid=42383&pid=P00318538&medium=api&api_version=2.0',
  'viator/volcano-waterfall-and-hot-springs-private-tour': 'https://www.viator.com/tours/Playa-Flamingo/Palo-Verde-River-Cruice/d24471-115542P1?mcid=42383&pid=P00318538&medium=api&api_version=2.0',
  'viator/1-5-hours-private-horseback-riding-tour-in-playa-conchal': 'https://www.viator.com/tours/Playa-Flamingo/Horseback-riding-Tour/d24471-263594P1?mcid=42383&pid=P00318538&medium=api&api_version=2.0',
  'viator/surf-lessons-for-the-whole-family-in-playa-samara': 'https://www.viator.com/tours/Samara/Surf-Lessons/d24505-5533548P1?mcid=42383&pid=P00318538&medium=api&api_version=2.0',
  'viator/nature-day-pass-thermals-cultural-tour-in-costa-rica': 'https://www.viator.com/tours/Liberia/Nature-Pass/d22740-382350P2?mcid=42383&pid=P00318538&medium=api&api_version=2.0',
  'viator/playa-grande-surf-lessons-on-a-secluded-beach': 'https://www.viator.com/tours/Playa-Flamingo/Playa-Grande-Surf-Lessons-on-a-Secluded-Beach/d24471-188392P1?mcid=42383&pid=P00318538&medium=api&api_version=2.0',
  'viator/try-scuba-diving-basic-diver': 'https://www.viator.com/tours/Tamarindo/Discover-Scuba-Diving/d24763-112293P2?mcid=42383&pid=P00318538&medium=api&api_version=2.0',
  'viator/scuba-diving-for-non-certified-divers-at-catalina-islands-no': 'https://www.viator.com/tours/Playa-Flamingo/Discover-Scuba-Diving/d24471-31262P2?mcid=42383&pid=P00318538&medium=api&api_version=2.0',
  'viator/snorkeling-at-catalina-islands-north-island-cr': 'https://www.viator.com/tours/Playa-Flamingo/Certified-without-equipment/d24471-31262P3?mcid=42383&pid=P00318538&medium=api&api_version=2.0',
  'viator/rio-celeste-combo-river-tubing-blue-waterfall-exotic-wildlif': 'https://www.viator.com/tours/Alajuela/Rain-Forest-Waterfall-Active-Volcanoes-Local-Style-Lunch-Tubing-Wild-Life/d50231-167483P5?mcid=42383&pid=P00318538&medium=api&api_version=2.0',
  'viator/small-group-sunset-sail-for-the-sophisticated-traveler': 'https://www.viator.com/tours/Playa-Flamingo/Small-Group-Sunset-Sail-from-Flamingo-Marina/d24471-47502P1?mcid=42383&pid=P00318538&medium=api&api_version=2.0',
  'viator/sunday-funday-tamarindo-party-bus-beach-and-pool-crawl': 'https://www.viator.com/tours/Tamarindo/Beach-and-Pool-Crawl-Sunday-Funday/d24763-118421P1?mcid=42383&pid=P00318538&medium=api&api_version=2.0',
  'viator/night-turtle-nesting-tour-from-tamarindo': 'https://www.viator.com/tours/Tamarindo/Turtle-Nesting-Tour/d24763-17279P11?mcid=42383&pid=P00318538&medium=api&api_version=2.0',
  'viator/arenal-volcano-magic-of-nature': 'https://www.viator.com/tours/Liberia/Arenal-Volcano-and-Hot-Springs-Day-Trip-from-Guanacaste/d22740-5766ARENAL?mcid=42383&pid=P00318538&medium=api&api_version=2.0',
  'viator/turtle-watching-night-tours-with-expert-naturalist': 'https://www.viator.com/tours/Tamarindo/Turtle-watching-night-tours-with-Expert-Naturalist/d24763-344882P2?mcid=42383&pid=P00318538&medium=api&api_version=2.0',
  'viator/horseback-riding-to-conchal-beach-from-tamarindo-flamingo': 'https://www.viator.com/tours/Playa-Flamingo/Horseback-Riding-in-Tamarindo/d24471-17279P31?mcid=42383&pid=P00318538&medium=api&api_version=2.0',
  'viator/whitewater-rafting-class-iii-and-iv': 'https://www.viator.com/tours/Tamarindo/Whitewater-Rafting-Class-III-and-IV/d24763-17279P12?mcid=42383&pid=P00318538&medium=api&api_version=2.0',
  'viator/5-hour-guided-sunset-boat-tour-in-tamarindo-costa-rica': 'https://www.viator.com/tours/Tamarindo/Sunset-Tour/d24763-368946P1?mcid=42383&pid=P00318538&medium=api&api_version=2.0',
  'viator/adventure-combo-tour-horses-tubing-zipline-hot-springs': 'https://www.viator.com/tours/Liberia/ADRENALINE-ONE-DAY-COMBO-TOUR/d22740-63887P1?mcid=42383&pid=P00318538&medium=api&api_version=2.0',
  'viator/zip-line-and-atv-adventure': 'https://www.viator.com/tours/Playa-Flamingo/Zip-Line-ATV-Adventure/d24471-107293P5?mcid=42383&pid=P00318538&medium=api&api_version=2.0',
  'viator/bioluminescent-kayak-tour': 'https://www.viator.com/tours/Santa-Teresa/Bioluminescent-kayak-tour/d25896-148182P1?mcid=42383&pid=P00318538&medium=api&api_version=2.0',
  'viator/surf-lessons-in-santa-teresa-costa-rica': 'https://www.viator.com/tours/Santa-Teresa/Surf-Classes-in-Santa-Teresa-Costa-Rica/d25896-285755P1?mcid=42383&pid=P00318538&medium=api&api_version=2.0',
  'viator/isla-tortuga-snorkeling-tour': 'https://www.viator.com/tours/Santa-Teresa/Isla-Tortuga-Snorkeling-Tour/d25896-248571P1?mcid=42383&pid=P00318538&medium=api&api_version=2.0',
  'viator/eddy-s-bioluminescence-reserve-in-punta-cuchillos': 'https://www.viator.com/tours/Santa-Teresa/Eddys-Bioluminescence-Reserve-in-Punta-Cuchillos/d25896-449017P1?mcid=42383&pid=P00318538&medium=api&api_version=2.0',
  'viator/specialized-group-surf-lesson-in-playa-hermosa': 'https://www.viator.com/tours/Santa-Teresa/Specialize-in-private-and-group-surf-lesson-all-ages-to-achieve-their-surf-goals/d25896-345400P1?mcid=42383&pid=P00318538&medium=api&api_version=2.0',
  'viator/isla-tortuga-boat-tour-from-paquera': 'https://www.viator.com/tours/Santa-Teresa/Isla-Tortuga-boat-tour-from-Paquera/d25896-148182P4?mcid=42383&pid=P00318538&medium=api&api_version=2.0',
  'viator/inshore-fishing-trip-in-santa-teresa': 'https://www.viator.com/tours/Santa-Teresa/Inshore-Fishing-trip/d25896-148017P3?mcid=42383&pid=P00318538&medium=api&api_version=2.0',
  'viator/sunset-bioluminescence-tour-by-boat': 'https://www.viator.com/tours/Santa-Teresa/Bioluminescence-Tour-by-Boat/d25896-248571P2?mcid=42383&pid=P00318538&medium=api&api_version=2.0',
  'viator/private-nature-adventure-tour-in-curu-wildlife-refuge': 'https://www.viator.com/tours/Santa-Teresa/Nature-and-Adventure-Tours/d25896-290184P1?mcid=42383&pid=P00318538&medium=api&api_version=2.0',
  'viator/private-surf-lessons-in-santa-teresa-beach': 'https://www.viator.com/tours/Santa-Teresa/Surf-lessons-in-Santa-Teresa-Costa-Rica/d25896-283312P2?mcid=42383&pid=P00318538&medium=api&api_version=2.0',
  'viator/volcano-combo-7-activities-in-1-day-natural-hot-springs': 'https://www.viator.com/tours/Playa-Flamingo/Horse-Back-Ridding-Blue-Zone-Adventures/d24471-167483P2?mcid=42383&pid=P00318538&medium=api&api_version=2.0',
  'viator/double-kayak-bioluminescence-tour-in-costa-rica': 'https://www.viator.com/tours/Santa-Teresa/Bioluminescence-Costa-Rica-Kayak/d25896-439152P1?mcid=42383&pid=P00318538&medium=api&api_version=2.0',
  'viator/2-hour-cooking-class-in-nosara': 'https://www.viator.com/tours/Guanacaste-and-Northwest/Cooking-Class-Nosara/d4137-12541P27?mcid=42383&pid=P00318538&medium=api&api_version=2.0',
  'viator/half-day-mountain-tour-in-nosara': 'https://www.viator.com/tours/Guanacaste-and-Northwest/Naranjal-Coffee-Mountain-Tour/d4137-331349P1?mcid=42383&pid=P00318538&medium=api&api_version=2.0',
  'viator/discover-the-magic-of-nosara-cycling-tour': 'https://www.viator.com/tours/Guanacaste-and-Northwest/Bamboo-Rides-Nosara-Cycling-TOURS/d4137-389530P1?mcid=42383&pid=P00318538&medium=api&api_version=2.0',
  'viator/hiking-and-birdwatching-nosara': 'https://www.viator.com/tours/Guanacaste-and-Northwest/Hiking-Tours-Nosara/d4137-444953P1?mcid=42383&pid=P00318538&medium=api&api_version=2.0',
  'viator/waterfall-rappelling-nosara': 'https://www.viator.com/tours/Guanacaste-and-Northwest/Waterfall-Rappelling-Nosara/d4137-12541P24?mcid=42383&pid=P00318538&medium=api&api_version=2.0',
  'viator/small-group-safari-float-in-nosara-river': 'https://www.viator.com/tours/Guanacaste-and-Northwest/Safari-Float-Nosara-River/d4137-12541P25?mcid=42383&pid=P00318538&medium=api&api_version=2.0',
  'viator/2-hour-surf-lesson-in-montezuma': 'https://www.viator.com/tours/Puntarenas/Unforgettable-surf-lesson-in-Montezuma/d4506-126683P9?mcid=42383&pid=P00318538&medium=api&api_version=2.0',
  'viator/half-day-surf-and-adventure-in-montezuma': 'https://www.viator.com/tours/Puntarenas/Beginner-Surfing-Classes-in-Montezuma/d4506-46028P1?mcid=42383&pid=P00318538&medium=api&api_version=2.0',
  'viator/three-days-of-group-surf-lessons-in-montezuma': 'https://www.viator.com/tours/Puntarenas/Three-surf-lessons-pack-in-Montezuma/d4506-46028P4?mcid=42383&pid=P00318538&medium=api&api_version=2.0',
}

function resolveUrl(slug: string): string | null {
  // Tours live in the inline URL_MAP; transportation transfers/rentals are
  // generated into lib/affiliate-transfers.ts by scripts/sync-transfers.mjs.
  return URL_MAP[slug] ?? TRANSFER_URLS[slug] ?? null
}

/**
 * Viator `campaign` code naming the page that sent the click, so bookings in the
 * Viator partner reports can be tied back to it (e.g. "blog-best-catamaran-tours-guanacaste").
 * Viator's attribution docs allow only letters, numbers and dashes in this value
 * (partnerresources.viator.com, checked 2026-09-15). pid, mcid and medium are
 * never modified — changing those breaks payouts.
 */
function campaignFor(sourcePath: string | null): string {
  const clean = (s: string) =>
    s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+/, '').slice(0, 60).replace(/-+$/, '')
  if (sourcePath == null) return 'direct'
  const parts = sourcePath.split('/').filter(Boolean)
  if (parts.length === 0) return 'home'
  const [section, ...rest] = parts
  switch (section) {
    case 'tours': return rest.length ? 'tour-page' : 'tours-index'
    case 'blog': return clean(rest.length ? `blog-${rest.join('-')}` : 'blog-index')
    case 'destinations': return clean(rest.length ? `dest-${rest.join('-')}` : 'destinations-index')
    case 'categories': return clean(`cat-${rest.join('-')}`) || 'categories'
    case 'transportation': return clean(`transport-${rest.join('-')}`) || 'transport'
    default: return clean(section) || 'other'
  }
}

function withCampaign(url: string, campaign: string): string {
  try {
    const u = new URL(url)
    if (!u.searchParams.has('campaign')) u.searchParams.set('campaign', campaign)
    return u.toString()
  } catch {
    return url
  }
}

async function recordClick(
  slug: string,
  sourcePage: string | null,
  sessionId: string | null,
  userAgent: string | null,
  env: Env
): Promise<void> {
  const supabaseUrl = env.SUPABASE_URL
  const key = env.SUPABASE_ANON_KEY
  if (!supabaseUrl || !key) return
  const response = await fetch(`${supabaseUrl}/rest/v1/clicks`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': key,
      'Authorization': `Bearer ${key}`,
      'Prefer': 'return=minimal',
    },
    body: JSON.stringify({
      slug,
      source_page: sourcePage ?? null,
      session_id: sessionId ?? null,
      user_agent: userAgent ?? null,
      country: null,
      ip_hash: null,
      created_at: new Date().toISOString(),
    }),
  })
  if (!response.ok) {
    const text = await response.text()
    throw new Error(`Supabase insert failed (${response.status}): ${text}`)
  }
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const url = new URL(context.request.url)
  const pathAfterGo = url.pathname.slice('/go/'.length) // e.g. "getyourguide/zip-lining-guanacaste"
  const slug = pathAfterGo || ''

  if (!slug || !slug.includes('/')) {
    return new Response(
      JSON.stringify({ error: 'Invalid slug. Use /go/program/tour-slug' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    )
  }

  const redirectUrl = resolveUrl(slug)
  if (!redirectUrl) {
    return new Response(
      JSON.stringify({ error: `No mapping found for /go/${slug}` }),
      { status: 404, headers: { 'Content-Type': 'application/json' } }
    )
  }

  // --- capture context ---
  const rawReferer = context.request.headers.get('referer') ?? context.request.headers.get('referrer') ?? ''
  const sourcePage =
    url.searchParams.get('source') ??
    (rawReferer.startsWith(url.origin)
      ? new URL(rawReferer).pathname
      : null)

  const cookieHeader = context.request.headers.get('cookie') ?? ''
  const sid = cookieHeader
    .split(';')
    .map((c) => c.trim().split('='))
    .reduce<string | undefined>(
      (found, parts) =>
        found ??
        (parts[0] === '__secure_guanacaste_sid' || parts[0] === 'guanacaste_sid'
          ? parts.slice(1).join('=')
          : undefined),
      undefined
    )
  const sessionId = sid ?? null
  const userAgent = context.request.headers.get('user-agent') ?? null

  // Record the click BEFORE redirecting — first-party attribution that survives
  // Safari ITP and ad-blockers. Awaiting guarantees the INSERT completes.
  try {
    await recordClick(slug, sourcePage, sessionId, userAgent, context.env)
  } catch (err) {
    console.error('Click tracking failed:', err)
  }

  // No cookie is set here: a 30-day `guanacaste_go` cookie used to be written on
  // every click but nothing ever read it, so it was a consent liability with no use.
  return new Response(null, {
    status: 302,
    headers: {
      Location: withCampaign(redirectUrl, campaignFor(sourcePage)),
      'Cache-Control': 'no-store',
    },
  })
}
