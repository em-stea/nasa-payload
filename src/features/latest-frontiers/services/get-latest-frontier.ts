import type {
  ImagesApiItem,
  ImagesSearchResponse,
  LatestFrontierDetail,
} from "@/features/latest-frontiers/types/latest-frontier";

import {cacheLife, cacheTag} from "next/cache";

import {NASA_ENDPOINTS} from "@/shared/constants/nasa-endpoints";
import {http} from "@/shared/services/http";

/**
 * De las renditions que trae el catálogo, la que mejor se ve a sangre en el
 * detalle sin pesar como el `~orig`.
 */
function pickDetailImage(links: ImagesApiItem["links"]) {
  if (!links || links.length === 0) return undefined;

  return (
    links.find((link) => link.href.includes("~large"))?.href ??
    links.find((link) => link.render === "image")?.href ??
    links[0].href
  );
}

/**
 * Un item del catálogo, pedido por su `nasa_id`.
 *
 * `images-api.nasa.gov` no tiene un endpoint de detalle: se filtra `/search`
 * por `nasa_id`, que devuelve el mismo item que trae el listado pero solo.
 */
export async function getLatestFrontier(id: string): Promise<LatestFrontierDetail | null> {
  "use cache";
  cacheLife("minutes");
  cacheTag(`latest-frontier-${id}`);

  const {data} = await http.get<ImagesSearchResponse>(`${NASA_ENDPOINTS.images}/search`, {
    searchParams: {nasa_id: id},
  });

  const item = data.collection.items[0];
  const info = item?.data[0];

  // `nasa_id` inexistente responde 200 con items vacío, no 404.
  if (!info) return null;

  return {
    id: info.nasa_id,
    tag: (info.keywords?.[0] ?? "FRONTIER").toUpperCase(),
    tags: info.keywords ?? [],
    title: info.title,
    description: info.description ?? "",
    image: pickDetailImage(item.links),
    date: new Date(info.date_created).toISOString().split("T")[0],
    dateTime: info.date_created,
    center: info.center,
    photographer: info.photographer,
    location: info.location,
  };
}
