import type { NewsCategorySlug } from '@/features/news/constants/categories'

type NewsHrefParams = {
  page?: number
  category?: NewsCategorySlug
}

/**
 * URL canónica de la sección. Omite los valores por defecto para que
 * `/news`, `/news?page=1` y `/news?category=` no sean tres entradas distintas
 * del prefetch cache.
 */
export function buildNewsHref({ page = 1, category }: NewsHrefParams = {}) {
  const params = new URLSearchParams()

  if (category) params.set('category', category)
  if (page > 1) params.set('page', String(page))

  const query = params.toString()

  return query ? `/news?${query}` : '/news'
}
