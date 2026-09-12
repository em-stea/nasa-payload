import { notFound } from 'next/navigation'

import { NewsArticleCard } from '@/features/news/components/news-article-card'
import type { NewsCategorySlug } from '@/features/news/constants/categories'
import { NEWS_PER_PAGE, getLatestNews } from '@/features/news/services/get-latest-news'
import { Pagination } from '@/shared/components/pagination/pagination'
import { buildNewsHref } from '@/features/news/utils/build-news-href'

type NewsGridProps = {
  page: number
  category?: NewsCategorySlug
}

/**
 * Filas de alto fijo, como el grid del diseño.
 *
 * No es cosmético: es lo que hace que el skeleton ocupe exactamente el mismo
 * espacio que el contenido y la navegación no empuje nada al resolverse. El
 * contenido entra porque el titular y la bajada están clampeados.
 */
const GRID_CLASSNAME = 'grid w-full auto-rows-96 grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'

/** Alto del bloque de paginación: py-2 (16) + la fila de botones de 40. */
const PAGINATION_CLASSNAME = 'w-full border-t border-border pt-6'

export async function NewsGrid({ page, category }: NewsGridProps) {
  const news = await getLatestNews({ page, category })

  // Sin resultados en una página que existe significa URL inventada.
  if (news.articles.length === 0) {
    notFound()
  }

  return (
    <>
      <div className={GRID_CLASSNAME}>
        {news.articles.map((article) => (
          <NewsArticleCard key={article.id} article={article} />
        ))}
      </div>

      <div className={PAGINATION_CLASSNAME}>
        <Pagination
          page={news.page}
          totalPages={news.totalPages}
          buildHref={(target) => buildNewsHref({ page: target, category })}
          prefetch
        />
      </div>
    </>
  )
}

/**
 * Fallback del grid: mismo layout, mismas alturas, sin contenido. Reserva
 * también el bloque de paginación para que el footer no salte.
 */
export function NewsGridSkeleton() {
  return (
    <>
      <div className={GRID_CLASSNAME} aria-hidden="true">
        {Array.from({ length: NEWS_PER_PAGE }, (_, index) => (
          <div
            key={index}
            className="h-full animate-pulse rounded-2xl border border-basic-00-10 bg-card-foreground"
          />
        ))}
      </div>

      <div className={PAGINATION_CLASSNAME} aria-hidden="true">
        <div className="h-14" />
      </div>
    </>
  )
}
