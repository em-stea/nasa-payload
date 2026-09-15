import type {
  ImagesApiItem,
  ImagesSearchResponse,
  LatestFrontier,
  LatestFrontiersPage,
} from "@/features/latest-frontiers/types/latest-frontier";

import {cacheLife} from "next/cache";

import {NASA_ENDPOINTS} from "@/shared/constants/nasa-endpoints";
import {http} from "@/shared/services/http";

/** Tres filas de tres, como el resto de los listados del sitio. */
export const LATEST_FRONTIERS_PER_PAGE = 9;

/** El catálogo tiene miles de páginas; cortamos donde la UI deja de ser navegable. */
const MAX_PAGES = 99;

type GetLatestFrontiersParams = {
  page?: number;
  pageSize?: number;
};

/**
 * Sin keywords no hay tag para la card, así que el item no sirve para este
 * listado.
 */
function parseLatestFrontier(item: ImagesApiItem): LatestFrontier | null {
  const info = item.data[0];
  const keywords = info?.keywords;

  if (!info || !keywords || keywords.length === 0) return null;

  return {
    id: info.nasa_id,
    tag: keywords[0].toUpperCase(),
    title: info.title,
    description: info.description ? `${info.description.slice(0, 120)}...` : "",
    image: item.links?.[0]?.href,
    date: new Date(info.date_created).toISOString().split("T")[0],
  };
}

export async function getLatestFrontiers({
  page = 1,
  pageSize = LATEST_FRONTIERS_PER_PAGE,
}: GetLatestFrontiersParams = {}): Promise<LatestFrontiersPage> {
  "use cache";
  // El catálogo suma imágenes varias veces al día, pero nunca al segundo.
  cacheLife("minutes");

  const currentYear = new Date().getFullYear();
  const safePage = Math.min(Math.max(Math.trunc(page) || 1, 1), MAX_PAGES);

  const {data} = await http.get<ImagesSearchResponse>(`${NASA_ENDPOINTS.images}/search`, {
    searchParams: {
      media_type: "image",
      year_start: currentYear,
      page: safePage,
      page_size: pageSize,
    },
  });

  const items = data.collection.items.flatMap((item) => {
    const frontier = parseLatestFrontier(item);

    return frontier ? [frontier] : [];
  });

  const totalItems = data.collection.metadata?.total_hits ?? items.length;

  return {
    items,
    page: safePage,
    totalPages: Math.min(Math.max(Math.ceil(totalItems / pageSize), 1), MAX_PAGES),
    totalItems,
  };
}
