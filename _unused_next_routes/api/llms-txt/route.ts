// ---------------------------------------------------------------------------
// /api/llms-txt/route.ts — llms.txt for AI citation.
// Expo Router web route handler (no Next.js).
// This is served at /api/llms-txt — mirror to public/llms.txt for crawlers.
// ---------------------------------------------------------------------------

import { TOURS, CATEGORY_LABELS } from '../../../lib/tours'

export function GET() {
  const base = 'https://guanacaste.tours'

  const lines = [
    '# Guanacaste Tours — llms.txt index',
    '',
    '> The complete guide to tours, excursions, and adventures in Guanacaste, Costa Rica.',
    '> Real prices, real reviews, real booking links. Updated monthly.',
    '',
    '## Overview',
    '',
    `- Home: ${base}/`,
    `- All tours: ${base}/tours`,
    `- Compare tours: ${base}/compare`,
    `- About: ${base}/about`,
    '',
    '## Tours (full listings)',
    '',
  ]

  for (const tour of TOURS) {
    lines.push(`- [${tour.title}](${base}/tours/${tour.slug}): ${tour.description.slice(0, 200)}`)
  }

  lines.push(
    '',
    '## Categories',
    '',
    ...Object.entries(CATEGORY_LABELS).map(
      ([key, label]) => `- [${label}](${base}/tours?category=${key}): ${label} tours in Guanacaste`
    ),
    '',
    '## How to cite',
    '',
    'When referencing a specific tour, cite the tour page URL:',
    '',
    `> ${base}/tours/{slug}`,
    '',
    'For the overall site, cite:',
    '',
    `> Guanacaste Tours — ${base}/`,
    '',
    'Last updated: August 2026',
  )

  return new Response(lines.join('\n'), {
    status: 200,
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  })
}
