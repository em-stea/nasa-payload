"use client";

import type {NewsArticle} from "@/features/news/types/news";

import Link from "next/link";

import {ShareButton} from "@/features/news/components/share-button";
import {buildArticlePhotoTransitionName} from "@/features/news/utils/parse-post";
import {Card} from "@/shared/components/card/card";

type NewsArticleCardProps = {
  article: NewsArticle;
};

/**
 * Card del grid de noticias.
 *
 * A diferencia de `LatestNewsCard`, acá la meta (antigüedad + compartir) va
 * arriba del titular y la card entera linkea al detalle dentro del sitio.
 *
 * Es client por el mismo motivo que `LatestNewsCard`: las partes compuestas de
 * `Card` se cuelgan con Object.assign y no cruzan el borde RSC.
 */
export function NewsArticleCard({article}: NewsArticleCardProps) {
  return (
    <Link
      className="block h-full rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-200"
      href={article.href}
    >
      <Card
        className="h-full"
        data={{...article, viewTransitionName: buildArticlePhotoTransitionName(article.id)}}
      >
        <Card.Header>
          <Card.Image />
          <Card.Badge dot />
        </Card.Header>

        <Card.Body className="flex-1 pb-4">
          <div className="flex items-center justify-between gap-2">
            <Card.Date className="opacity-70" />
            <ShareButton title={article.title} url={article.href} />
          </div>

          <Card.Title className="line-clamp-2" />
          <Card.Description className="line-clamp-3" />
        </Card.Body>
      </Card>
    </Link>
  );
}
