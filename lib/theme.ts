// ---------------------------------------------------------------------------
// Central design tokens for Guanacaste Experiences (native + web).
// Single source of truth — components reference these instead of hardcoding hex.
// Mirrors the CSS custom properties in app/globals.css.
// ---------------------------------------------------------------------------

export const color = {
  // Brand / structure
  primary: '#0B4155', // deep ocean teal
  primaryDeep: '#082F3B',
  primarySoft: '#123C4C',
  sky: '#1D7FA8', // ocean blue (links, secondary)
  skyLight: '#E6F4FE',

  // Action / warmth (Guanacaste sunset)
  coral: '#E0533D', // primary CTA
  coralDeep: '#C24329',
  sun: '#E8A849', // gold accent, ratings
  sunLight: '#FDF3E0',
  sand: '#F5E6CC',

  // Semantic
  success: '#0E7C5A',
  warning: '#B45309',
  danger: '#C0392B',

  // Neutrals
  ink: '#16211F', // headings
  body: '#374151', // body copy
  muted: '#6B7280', // secondary
  faint: '#9CA3AF', // captions/placeholder (>=4.5:1 only on white for large; use for icons)
  border: '#E5E7EB',
  surface: '#FFFFFF',
  surfaceAlt: '#F8FAF9',
  ground: '#FDFBF8', // warm page background

  // On dark imagery
  onDark: '#FFFFFF',
  onDarkMuted: '#F1E9DC',
} as const;

// Google Fonts: Fraunces (warm editorial serif, display) + DM Sans (legible UI/body).
// Loaded in app/+html.tsx. Fallbacks keep text readable before swap / on native.
export const font = {
  display: "'Fraunces', 'Iowan Old Style', Georgia, 'Times New Roman', serif",
  body: "'DM Sans', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
} as const;

// Type scale (px). Line heights chosen for comfortable reading + no clipping.
export const type = {
  display: { size: 52, line: 56, weight: '600' as const, family: font.display },
  h1: { size: 40, line: 46, weight: '600' as const, family: font.display },
  h2: { size: 28, line: 34, weight: '600' as const, family: font.display },
  h3: { size: 21, line: 28, weight: '700' as const, family: font.body },
  h4: { size: 17, line: 24, weight: '700' as const, family: font.body },
  body: { size: 16, line: 25, weight: '400' as const, family: font.body },
  bodySm: { size: 14, line: 21, weight: '400' as const, family: font.body },
  caption: { size: 12.5, line: 17, weight: '500' as const, family: font.body },
  button: { size: 15, line: 20, weight: '700' as const, family: font.body },
  label: { size: 12, line: 16, weight: '600' as const, family: font.body },
  eyebrow: { size: 12, line: 16, weight: '700' as const, family: font.body, spacing: 1.4 },
  price: { size: 18, line: 22, weight: '700' as const, family: font.body },
} as const;

// 4px spacing scale
export const space = {
  1: 4, 2: 8, 3: 12, 4: 16, 5: 20, 6: 24, 7: 28, 8: 32, 10: 40, 12: 48, 16: 64, 20: 80,
} as const;

export const radius = { sm: 8, md: 12, lg: 16, xl: 22, pill: 999 } as const;

// Web box-shadows (applied via Platform.select in components).
export const shadow = {
  card: '0 1px 2px rgba(16,33,31,0.04), 0 8px 20px -12px rgba(16,33,31,0.18)',
  elevated: '0 2px 4px rgba(16,33,31,0.05), 0 16px 40px -16px rgba(16,33,31,0.28)',
} as const;

export const layout = { maxWidth: 1200, gutter: 20 } as const;

export const motion = { fast: 140, base: 220 } as const;
