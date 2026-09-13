import type { Metadata } from 'next'
import { Suspense } from 'react'

import { ApodBody } from '@/features/apod/components/apod-body'
import { ApodHero } from '@/features/apod/components/apod-hero'
import { ApodSidebar } from '@/features/apod/components/apod-sidebar'
import { getAPODImage } from '@/features/apod/services/get-apod-image'
import { ArticleBreadcrumbs } from '@/features/news/components/article-breadcrumbs'
import { ShareButton } from '@/features/news/components/share-button'
import { Container } from '@/shared/components/container/container'

/**
 * Detalle de la Astronomy Picture of the Day.
 *
 * Mismo shell que `/news/[id]`: el fetch a `getAPODImage` cuelga de un
 * `Suspense` para no bloquear el shell de la ruta mientras resuelve.
 */

export const instant = true

export async function generateMetadata(): Promise<Metadata> {
  const apod = await getAPODImage()

  return {
    title: apod.title,
    description: apod.paragraphs[0],
    openGraph: {
      type: 'article',
      title: apod.title,
      description: apod.paragraphs[0],
      publishedTime: apod.date,
      images: [{ url: apod.image }],
    },
  }
}

export default function ApodPage() {
  return (
    <main className="flex min-h-dvh w-full flex-col items-center bg-background pt-24 pb-32 text-primary-foreground">
      <Container className="flex flex-col items-start gap-8">
        <Suspense fallback={<ApodSkeleton />}>
          <ApodRoute />
        </Suspense>
      </Container>
    </main>
  )
}

async function ApodRoute() {
  const apod = await getAPODImage()

  return (
    <>
      <ArticleBreadcrumbs items={[{ label: 'Archive', href: '/' }, { label: 'APOD' }]} />

      <ApodHero apod={apod} actions={<ShareButton url="/apod" title={apod.title} withLabel />} />

      <div className="grid w-full grid-cols-1 gap-8 lg:grid-cols-12">
        <div className="min-w-0 lg:col-span-8">
          <ApodBody apod={apod} />
        </div>

        <div className="lg:col-span-4">
          <ApodSidebar apod={apod} />
        </div>
      </div>
    </>
  )
}

/** Mismas medidas que el contenido, para que nada salte al resolverse. */
function ApodSkeleton() {
  return (
    <div className="flex w-full animate-pulse flex-col gap-8" aria-hidden="true">
      <div className="h-4 w-64 bg-card" />
      <div className="h-70 w-full border border-border bg-card sm:h-96" />

      <div className="grid w-full grid-cols-1 gap-8 lg:grid-cols-12">
        <div className="flex flex-col gap-6 lg:col-span-8">
          <div className="h-32 w-full bg-card" />
          <div className="h-12 w-2/3 bg-card" />
          <div className="h-32 w-full bg-card" />
        </div>

        <div className="flex flex-col gap-4 lg:col-span-4">
          <div className="h-42.5 w-full rounded-lg border border-border bg-card" />
          <div className="h-32 w-full rounded-lg border border-border bg-card" />
        </div>
      </div>
    </div>
  )
}
