import Link from 'next/link'
import { Fragment } from 'react'

import { ChevronRight } from '@/shared/components/icons/directional/chevron-right'
import { Text } from '@/shared/components/text/text'

export type Breadcrumb = {
  label: string
  /** Sin `href` el ítem es el actual y no linkea. */
  href?: string
}

/**
 * Migas del detalle: `ARCHIVE › NEWS › MARS`.
 *
 * El último ítem se marca con `aria-current` en vez de renderizarse como link,
 * que es lo que espera un lector de pantalla al llegar a la posición actual.
 */
export function ArticleBreadcrumbs({ items }: { items: Breadcrumb[] }) {
  return (
    <nav aria-label="Migas de navegación" className="w-full">
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
        {items.map(({ label, href }, index) => (
          <Fragment key={`${label}-${index}`}>
            {index > 0 && (
              <ChevronRight aria-hidden="true" className="size-3 shrink-0 text-basic-500" />
            )}

            <li>
              {href ? (
                <Link
                  href={href}
                  className="text-basic-500 transition-colors duration-200 hover:text-foreground"
                >
                  <Text variant="meta.3" className="uppercase">
                    {label}
                  </Text>
                </Link>
              ) : (
                <Text variant="meta.3" aria-current="page" className="text-foreground uppercase">
                  {label}
                </Text>
              )}
            </li>
          </Fragment>
        ))}
      </ol>
    </nav>
  )
}
