import type { Metadata } from 'next'
import { Suspense } from 'react'

import { NewsFilterBar } from '@/features/news/components/news-filter-bar'
import { NewsFilterBarLive } from '@/features/news/components/news-filter-bar-live'
import { NewsGrid, NewsGridSkeleton } from '@/features/news/components/news-grid'
import { NewsHero } from '@/features/news/components/news-hero'
import { NewsResultsBoundary } from '@/features/news/components/news-results-boundary'
import { isNewsCategorySlug } from '@/features/news/constants/categories'

export const metadata: Metadata = {
  title: 'NASA News',
  description:
    'The latest updates from deep space missions, planetary defense, and scientific breakthroughs across the cosmos.',
}

/**
 * Pide a Next que valide que navegar a esta ruta pinta UI al instante. Si algo
 * bloquea —una lectura sin cachear, un `<Suspense>` que falta— lo avisa en el
 * overlay de desarrollo en vez de dejarlo pasar a producción.
 */
export const instant = true

type NewsSearchParams = {
  category?: string | string[]
  page?: string | string[]
}

function readParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value
}

function readPage(value: string | string[] | undefined) {
  const page = Number.parseInt(readParam(value) ?? '1', 10)

  return Number.isFinite(page) && page > 0 ? page : 1
}

/**
 * El hero es estático y viaja en el shell de la ruta. Lo que depende de
 * `searchParams` cuelga de su propio `<Suspense>`, cada uno con un fallback de
 * las mismas medidas que su contenido, así nada se mueve cuando resuelve.
 */
export default function NewsPage({ searchParams }: { searchParams: Promise<NewsSearchParams> }) {
  return (
    <main className="flex min-h-dvh w-full flex-col items-start gap-8 bg-background px-6 pt-24 pb-32 text-primary-foreground">
      <NewsHero />

      <div className="w-full border-b border-border">
        <Suspense fallback={<NewsFilterBar />}>
          <NewsFilterBarLive />
        </Suspense>
      </div>

      <Suspense fallback={<NewsGridSkeleton />}>
        <NewsResultsBoundary fallback={<NewsGridSkeleton />}>
          <NewsResults searchParams={searchParams} />
        </NewsResultsBoundary>
      </Suspense>
    </main>
  )
}

async function NewsResults({ searchParams }: { searchParams: Promise<NewsSearchParams> }) {
  const params = await searchParams
  const rawCategory = readParam(params.category)

  return (
    <NewsGrid
      page={readPage(params.page)}
      category={isNewsCategorySlug(rawCategory) ? rawCategory : undefined}
    />
  )
}
