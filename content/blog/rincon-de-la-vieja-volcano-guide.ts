import type { BlogPost } from '../../lib/blog';

export const post: BlogPost = {
  slug: 'rincon-de-la-vieja-volcano-guide',
  title: 'Rincón de la Vieja: A Practical Guide to the Volcano, Waterfalls & Hot Springs',
  metaTitle: 'Rincón de la Vieja Guide — Volcano, Waterfalls & Hot Springs',
  description:
    'How to visit Rincón de la Vieja in Guanacaste: the national park’s trails, mud pots and waterfalls, plus the adjacent ranches with ziplines and hot springs.',
  category: 'Activities',
  tags: ['rincon de la vieja', 'national park', 'volcano', 'hot springs', 'waterfalls', 'hiking'],
  primaryQuery: 'rincon de la vieja guide',
  intent: 'Help a traveler understand what Rincón de la Vieja offers and decide how to visit it.',
  author: { name: 'Guanacaste Experiences editorial team', role: 'Travel editors' },
  published: '2026-09-13',
  reviewBy: '2027-03-01',
  draft: false,
  hero: {
    src: '/images/blog/rincon-de-la-vieja-waterfall.webp',
    alt: 'A waterfall dropping through dense green forest in Guanacaste, Costa Rica',
    width: 2400, height: 1599,
    credit: {
      source: 'Pexels', sourceUrl: 'https://www.pexels.com/photo/a-waterfall-in-the-forest-10614098/',
      author: 'Mariam', license: 'Pexels License', licenseUrl: 'https://www.pexels.com/license/',
      downloaded: '2026-09-13', attributionRequired: false,
      depicts: 'A waterfall in forest in Guanacaste, Costa Rica (representative of the region’s waterfall trails; not identified as a specific named fall).',
    },
  },
  excerpt:
    'Rincón de la Vieja is two experiences in one area: a national park of forest, mud pots and waterfalls, and the adventure ranches next door. Here’s how they differ and how to plan.',
  cta: { label: 'See Rincón volcano & adventure tours', href: '/tours?category=adventure' },
  relatedTours: ['volcano-hike-waterfall-swim-hot-springs-combo-on-rincon-de-l', 'guachipelin-adventure-volcano-zipline-river-tubing-combo', 'adventure-in-volcano-combo-tour-zip-line-waterfall-hot-sprin'],
  relatedDestinations: ['liberia'],
  relatedPosts: ['best-time-to-visit-guanacaste'],
  sources: [
    { title: 'SINAC — Parque Nacional Rincón de la Vieja', url: 'https://www.sinac.go.cr/ES/ac/acg/pnrv/Paginas/default.aspx', accessed: '2026-09-13', supports: 'The national park’s status, sectors (Las Pailas and Santa María), volcanic features (fumaroles, boiling mud pots) and that trails and the summit can close for volcanic or safety reasons.' },
    { title: 'SINAC — Área de Conservación Guanacaste', url: 'https://www.sinac.go.cr/', accessed: '2026-09-13', supports: 'That Rincón de la Vieja sits within Costa Rica’s protected-area system, with entry, hours and access managed by SINAC.' },
    { title: 'Instituto Costarricense de Turismo — Visit Costa Rica', url: 'https://www.visitcostarica.com/en', accessed: '2026-09-13', supports: 'General visitor context for the Guanacaste/Liberia area as a base for Rincón de la Vieja.' },
  ],
  body: [
    { type: 'p', text: 'Rincón de la Vieja is often sold as a single “volcano and hot springs” day, but it’s really two different experiences sharing one corner of Guanacaste. There’s the **national park** — forest trails, steaming fumaroles, boiling mud pots and waterfalls, managed by [SINAC](https://www.sinac.go.cr/). And there are the **private adventure ranches** just outside it, where the ziplines, river tubing, horseback rides and hot-spring-and-mud-mask afternoons actually happen. Knowing which is which is the difference between a good plan and a confusing one.' },
    { type: 'callout', variant: 'note', title: 'The key thing to understand', text: 'The famous hot springs and mud baths are **not inside** the national park — they’re at private operators next to it (names like Guachipelín, Rio Negro and Blue River). The park itself is for hiking, wildlife and volcanic features. Most combo tours pair a ranch’s activities with the scenery; a park visit is a separate, quieter outing.' },

    { type: 'h2', text: 'The national park: what you actually see' },
    { type: 'p', text: 'The park protects an active volcano and a large stretch of tropical dry forest that climbs into cloud forest higher up. Wildlife is genuinely good here — birds, howler and white-faced monkeys, coatis and, if you’re lucky, more. It has two main visitor sectors:' },
    { type: 'ul', items: [
      '**Las Pailas** — the main sector. A gentle loop passes the park’s volcanic showpieces: bubbling mud pots (*pailas*), fumaroles venting steam, and warm, hissing ground. Longer trails branch off to waterfalls.',
      '**Santa María** — quieter, more forested, with its own trails and warm springs. Good if you want to avoid the crowds at Las Pailas.',
    ] },
    { type: 'h3', text: 'The waterfall hikes' },
    { type: 'p', text: 'From Las Pailas, two waterfall trails are the big draw. **La Cangreja** is the taller, more committing hike — several hours round trip through changing forest to a slim fall and a pool. The **Escondidas / Oropéndola** falls are shorter and easier. Both reward an early start, both are more dramatic in the green season when there’s real water moving.' },
    { type: 'callout', variant: 'warning', title: 'Check before you go', text: 'This is an active volcano. The summit crater trail is frequently closed for volcanic activity, and individual trails or the whole park can shut on short notice. Entry, hours and fees are set by SINAC and change — confirm current conditions on the [SINAC site](https://www.sinac.go.cr/) or with your operator before committing your day.' },

    { type: 'h2', text: 'The adventure ranches: ziplines, tubing and hot springs' },
    { type: 'p', text: 'Right next to the park, several private ranches have built out the activities most people picture when they hear “Rincón de la Vieja.” A typical day strings together a zipline canopy course, river tubing, a horseback ride, and a soak in naturally warm pools finished with a volcanic-mud mask. It’s a well-run, family-friendly formula, and it’s the easiest way to combine adrenaline and relaxation in one trip. These are the [adventure combos](/tours?category=adventure) you’ll see sold out of the beach towns.' },
    {
      type: 'table',
      caption: 'National park vs. adventure ranches — two different days.',
      headers: ['', 'National park (SINAC)', 'Adventure ranches (private)'],
      rows: [
        ['Best for', 'Hiking, wildlife, volcanic features', 'Ziplines, tubing, horseback, hot springs'],
        ['Pace', 'Self-guided or guided walking', 'Guided, activity-packed'],
        ['Hot springs / mud', 'No developed hot-spring facilities', 'Yes — warm pools and mud masks'],
        ['Who it suits', 'Hikers, nature-first travelers', 'Families, first-timers, mixed groups'],
        ['Book ahead', 'Check SINAC access/closures', 'Book the combo; most include pickup'],
      ],
    },

    { type: 'h2', text: 'How to visit' },
    { type: 'p', text: 'Rincón sits inland from the northern beaches, above Liberia. Most travelers base in [Liberia](/destinations/liberia) or on the coast and come up for the day. You have two clean options:' },
    { type: 'ol', items: [
      '**Book a combo tour.** The simplest route to the ziplines-and-hot-springs day. Transport, guides and lunch are usually handled, and many include hotel pickup from the beach towns — worth it given the drive and the unpaved final stretch.',
      '**Visit the park independently.** Rent a car (a higher-clearance vehicle is wise for the access road), arrive early, and check SINAC conditions first. Best if hiking and wildlife are your priority and you’re comfortable driving rougher roads.',
    ] },
    { type: 'p', text: 'If your main goal is the volcanic scenery and a forest hike, the park is the answer. If you want a full day of activity capped by a warm soak, the ranch combos deliver that better. Plenty of people do one of each on a longer trip.' },
    { type: 'cta', label: 'Compare Rincón adventure tours', href: '/tours?category=adventure', note: 'Volcano combos with ziplining, tubing and hot springs — many include hotel pickup.' },

    { type: 'h2', text: 'What to bring' },
    { type: 'ul', items: [
      'Closed shoes with grip — trails are uneven and can be muddy.',
      'Water and sun protection; shade is patchy on the Las Pailas loop.',
      'A swimsuit and towel if your day includes hot springs.',
      'A light rain layer in the green season, and cash for park entry in case cards aren’t accepted.',
    ] },

    { type: 'h2', text: 'Frequently asked questions' },
    { type: 'faq', items: [
      { q: 'Are the hot springs inside Rincón de la Vieja National Park?', a: 'No. The developed hot springs and mud baths are at private ranches adjacent to the park, not inside it. The SINAC park is for hiking, wildlife and volcanic features like mud pots and fumaroles.' },
      { q: 'Can you hike to the summit / crater?', a: 'Often not. The summit trail is frequently closed because Rincón de la Vieja is an active volcano. Always confirm current access with SINAC before planning a summit attempt.' },
      { q: 'Is it better to do a tour or go independently?', a: 'A combo tour is easier if you want the ziplines-and-hot-springs day and don’t want to drive the access road. Going independently suits hikers focused on the park’s trails and wildlife.' },
      { q: 'When is the best time to go?', a: 'The waterfalls are fuller and the forest greener in the May–November green season; the dry season offers more reliable weather for the drive and the hike. See our guide to the [best time to visit Guanacaste](/blog/best-time-to-visit-guanacaste).' },
    ] },
  ],
};
