"use client";

import type {ArticleFigure} from "@/features/news/types/news";

import Image from "next/image";

import {Badge} from "@/shared/components/badge/badge";
import {CarouselImage} from "@/shared/components/carousel/carousel-image";
import {Text} from "@/shared/components/text/text";

/** Nombre del archivo en la CDN; es lo que el diseño muestra como origen. */
function toSourceLabel(url: string) {
  const name = url.split("?")[0].split("/").pop() ?? url;

  return name.replace(/\.[a-z0-9]+$/i, "").toUpperCase();
}

function ArticleFigureSlide({figure, index}: {figure: ArticleFigure; index: number}) {
  return (
    <div className="relative h-70 w-full overflow-hidden rounded-lg border border-border bg-card sm:h-105 lg:h-150">
      <Image
        fill
        alt={figure.alt || figure.caption || ""}
        className="object-cover"
        sizes="(max-width: 1024px) 100vw, 1152px"
        src={figure.url}
      />

      <Badge className="absolute top-4 left-4 px-2.25 py-1.25" tone="blue" variant="default">
        SRC: {toSourceLabel(figure.url)}
      </Badge>

      <div className="absolute inset-x-0 bottom-0 bg-background/90 px-4 py-4 backdrop-blur-xs">
        <Text className="truncate text-basic-500 uppercase" variant="meta.3">
          {`Fig ${String(index + 1).padStart(2, "0")}`}
          {figure.caption ? `: ${figure.caption}` : ""}
        </Text>
      </div>
    </div>
  );
}

/**
 * Galería de las imágenes que trae el cuerpo de la nota.
 *
 * Las figuras salen del HTML del post, así que la cantidad varía: con una sola
 * imagen se pinta la imagen sola, sin montar el carrousel.
 */
export function ArticleGallery({figures}: {figures: ArticleFigure[]}) {
  if (figures.length === 0) return null;

  if (figures.length === 1) {
    return (
      <section aria-label="Imágenes del artículo" className="w-full">
        <ArticleFigureSlide figure={figures[0]} index={0} />
      </section>
    );
  }

  return (
    <section aria-label="Imágenes del artículo" className="w-full">
      <CarouselImage
        items={figures}
        renderItem={(figure, index) => <ArticleFigureSlide figure={figure} index={index} />}
      />
    </section>
  );
}
