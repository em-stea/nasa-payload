'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'

import type { ArticleFigure } from '@/features/news/types/news'
import { Badge } from '@/shared/components/badge'
import { Button } from '@/shared/components/button/button'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from '@/shared/components/carousel/carousel'
import { ChevronLeft } from '@/shared/components/icons/directional/chevron-left'
import { ChevronRight } from '@/shared/components/icons/directional/chevron-right'
import { Text } from '@/shared/components/text/text'
import { cn } from '@/shared/utils/className-builder'

/** Nombre del archivo en la CDN; es lo que el diseño muestra como origen. */
function toSourceLabel(url: string) {
  const name = url.split('?')[0].split('/').pop() ?? url

  return name.replace(/\.[a-z0-9]+$/i, '').toUpperCase()
}

/**
 * Galería de las imágenes que trae el cuerpo de la nota.
 *
 * Las figuras salen del HTML del post, así que la cantidad varía: con una sola
 * imagen se pinta igual pero sin flechas ni puntos, que no tendrían a dónde
 * llevar.
 */
export function ArticleGallery({ figures }: { figures: ArticleFigure[] }) {
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    if (!api) return

    const onSelect = () => setCurrent(api.selectedScrollSnap())

    onSelect()
    api.on('select', onSelect)

    return () => {
      api.off('select', onSelect)
    }
  }, [api])

  if (figures.length === 0) return null

  const total = figures.length
  const active = figures[current] ?? figures[0]
  const hasControls = total > 1

  return (
    <section aria-label="Imágenes del artículo" className="flex w-full flex-col gap-3">
      <div className="relative w-full overflow-hidden border border-border bg-card">
        <Carousel setApi={setApi} opts={{ loop: true }} className="w-full">
          <CarouselContent className="ml-0">
            {figures.map((figure) => (
              <CarouselItem key={figure.url} className="pl-0">
                <div className="relative h-70 w-full sm:h-105 lg:h-150">
                  <Image
                    src={figure.url}
                    alt={figure.alt || figure.caption || ''}
                    fill
                    sizes="(max-width: 1024px) 100vw, 1152px"
                    className="object-cover"
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>

        <Badge variant="media" tone="blue" className="absolute top-4 left-4 px-2.25 py-1.25">
          SRC: {toSourceLabel(active.url)}
        </Badge>

        {hasControls && (
          <>
            <Button
              variant="secondary"
              size="intrinsic"
              aria-label="Imagen anterior"
              onClick={() => api?.scrollPrev()}
              className="absolute top-1/2 left-4 -translate-y-1/2"
            >
              <ChevronLeft aria-hidden="true" className="size-5" />
            </Button>

            <Button
              variant="secondary"
              size="intrinsic"
              aria-label="Imagen siguiente"
              onClick={() => api?.scrollNext()}
              className="absolute top-1/2 right-4 -translate-y-1/2"
            >
              <ChevronRight aria-hidden="true" className="size-5" />
            </Button>
          </>
        )}

        <div className="absolute inset-x-0 bottom-0 bg-background/90 px-4 py-4 backdrop-blur-xs">
          <Text variant="meta.3" className="truncate text-basic-500 uppercase">
            {`Fig ${String(current + 1).padStart(2, '0')}`}
            {active.caption ? `: ${active.caption}` : ''}
          </Text>
        </div>
      </div>

      {hasControls && (
        <div className="flex w-full items-center justify-between gap-4">
          <div className="flex items-center gap-1">
            {figures.map((figure, index) => (
              <button
                key={figure.url}
                type="button"
                aria-label={`Ir a la imagen ${index + 1}`}
                aria-current={current === index ? 'true' : undefined}
                onClick={() => api?.scrollTo(index)}
                className={cn(
                  'size-2 rounded-full transition-colors duration-200 hover:cursor-pointer',
                  current === index ? 'bg-foreground' : 'bg-secondary',
                )}
              />
            ))}
          </div>

          <Text variant="body.4" className="text-basic-500">
            {`Image ${String(current + 1).padStart(2, '0')} // ${String(total).padStart(2, '0')}`}
          </Text>
        </div>
      )}
    </section>
  )
}
