import Link from 'next/link'

import { Button } from '../button/button'
import { ChevronLeft } from '../icons/directional/chevron-left'
import { ChevronRight } from '../icons/directional/chevron-right'
import { Text } from '../text/text'

type PaginationProps = {
  page: number
  totalPages: number
  /** Href de cada página. Se resuelve en el server: los botones son links. */
  buildHref: (page: number) => string
  /**
   * Opta los links al runtime prefetching, para que la página destino esté
   * resuelta antes del click. Cuesta una invocación de server por link.
   */
  prefetch?: boolean
}

const WINDOW_SIZE = 3

/** Ventana de páginas alrededor de la actual, con `…` si quedan más atrás. */
function buildWindow(page: number, totalPages: number) {
  const start = Math.min(Math.max(page - 1, 1), Math.max(totalPages - WINDOW_SIZE + 1, 1))

  return Array.from({ length: Math.min(WINDOW_SIZE, totalPages) }, (_, index) => start + index)
}

function formatPage(page: number) {
  return String(page).padStart(2, '0')
}

export const Pagination = ({ page, totalPages, buildHref, prefetch }: PaginationProps) => {
  const pages = buildWindow(page, totalPages)
  const hasMore = (pages.at(-1) ?? 0) < totalPages
  const previousPage = page - 1
  const nextPage = page + 1

  return (
    <div className="flex items-center justify-between gap-2 py-2">
      <Text variant="body.2" className="text-basic-500">
        Page {formatPage(page)} / {formatPage(totalPages)}
      </Text>

      <nav aria-label="Paginación" className="flex items-center gap-1">
        {previousPage >= 1 ? (
          <Button variant="secondary" size="sm" asChild>
            <Link href={buildHref(previousPage)} prefetch={prefetch} aria-label="Página anterior">
              <ChevronLeft className="text-muted-foreground" />
            </Link>
          </Button>
        ) : (
          <Button variant="secondary" size="sm" disabled aria-label="Página anterior">
            <ChevronLeft className="text-muted-foreground opacity-50" />
          </Button>
        )}

        {pages.map((item) => {
          const isCurrent = item === page

          return (
            <Button
              key={item}
              variant="secondary"
              size="sm"
              asChild
              className={isCurrent ? 'border-blue-200 bg-background' : undefined}
            >
              <Link
                href={buildHref(item)}
                prefetch={prefetch}
                aria-current={isCurrent ? 'page' : undefined}
              >
                <Text
                  variant="body.2"
                  className={
                    isCurrent ? 'font-normal text-foreground' : 'font-normal text-muted-foreground'
                  }
                >
                  {formatPage(item)}
                </Text>
              </Link>
            </Button>
          )
        })}

        {hasMore ? (
          <span
            aria-hidden="true"
            className="flex size-10 items-center justify-center gap-1 border border-muted-foreground bg-muted pt-1"
          >
            <span className="size-0.5 rounded-full bg-muted-foreground" />
            <span className="size-0.5 rounded-full bg-muted-foreground" />
            <span className="size-0.5 rounded-full bg-muted-foreground" />
          </span>
        ) : null}

        {nextPage <= totalPages ? (
          <Button variant="secondary" size="sm" asChild>
            <Link href={buildHref(nextPage)} prefetch={prefetch} aria-label="Página siguiente">
              <ChevronRight className="text-muted-foreground" />
            </Link>
          </Button>
        ) : (
          <Button variant="secondary" size="sm" disabled aria-label="Página siguiente">
            <ChevronRight className="text-muted-foreground opacity-50" />
          </Button>
        )}
      </nav>
    </div>
  )
}
