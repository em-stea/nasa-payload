import type {ApodImage, ApodPost} from "@/features/apod/types/apod";

import {cacheLife, cacheTag} from "next/cache";

import {parseApodPost} from "@/features/apod/utils/parse-apod";
import {NASA_ENDPOINTS} from "@/shared/constants/nasa-endpoints";
import {http} from "@/shared/services/http";

/**
 * La Astronomy Picture of the Day vigente.
 *
 * El endpoint no acepta un id: siempre devuelve la foto del día, así que la
 * misma llamada alimenta el hero de la home y su detalle. Cachear por horas
 * evita repetir el fetch entre ambas vistas sin arriesgarse a mostrar la foto
 * de ayer una vez que NASA publique la de hoy.
 */
export async function getAPODImage(): Promise<ApodImage> {
  "use cache";
  cacheLife("hours");
  cacheTag("apod-image");

  const {data} = await http.get<ApodPost[]>(`${NASA_ENDPOINTS.apod}/apod-basic`, {
    searchParams: {page: 1, per_page: 1},
  });

  return parseApodPost(data[0]);
}
