import type {AsteroidPage, NeoBrowseResponse} from "@/features/asteroids/types/asteroid";

import {cacheLife} from "next/cache";

import {parseAsteroid} from "@/features/asteroids/utils/parse-asteroid";
import {FRONT_ENV} from "@/shared/config/front-config";
import {NASA_ENDPOINTS} from "@/shared/constants/nasa-endpoints";
import {http, HttpError} from "@/shared/services/http";

/**
 * Catálogo de objetos cercanos a la Tierra (NeoWs `/neo/browse`).
 *
 * Es el único endpoint de la NASA que pagina el catálogo entero en vez de
 * acotarlo a una ventana de fechas: `/feed` devuelve lo que pasa esta semana y
 * se queda sin objetos enseguida, y el DISCOVERY LOG del diseño es un archivo,
 * no un parte diario.
 */

/** Tres filas de tres, como el grid del diseño. */
export const ASTEROIDS_PER_PAGE = 9;

/**
 * El catálogo tiene más de 4000 páginas de a nueve. Cortamos la paginación en
 * un número que la UI pueda mostrar sin que navegar sea una expedición, igual
 * que en el archivo de noticias.
 */
const MAX_PAGES = 99;

/**
 * Cada objeto viene con su historial completo de aproximaciones —de 1900 a
 * 2200 en los más observados— y NeoWs no acepta recortar campos, así que una
 * página pesa bastante más que una de noticias.
 */
const TIMEOUT_MS = 15_000;

type GetAsteroidFeedParams = {
  page?: number;
};

export async function getAsteroidFeed({
  page = 1,
}: GetAsteroidFeedParams = {}): Promise<AsteroidPage> {
  "use cache";
  // El catálogo crece con cada descubrimiento confirmado, no cada minuto.
  cacheLife("hours");

  const safePage = Math.min(Math.max(Math.trunc(page) || 1, 1), MAX_PAGES);

  try {
    const {data} = await http.get<NeoBrowseResponse>(`${NASA_ENDPOINTS.neo}/neo/browse`, {
      searchParams: {
        // NeoWs pagina desde cero; la UI, desde uno.
        page: safePage - 1,
        size: ASTEROIDS_PER_PAGE,
        api_key: FRONT_ENV.NEXT_PUBLIC_NASA_API_KEY,
      },
      timeoutMs: TIMEOUT_MS,
    });

    // Una sola lectura del reloj para toda la página: si cada objeto leyera la
    // suya, dos asteroides al filo de una aproximación podrían quedar uno como
    // "próxima" y el otro como "última".
    const now = Date.now();

    return {
      asteroids: data.near_earth_objects.map((neo) => parseAsteroid(neo, now)),
      page: safePage,
      totalPages: Math.min(data.page?.total_pages ?? 1, MAX_PAGES),
      totalAsteroids: data.page?.total_elements ?? 0,
    };
  } catch (error) {
    // NeoWs responde 400 cuando la página pedida excede el total. Es una URL
    // inválida, no una caída: devolvemos vacío y la página resuelve el 404.
    if (error instanceof HttpError && error.status === 400) {
      return {asteroids: [], page: safePage, totalPages: 0, totalAsteroids: 0};
    }

    throw error;
  }
}
