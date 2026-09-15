import {NASA_ENDPOINTS} from "@/shared/constants/nasa-endpoints";
import {http} from "@/shared/services/http";

type MissionImageSearchResponse = {
  collection: {
    items: Array<{
      links?: Array<{href: string}>;
    }>;
  };
};

/**
 * TechPort no publica fotos propias del proyecto: se busca una en el catálogo
 * de imágenes por el título, la misma estrategia que usa el preview de
 * Featured Missions en el home.
 */
export async function findMissionImage(title: string): Promise<string | undefined> {
  const cleanQuery = title.split(" ").slice(0, 3).join(" ");

  const {data} = await http.get<MissionImageSearchResponse>(`${NASA_ENDPOINTS.images}/search`, {
    searchParams: {q: cleanQuery, media_type: "image", page_size: 1},
  });

  const item = data.collection.items?.[0];

  return item?.links?.[2]?.href ?? item?.links?.[0]?.href;
}
