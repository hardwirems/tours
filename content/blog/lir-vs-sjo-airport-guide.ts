import type { BlogPost } from '../../lib/blog';

export const post: BlogPost = {
  slug: 'lir-vs-sjo-airport-guide',
  title: 'Which Airport for Guanacaste? LIR vs. SJO, Destination by Destination',
  metaTitle: 'LIR vs SJO — Which Airport for Guanacaste?',
  description:
    'Should you fly into Liberia (LIR) or San José (SJO) for Guanacaste? A clear decision guide with approximate drive times from both airports to every major beach.',
  category: 'Practical',
  tags: ['liberia airport', 'lir', 'sjo', 'san jose airport', 'airport transfers', 'trip planning'],
  primaryQuery: 'lir vs sjo airport guanacaste',
  intent: 'Help a traveler choose between Liberia (LIR) and San José (SJO) airports for a Guanacaste trip.',
  author: { name: 'Guanacaste Experiences editorial team', role: 'Travel editors' },
  published: '2026-09-14',
  reviewBy: '2027-03-01',
  draft: false,
  hero: {
    src: '/images/blog/getting-around-guanacaste-street.webp',
    alt: 'A quiet palm-lined road with a mountain in the distance, Guanacaste, Costa Rica',
    width: 1400, height: 875, focal: '50% 55%',
    credit: {
      source: 'Pexels', sourceUrl: 'https://www.pexels.com/photo/palm-tree-by-street-in-town-17302420/',
      author: 'Jean-Daniel Francoeur', license: 'Pexels License', licenseUrl: 'https://www.pexels.com/license/',
      downloaded: '2026-09-13', attributionRequired: false,
      depicts: 'A palm-lined town street with a mountain view in Costa Rica.',
    },
  },
  excerpt:
    'Two airports serve a Costa Rica trip, and for Guanacaste the choice is usually clear. Here’s which one fits each beach — with honest, approximate drive times from both.',
  cta: { label: 'See Liberia (LIR) airport transfers', href: '/transportation/airport-transfers/lir' },
  relatedTours: [],
  relatedDestinations: ['tamarindo', 'playa-flamingo', 'playa-hermosa', 'liberia'],
  relatedPosts: ['getting-around-guanacaste-transport', 'best-time-to-visit-guanacaste'],
  sources: [
    { title: 'Instituto Costarricense de Turismo — Visit Costa Rica (how to get around)', url: 'https://www.visitcostarica.com/en/costa-rica/planning-your-trip/how-to-get-around', accessed: '2026-09-14', supports: 'That Costa Rica has two main international airports (San José/SJO and Liberia/LIR) and that Liberia serves the Guanacaste/North Pacific region.' },
    { title: 'Aeropuerto Internacional Daniel Oduber Quirós (LIR), Liberia', url: 'https://www.liberiacostaricaairport.net/', accessed: '2026-09-14', supports: 'That Liberia (LIR) is the international gateway for Guanacaste’s beaches, closer than San José (SJO).' },
    { title: 'SINAC — Área de Conservación Guanacaste', url: 'https://www.sinac.go.cr/', accessed: '2026-09-14', supports: 'Geographic context for Guanacaste destinations and protected areas referenced in the drive-time table.' },
  ],
  body: [
    { type: 'p', text: 'If your trip is built around Guanacaste’s beaches, the short answer is **fly into Liberia (LIR)**. Costa Rica has two international airports — San José (SJO) in the Central Valley and Liberia (LIR) in the northwest — and for almost every Guanacaste destination, Liberia is far closer. Flying into San José instead can add four to five hours of driving on arrival day.' },
    { type: 'callout', variant: 'note', title: 'The one-line rule', text: 'Beaches in Guanacaste → **Liberia (LIR)**. A trip that also centres on the Central Valley, Arenal from the south, or the Caribbean → consider **San José (SJO)**. When in doubt, LIR saves you the most time.' },

    { type: 'h2', text: 'Drive times from each airport, destination by destination' },
    { type: 'p', text: 'These are **approximate ranges** for planning only — real times depend on traffic, weather, road works and your exact hotel, and the last stretch to some beaches is unpaved. Treat the duration shown on your specific transfer’s booking page as the reliable figure, and confirm with your operator.' },
    {
      type: 'table',
      caption: 'Approximate driving time to Guanacaste destinations from Liberia (LIR) vs. San José (SJO). Ranges, not exact times.',
      headers: ['Destination', 'From LIR', 'From SJO', 'Practical airport'],
      rows: [
        ['Playas del Coco, Hermosa & Papagayo', '≈25–45 min', '≈4½–5 hr', 'LIR'],
        ['Playa Flamingo, Potrero, Brasilito & Conchal', '≈1–1¼ hr', '≈4½–5 hr', 'LIR'],
        ['Tamarindo, Langosta & Playa Grande', '≈1–1½ hr', '≈4½–5½ hr', 'LIR'],
        ['Nosara', '≈2–2½ hr', '≈4½–5½ hr', 'LIR'],
        ['Sámara & Carrillo', '≈2–2½ hr', '≈4½–5 hr', 'LIR'],
        ['Liberia (city)', '≈15–20 min', '≈4 hr', 'LIR'],
        ['La Fortuna / Arenal', '≈2¾–3½ hr', '≈3–3½ hr', 'Either'],
      ],
    },
    { type: 'p', text: 'The pattern is consistent: for the Guanacaste coast, Liberia wins on every route, often by three to four hours. The single place where the two airports are comparable is **La Fortuna (Arenal)**, which sits inland — useful to know if you’re combining the volcano with the beach.' },

    { type: 'h2', text: 'When San José (SJO) still makes sense' },
    { type: 'ul', items: [
      'Your itinerary also covers the **Central Valley** (San José, coffee country, Poás/Irazú) or the **Caribbean** coast.',
      'You’re approaching **Arenal/La Fortuna** first and looping to the beach afterward.',
      'Flight **schedules or fares** into SJO are dramatically better for your dates.',
      'You’re renting a car and plan to **explore several regions** anyway, so a long first drive is part of the plan.',
    ] },
    { type: 'p', text: 'If you do land at SJO but your destination is the coast, the two realistic options are a **private long-distance transfer** or a **domestic flight** on to Liberia. We keep an honest note on this in our [San José to Guanacaste guide](/transportation/airport-transfers/sjo).' },

    { type: 'h2', text: 'How to choose, by trip type' },
    { type: 'h3', text: 'Families and first-timers' },
    { type: 'p', text: 'Choose **LIR**. A shorter drive after a long flight — often under 90 minutes to the popular beaches — is worth a lot with children. If you need a car seat, ask your transfer operator when you book and reconfirm; availability varies and is never guaranteed. See our [Liberia airport transfers](/transportation/airport-transfers/lir) for private, door-to-door options.' },
    { type: 'h3', text: 'Budget and flexibility' },
    { type: 'p', text: 'Fares sometimes favour SJO, but weigh any saving against four-plus extra hours of driving (and possibly an overnight near San José). For a beach-only trip, the time cost usually outweighs a modest fare difference.' },
    { type: 'h3', text: 'Multi-region road trips' },
    { type: 'p', text: 'If you’re circling the country by rental car, an **open-jaw** itinerary — into one airport, out of the other — can save backtracking. Our guide to [getting around Guanacaste](/blog/getting-around-guanacaste-transport) walks through rental cars, shuttles and when you can skip a car.' },

    { type: 'h2', text: 'A few practical notes for arrival day' },
    { type: 'ul', items: [
      'Book airport transport **before you travel**, especially for arrival day and during the busy December–April dry season.',
      'Have your **hotel or villa name and address** ready — private drivers meet you in arrivals with a sign.',
      'Ask about **luggage** allowance if you’re bringing surfboards, golf clubs or extra bags.',
      'Most private operators track flights and adjust for **delays**, but wait-time policies differ — confirm before you book.',
    ] },
    { type: 'cta', label: 'Compare Liberia (LIR) airport transfers', href: '/transportation/airport-transfers/lir', note: 'Private, door-to-door transfers to Tamarindo, Papagayo, Flamingo and more — booked through Viator.' },

    { type: 'h2', text: 'Frequently asked questions' },
    { type: 'faq', items: [
      { q: 'Is Liberia (LIR) or San José (SJO) closer to Tamarindo?', a: 'Liberia, by a wide margin — roughly 1 to 1½ hours from LIR versus about 4½ to 5½ hours from SJO. For a Tamarindo trip, LIR is the practical choice.' },
      { q: 'How far is Liberia Airport from the Papagayo/Coco beaches?', a: 'Very close — approximately 25 to 45 minutes by road, which makes that area an easy first or last night of a trip.' },
      { q: 'Which airport is better for La Fortuna and Arenal?', a: 'It’s roughly a wash: about 2¾–3½ hours from Liberia and about 3–3½ hours from San José. If you’re pairing Arenal with the Guanacaste coast, LIR keeps both legs shorter.' },
      { q: 'Can I fly into one airport and out of the other?', a: 'Yes. An open-jaw itinerary (for example, into LIR and out of SJO) is common on multi-region road trips and can save you from backtracking across the country.' },
      { q: 'Do drive times change much in the green season?', a: 'They can. May–November rains and a few unpaved beach-access roads can slow the final stretch, so build in a buffer and don’t rely on a map app’s optimistic estimate.' },
    ] },
  ],
};
