import type {AsteroidDetail, NeoObject} from "@/features/asteroids/types/asteroid";

import {cacheLife, cacheTag} from "next/cache";

import {parseAsteroidDetail} from "@/features/asteroids/utils/parse-asteroid";
import {FRONT_ENV} from "@/shared/config/front-config";
import {NASA_ENDPOINTS} from "@/shared/constants/nasa-endpoints";
import {http, HttpError} from "@/shared/services/http";

/**
 * Un objeto del catálogo, pedido por su id de NeoWs.
 *
 * Es el mismo recurso que alimenta el listado, pero de a uno: `/neo/browse` ya
 * trae los datos orbitales completos, así que el detalle no pide nada extra —
 * lo pide de nuevo porque la página puede abrirse directo, sin pasar por el
 * listado.
 */

const TIMEOUT_MS = 15_000;

export async function getAsteroid(id: string): Promise<AsteroidDetail | null> {
  "use cache";
  // Los elementos orbitales se recalculan cuando entra una observación nueva,
  // que para la enorme mayoría de los objetos es cuestión de meses.
  cacheLife("hours");
  cacheTag(`asteroid-${id}`);

  try {
    const {data} = await http.get<NeoObject>(`${NASA_ENDPOINTS.neo}/neo/${id}`, {
      searchParams: {api_key: FRONT_ENV.NEXT_PUBLIC_NASA_API_KEY},
      timeoutMs: TIMEOUT_MS,
    });

    return parseAsteroidDetail(data, Date.now());
  } catch (error) {
    // 404 es un id que no existe en el catálogo: la página resuelve el
    // not-found, no un error.
    if (error instanceof HttpError && error.status === 404) {
      return null;
    }

    throw error;
  }
}
