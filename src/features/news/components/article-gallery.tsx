"use client";

import type {ArticleFigure} from "@/features/news/types/news";

import Image from "next/image";
import {useEffect, useState} from "react";

import {Badge} from "@/shared/components/badge/badge";
import {Button} from "@/shared/components/button/button";
import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/shared/components/carousel/carousel";
import {ChevronLeft} from "@/shared/components/icons/directional/chevron-left";
import {ChevronRight} from "@/shared/components/icons/directional/chevron-right";
import {Text} from "@/shared/components/text/text";
import {cn} from "@/shared/utils/className-builder";

/** Nombre del archivo en la CDN; es lo que el diseño muestra como origen. */
function toSourceLabel(url: string) {
  const name = url.split("?")[0].split("/").pop() ?? url;

  return name.replace(/\.[a-z0-9]+$/i, "").toUpperCase();
}

/**
 * Galería de las imágenes que trae el cuerpo de la nota.
 *
 * Las figuras salen del HTML del post, así que la cantidad varía: con una sola
 * imagen se pinta igual pero sin flechas ni puntos, que no tendrían a dónde
 * llevar.
 */
export function ArticleGallery({figures}: {figures: ArticleFigure[]}) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api) return;

    const onSelect = () => setCurrent(api.selectedScrollSnap());

    onSelect();
    api.on("select", onSelect);

    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  if (figures.length === 0) return null;

  const total = figures.length;
  const active = figures[current] ?? figures[0];
  const hasControls = total > 1;

  return (
    <section aria-label="Imágenes del artículo" className="flex w-full flex-col gap-3">
      <div className="relative w-full overflow-hidden rounded-lg border border-border bg-card">
        <Carousel className="w-full" opts={{loop: true}} setApi={setApi}>
          <CarouselContent className="ml-0">
            {figures.map((figure) => (
              <CarouselItem className="pl-0" key={figure.url}>
                <div className="relative h-70 w-full sm:h-105 lg:h-150">
                  <Image
                    fill
                    alt={figure.alt || figure.caption || ""}
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 1152px"
                    src={figure.url}
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>

        <Badge className="absolute top-4 left-4 px-2.25 py-1.25" tone="blue" variant="default">
          SRC: {toSourceLabel(active.url)}
        </Badge>

        {hasControls && (
          <>
            <Button
              aria-label="Imagen anterior"
              className="absolute top-1/2 left-4 -translate-y-1/2"
              size="intrinsic"
              variant="secondary"
              onClick={() => api?.scrollPrev()}
            >
              <ChevronLeft aria-hidden="true" className="size-5" />
            </Button>

            <Button
              aria-label="Imagen siguiente"
              className="absolute top-1/2 right-4 -translate-y-1/2"
              size="intrinsic"
              variant="secondary"
              onClick={() => api?.scrollNext()}
            >
              <ChevronRight aria-hidden="true" className="size-5" />
            </Button>
          </>
        )}

        <div className="absolute inset-x-0 bottom-0 bg-background/90 px-4 py-4 backdrop-blur-xs">
          <Text className="truncate text-basic-500 uppercase" variant="meta.3">
            {`Fig ${String(current + 1).padStart(2, "0")}`}
            {active.caption ? `: ${active.caption}` : ""}
          </Text>
        </div>
      </div>

      {hasControls && (
        <div className="flex w-full items-center justify-between gap-4">
          <div className="flex items-center gap-1">
            {figures.map((figure, index) => (
              <button
                className={cn(
                  "size-2 rounded-full transition-colors duration-200 hover:cursor-pointer",
                  current === index ? "bg-foreground" : "bg-secondary",
                )}
                aria-current={current === index ? "true" : undefined}
                aria-label={`Ir a la imagen ${index + 1}`}
                key={figure.url}
                type="button"
                onClick={() => api?.scrollTo(index)}
              />
            ))}
          </div>

          <Text className="text-basic-500" variant="body.4">
            {`Image ${String(current + 1).padStart(2, "0")} // ${String(total).padStart(2, "0")}`}
          </Text>
        </div>
      )}
    </section>
  );
}
