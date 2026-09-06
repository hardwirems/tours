import { TOURS, CATEGORIES, AFFILIATE_PROGRAMS } from './tours'

export type Tour = typeof TOURS[0]

/**
 * Look up a tour by its slug.
 */
export function getTourBySlug(slug: string): Tour | undefined {
  return TOURS.find((t) => t.slug === slug)
}

/**
 * Get all tours in a category.
 */
export function getToursByCategory(category: string): Tour[] {
  return TOURS.filter((t) => t.category === category)
}

/**
 * Get all tours in a town/area.
 */
export function getToursByTown(town: string): Tour[] {
  return TOURS.filter((t) => t.towns.includes(town))
}

/**
 * Full-text search across title, description, tags, towns.
 */
export function searchTours(query: string): Tour[] {
  if (!query.trim()) return TOURS
  const q = query.toLowerCase()
  return TOURS.filter((t) =>
    t.title.toLowerCase().includes(q) ||
    t.description.toLowerCase().includes(q) ||
    t.tags.some((tag) => tag.toLowerCase().includes(q)) ||
    t.towns.some((town) => town.toLowerCase().includes(q))
  )
}

/**
 * Get affiliate program info by key.
 */
export function getAffiliateProgram(key: string) {
  return AFFILIATE_PROGRAMS[key]
}

/**
 * Resolve an affiliate URL by tour slug.
 */
export function resolveAffiliateUrl(slug: string): string | null {
  const tour = getTourBySlug(slug)
  return tour?.affiliateUrl ?? null
}

/**
 * Get all tours, sorted by rating descending.
 */
export function getToursByRating(): Tour[] {
  return [...TOURS].sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
}
