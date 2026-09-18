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
  actions?: ReactNode;
};

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

      <div className="absolute inset-x-0 bottom-0 flex flex-col gap-2 bg-linear-to-t from-background to-transparent px-4 pt-4 pb-4">
        <Heading as="h1" variant="title.1-bold">
          {article.title}
        </Heading>

        <div className="flex w-full flex-wrap items-center gap-x-4 gap-y-1">
          <Text className="text-secondary-foreground uppercase" variant="meta.3">
            Author: NASA
          </Text>

          <Text className="text-secondary-foreground uppercase" variant="meta.3">
            <time dateTime={article.publishedAt}>
              Date: {toMissionTimestamp(article.publishedAt)}
            </time>
          </Text>

          {article.readingTime && (
            <Text className="text-secondary-foreground uppercase" variant="meta.3">
              {article.readingTime}
            </Text>
          )}

          {actions && <div className="ms-auto flex items-center gap-2">{actions}</div>}
        </div>
      </div>
    </header>
  );
}
