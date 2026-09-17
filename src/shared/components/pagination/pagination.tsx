import Link from "next/link";

import {Button} from "../button/button";
import {ChevronLeft} from "../icons/directional/chevron-left";
import {ChevronRight} from "../icons/directional/chevron-right";
import {Text} from "../text/text";

type PaginationProps = {
  page: number;
  totalPages: number;
  /** Href de cada página. Se resuelve en el server: los botones son links. */
  buildHref: (page: number) => string;
  /**
   * Opta los links al runtime prefetching, para que la página destino esté
   * resuelta antes del click. Cuesta una invocación de server por link.
   */
  prefetch?: boolean;
};

const WINDOW_SIZE = 3;

/** Ventana de páginas alrededor de la actual, con `…` si quedan más atrás. */
function buildWindow(page: number, totalPages: number) {
  const start = Math.min(Math.max(page - 1, 1), Math.max(totalPages - WINDOW_SIZE + 1, 1));

  return Array.from({length: Math.min(WINDOW_SIZE, totalPages)}, (_, index) => start + index);
}

function formatPage(page: number) {
  return String(page).padStart(2, "0");
}

export const Pagination = ({page, totalPages, buildHref, prefetch}: PaginationProps) => {
  const pages = buildWindow(page, totalPages);
  const hasMore = (pages.at(-1) ?? 0) < totalPages;
  const previousPage = page - 1;
  const nextPage = page + 1;

  return (
    <div className="flex flex-col items-center justify-between gap-5 py-2 md:flex-row">
      <Text className="text-basic-500 uppercase" variant="body.3">
        Page {formatPage(page)} / {formatPage(totalPages)}
      </Text>

      <nav aria-label="Paginación" className="flex items-center gap-1">
        {previousPage >= 1 ? (
          <Button asChild size="sm" variant="secondary">
            <Link aria-label="Página anterior" href={buildHref(previousPage)} prefetch={prefetch}>
              <ChevronLeft className="text-muted-foreground" />
            </Link>
          </Button>
        ) : (
          <Button disabled aria-label="Página anterior" size="sm" variant="secondary">
            <ChevronLeft className="text-muted-foreground opacity-50" />
          </Button>
        )}

        {pages.map((item) => {
          const isCurrent = item === page;

          return (
            <Button
              asChild
              className={isCurrent ? "border-blue-200 bg-background" : undefined}
              key={item}
              size="sm"
              variant="secondary"
            >
              <Link
                aria-current={isCurrent ? "page" : undefined}
                href={buildHref(item)}
                prefetch={prefetch}
              >
                <Text
                  className={
                    isCurrent ? "font-normal text-foreground" : "font-normal text-muted-foreground"
                  }
                  variant="body.2"
                >
                  {formatPage(item)}
                </Text>
              </Link>
            </Button>
          );
        })}

        {hasMore ? (
          <span
            aria-hidden="true"
            className="flex size-10 items-center justify-center gap-1 rounded-lg border border-muted-foreground bg-muted pt-1"
          >
            <span className="size-0.5 rounded-full bg-muted-foreground" />
            <span className="size-0.5 rounded-full bg-muted-foreground" />
            <span className="size-0.5 rounded-full bg-muted-foreground" />
          </span>
        ) : null}

        {nextPage <= totalPages ? (
          <Button asChild size="sm" variant="secondary">
            <Link aria-label="Página siguiente" href={buildHref(nextPage)} prefetch={prefetch}>
              <ChevronRight className="text-muted-foreground" />
            </Link>
          </Button>
        ) : (
          <Button disabled aria-label="Página siguiente" size="sm" variant="secondary">
            <ChevronRight className="text-muted-foreground opacity-50" />
          </Button>
        )}
      </nav>
    </div>
  );
};
