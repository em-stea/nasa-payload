import type {NewsArticleDetail} from "@/features/news/types/news";
import type {ReactNode} from "react";

import Image from "next/image";
import {ViewTransition} from "react";

import {buildArticlePhotoTransitionName} from "@/features/news/utils/parse-post";
import {Heading} from "@/shared/components/heading/heading";
import {Text} from "@/shared/components/text/text";
import {toMissionTimestamp} from "@/shared/utils/mission-date";

type ArticleHeroProps = {
  article: NewsArticleDetail;
  /** Favorito y compartir; dependen de la sesión y llegan desde la page. */
  actions?: ReactNode;
};

/**
 * Cabecera del artículo: la imagen destacada a sangre con el titular apoyado
 * sobre un degradado al color de fondo.
 *
 * `mix-blend-screen` sólo se aplica en oscuro: sobre el fondo negro del diseño
 * funde la foto con la página, pero en claro lavaría la imagen hasta dejarla
 * casi blanca.
 */
export function ArticleHero({article, actions}: ArticleHeroProps) {
  return (
    <header className="relative h-70 w-full overflow-hidden border border-border sm:h-96">
      {article.image && (
        <ViewTransition name={buildArticlePhotoTransitionName(article.id)}>
          <Image
            fill
            priority
            alt=""
            className="object-cover dark:opacity-80 dark:mix-blend-screen"
            sizes="100vw"
            src={article.image}
          />
        </ViewTransition>
      )}

      <div className="absolute inset-x-0 bottom-0 flex flex-col gap-2 bg-gradient-to-t from-background to-transparent px-4 pt-4 pb-4">
        <Heading
          as="h1"
          className="lg:leading-13.2 text-7 leading-8.5 tracking-n0_96 text-primary-foreground sm:text-8 sm:leading-10 lg:text-12"
          variant="title.2"
        >
          {article.title}
        </Heading>

        <div className="flex w-full flex-wrap items-center gap-x-4 gap-y-1">
          <Text className="text-basic-500 uppercase" variant="meta.3">
            Author: NASA
          </Text>

          <Text className="text-basic-500 uppercase" variant="meta.3">
            <time dateTime={article.publishedAt}>
              Date: {toMissionTimestamp(article.publishedAt)}
            </time>
          </Text>

          {article.readingTime && (
            <Text className="text-basic-500 uppercase" variant="meta.3">
              {article.readingTime}
            </Text>
          )}

          {actions && <div className="ms-auto flex items-center gap-2">{actions}</div>}
        </div>
      </div>
    </header>
  );
}
