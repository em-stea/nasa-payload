import Link from 'next/link'

import {
  NEWS_CATEGORIES,
  NEWS_FILTER_SLUGS,
  type NewsCategorySlug,
} from '@/features/news/constants/categories'
import { buildNewsHref } from '@/features/news/utils/build-news-href'
import { Button } from '@/shared/components/button/button'

type NewsFilterBarProps = {
  /** Categoría activa; `undefined` es "ALL". */
  active?: NewsCategorySlug
}

const FILTERS = [
  { slug: undefined, label: 'All', href: buildNewsHref() },
  ...NEWS_FILTER_SLUGS.map((slug) => ({
    slug,
    label: NEWS_CATEGORIES[slug].label,
    href: buildNewsHref({ category: slug }),
  })),
]

/**
 * Chips de categoría. Son links a `/news?category=...`, así el filtro queda en
 * la URL (compartible, prefetcheable).
 *
 * `prefetch` los opta al runtime prefetching: Next resuelve el `searchParams`
 * de cada link y el `getLatestNews` cacheado detrás antes del click, así el
 * grid ya está listo cuando el usuario toca el chip.
 *
 * Sin `active` renderiza la barra en reposo — misma caja, mismas medidas — y
 * por eso sirve de fallback mientras se resuelve la categoría.
 */
export function NewsFilterBar({ active }: NewsFilterBarProps) {
  return (
    <nav aria-label="Filtrar noticias por categoría" className="w-full overflow-x-auto pt-2 pb-6">
      <ul className="flex items-start gap-2">
        {FILTERS.map(({ slug, label, href }) => {
          const isActive = slug === active

          return (
            <li key={label}>
              <Button asChild variant="secondary" size="xs" active={isActive}>
                <Link
                  href={href}
                  prefetch
                  scroll={false}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {label}
                </Link>
              </Button>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
