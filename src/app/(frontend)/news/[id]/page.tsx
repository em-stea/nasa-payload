import type {NewsArticleDetail} from "@/features/news/types/news";
import type {Metadata} from "next";

import {notFound} from "next/navigation";
import {Suspense} from "react";

import {getSessionIdentity} from "@/features/account/services/site-user";
import {
  CommentsSection,
  CommentsSectionSkeleton,
} from "@/features/comments/components/comments-section";
import {
  FavoriteButton,
  FavoriteButtonPlaceholder,
} from "@/features/favorites/components/favorite-button";
import {isFavorite} from "@/features/favorites/services/get-favorites";
import {ArticleBody} from "@/features/news/components/article-body";
import {ArticleBreadcrumbs} from "@/features/news/components/article-breadcrumbs";
import {ArticleGallery} from "@/features/news/components/article-gallery";
import {ArticleHero} from "@/features/news/components/article-hero";
import {ArticleSidebar} from "@/features/news/components/article-sidebar";
import {RelatedArticles} from "@/features/news/components/related-articles";
import {ShareButton} from "@/features/news/components/share-button";
import {getNewsArticle} from "@/features/news/services/get-news-article";
import {getRelatedNews} from "@/features/news/services/get-related-news";
import {buildArticleHref} from "@/features/news/utils/parse-post";
import {Container} from "@/shared/components/container/container";

/**
 * Detalle de una noticia.
 *
 * Todo lo que se ve depende de `params`, así que el shell estático de la ruta
 * es el esqueleto y el contenido entra por streaming. Adentro cuelgan dos
 * boundaries más, cada uno por un motivo distinto: el botón de favorito y el
 * hilo de comentarios leen sesión y base de datos, y no tienen por qué demorar
 * al artículo, que sale de cache.
 */

export const instant = true;

type NewsArticleParams = {id: string};

function readArticleId(value: string) {
  const id = Number.parseInt(value, 10);

  return Number.isFinite(id) && id > 0 ? id : null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<NewsArticleParams>;
}): Promise<Metadata> {
  const id = readArticleId((await params).id);
  const article = id ? await getNewsArticle(id) : null;

  if (!article) return {title: "Noticia no encontrada"};

  return {
    title: article.title,
    description: article.excerpt,
    openGraph: {
      type: "article",
      title: article.title,
      description: article.excerpt,
      publishedTime: article.publishedAt,
      images: article.image ? [{url: article.image}] : undefined,
    },
  };
}

export default function NewsArticlePage({params}: {params: Promise<NewsArticleParams>}) {
  return (
    <main className="flex min-h-dvh w-full flex-col items-center bg-background pt-24 pb-32 text-primary-foreground">
      <Container className="flex flex-col items-start gap-8">
        <Suspense fallback={<ArticleSkeleton />}>
          <ArticleRoute params={params} />
        </Suspense>
      </Container>
    </main>
  );
}

async function ArticleRoute({params}: {params: Promise<NewsArticleParams>}) {
  const id = readArticleId((await params).id);
  const article = id ? await getNewsArticle(id) : null;

  if (!article) notFound();

  return (
    <>
      <ArticleBreadcrumbs
        items={[
          {label: "Archive", href: "/"},
          {label: "News", href: "/news"},
          {label: article.tag},
        ]}
      />

      <ArticleHero
        actions={
          <>
            <Suspense fallback={<FavoriteButtonPlaceholder />}>
              <ArticleFavorite article={article} />
            </Suspense>

            <ShareButton withLabel title={article.title} url={buildArticleHref(article.id)} />
          </>
        }
        article={article}
      />

      <div className="grid w-full grid-cols-1 gap-8 lg:grid-cols-12">
        <div className="min-w-0 lg:col-span-8">
          <ArticleBody article={article} />
        </div>

        <div className="lg:col-span-4">
          <ArticleSidebar article={article} />
        </div>
      </div>

      <ArticleGallery figures={article.figures} />

      <Suspense fallback={null}>
        <RelatedArticlesRow article={article} />
      </Suspense>

      <div className="w-full border-t border-border pt-8">
        <Suspense fallback={<CommentsSectionSkeleton />}>
          <CommentsSection article={article} />
        </Suspense>
      </div>
    </>
  );
}

async function ArticleFavorite({article}: {article: NewsArticleDetail}) {
  const [identity, saved] = await Promise.all([
    getSessionIdentity(),
    isFavorite("news", String(article.id)),
  ]);

  return (
    <FavoriteButton
      item={{
        kind: "news",
        itemId: String(article.id),
        title: article.title,
        description: article.excerpt,
        image: article.image,
        href: buildArticleHref(article.id),
        tag: article.tag,
        tone: article.tone,
      }}
      canSave={Boolean(identity)}
      saved={saved}
    />
  );
}

async function RelatedArticlesRow({article}: {article: NewsArticleDetail}) {
  return <RelatedArticles articles={await getRelatedNews(article)} />;
}

/** Mismas medidas que el contenido, para que nada salte al resolverse. */
function ArticleSkeleton() {
  return (
    <div aria-hidden="true" className="flex w-full animate-pulse flex-col gap-8">
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
          <div className="h-57.75 w-full rounded-lg border border-border bg-card" />
        </div>
      </div>
    </div>
  );
}
