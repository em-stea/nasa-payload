import type {NewsArticle} from "@/features/news/types/news";
import type {BadgeTone} from "@/shared/styles/components/badge";

import Link from "next/link";

import {SectionHeading} from "@/features/news/components/section-heading";
import {Badge} from "@/shared/components/badge/badge";
import {Heading} from "@/shared/components/heading/heading";
import {ArrowRight} from "@/shared/components/icons/directional/arrow-right";
import {Text} from "@/shared/components/text/text";
import {cn} from "@/shared/utils/className-builder";

const OUTLINE_BY_TONE: Partial<Record<BadgeTone, string>> = {
  blue: "border-foreground text-foreground",
  red: "border-destructive text-destructive",
  orange: "border-orange-200 text-orange-200",
};

export function RelatedArticles({articles}: {articles: NewsArticle[]}) {
  if (articles.length === 0) return null;

  return (
    <section aria-labelledby="related-articles" className="flex w-full flex-col gap-6">
      <SectionHeading bordered>
        <span id="related-articles">Related articles</span>
      </SectionHeading>

      <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-3">
        {articles.map((article) => (
          <Link
            className="group flex flex-col gap-2 rounded-lg border border-border bg-card p-4 transition-colors duration-300 hover:border-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-200"
            href={article.href}
            key={article.id}
          >
            <Badge
              className={cn(
                "bg-transparent px-2.25 py-1.25 backdrop-blur-none",
                OUTLINE_BY_TONE[article.tone],
              )}
              tone={article.tone}
              variant="default"
            >
              {article.tag}
            </Badge>

            <Heading
              as="h3"
              className="line-clamp-2 text-primary-foreground transition-colors duration-300 group-hover:text-foreground"
              variant="title.3"
            >
              {article.title}
            </Heading>

            <Text className="line-clamp-3 leading-5.25 text-muted-foreground" variant="body.3">
              {article.description}
            </Text>

            <span className="mt-auto flex items-center gap-1 pt-4 text-foreground">
              <Text variant="nav.link">Read article</Text>
              <ArrowRight aria-hidden="true" className="size-4 shrink-0" />
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
