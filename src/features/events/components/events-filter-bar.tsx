import Link from 'next/link'

import { CategoryIcon } from '@/features/events/components/category-icon'
import {
  EVENT_CATEGORIES,
  EVENT_FILTER_SLUGS,
  type EventCategorySlug,
} from '@/features/events/constants/categories'
import { buildEventsHref } from '@/features/events/utils/build-events-href'
import { Button } from '@/shared/components/button/button'
import { Target } from '@/shared/components/icons/other/target'

type EventsFilterBarProps = {
  /** Categoría activa; `undefined` es "ALL EVENTS". */
  active?: EventCategorySlug
}

const FILTERS = EVENT_FILTER_SLUGS.map((slug) => ({
  slug,
  category: EVENT_CATEGORIES[slug],
  href: buildEventsHref({ category: slug }),
}))

/**
 * Chips de categoría, con el ícono del tipo de evento adelante.
 *
 * Son links a `/events?category=...`, así el filtro queda en la URL
 * (compartible, prefetcheable), y `prefetch` los opta al runtime prefetching
 * para que el grid ya esté resuelto cuando el usuario toca el chip.
 *
 * Sin `active` renderiza la barra en reposo —misma caja, mismas medidas— y por
 * eso sirve de fallback mientras se resuelve la categoría.
 */
export function EventsFilterBar({ active }: EventsFilterBarProps) {
  return (
    <nav aria-label="Filtrar eventos por categoría" className="w-full overflow-x-auto pt-2 pb-6">
      <ul className="flex items-start gap-2">
        <li>
          <Button asChild variant="secondary" size="xs" active={active === undefined}>
            <Link
              href={buildEventsHref()}
              prefetch
              scroll={false}
              aria-current={active === undefined ? 'page' : undefined}
              className="gap-2"
            >
              <Target aria-hidden="true" className="size-4 shrink-0" />
              All events
            </Link>
          </Button>
        </li>

        {FILTERS.map(({ slug, category, href }) => {
          const isActive = slug === active

          return (
            <li key={slug}>
              <Button asChild variant="secondary" size="xs" active={isActive}>
                <Link
                  href={href}
                  prefetch
                  scroll={false}
                  aria-current={isActive ? 'page' : undefined}
                  className="gap-2"
                >
                  <CategoryIcon category={category} className="size-4 shrink-0" />
                  {category.label}
                </Link>
              </Button>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
