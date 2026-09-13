import type {NewsArticle} from "@/features/news/types/news";

import {NEWS_CATEGORIES, type NewsCategorySlug} from "@/features/news/constants/categories";
import {getLatestNews} from "@/features/news/services/get-latest-news";

/** Cuántas cards entran en la fila de "Related articles" del diseño. */
export const RELATED_NEWS_COUNT = 3;

function findCategorySlug(label: string): NewsCategorySlug | undefined {
  const entry = Object.entries(NEWS_CATEGORIES).find(([, category]) => category.label === label);

  return entry?.[0] as NewsCategorySlug | undefined;
}

/**
 * Noticias de la misma categoría que la que se está leyendo.
 *
 * Se apoya en `getLatestNews`, así que comparte su cache: si el lector viene
 * del listado filtrado por esa categoría, la fila ya está resuelta. Pedimos
 * una de más porque el artículo actual suele estar entre las últimas.
 */
export async function getRelatedNews(article: {id: number; tag: string}): Promise<NewsArticle[]> {
  const {articles} = await getLatestNews({category: findCategorySlug(article.tag)});

  return articles.filter((item) => item.id !== article.id).slice(0, RELATED_NEWS_COUNT);
}
