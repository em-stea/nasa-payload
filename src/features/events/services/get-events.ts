import { cacheLife } from 'next/cache'

import {
  EVENT_CATEGORIES,
  EVENT_FILTER_SLUGS,
  type EventCategorySlug,
} from '@/features/events/constants/categories'
import type { EonetEventsResponse, EventsPage, NaturalEvent } from '@/features/events/types/events'
import { distanceKm } from '@/features/events/utils/geo'
import { parseEvent } from '@/features/events/utils/parse-event'
import { NASA_ENDPOINTS } from '@/shared/constants/nasa-endpoints'
import { http } from '@/shared/services/http'

/**
 * Eventos naturales en curso, de EONET.
 *
 * EONET no pagina: acepta `limit` pero no un offset, así que la única forma de
 * servir una página N es traer una ventana y cortarla acá. A cambio la
 * paginación es exacta, sin los huecos entre páginas que obliga a tener el
 * overfetch de las noticias.
 *
 * Lo que no es evidente es cómo se arma esa ventana. Pedir los N eventos más
 * recientes del catálogo entero da un resultado inservible para un mapa
 * mundial: el 99% de lo que EONET tiene abierto son incendios, la mitad de
 * ellos vienen de IRWIN —el sistema interagencial de incendios de Estados
 * Unidos, que solo cubre ese país— y son los que más seguido actualizan su
 * traza, así que copan el orden por fecha. Medido contra la API, el 94% de los
 * primeros noventa caía dentro de Estados Unidos, y agrandar la ventana no
 * mejoraba nada: a dos mil eventos de profundidad seguía en 94%.
 *
 * Así que la ventana se arma por categoría y con cupo (ver `shareQuotas`), y
 * dentro de cada cupo se eligen eventos separados entre sí (ver `pickSpread`).
 * Con eso la misma pantalla baja a ~8% de eventos en Estados Unidos y las ocho
 * franjas de longitud del planisferio quedan pobladas.
 */

/** Tres filas de tres, como el grid del diseño. */
export const EVENTS_PER_PAGE = 9

/**
 * Cuántos eventos entran en la ventana. Diez páginas alcanzan para recorrer lo
 * que hay pasando en un momento dado sin volver la respuesta pesada: las
 * tormentas llegan con trazas de cientos de puntos.
 */
const EVENTS_WINDOW = EVENTS_PER_PAGE * 10

/**
 * Cuántos eventos se le piden a EONET por categoría. Sobra de más para que el
 * cupo y la separación geográfica tengan de dónde elegir.
 */
const CATEGORY_FETCH_LIMIT = EVENTS_WINDOW * 6

/** Ventana temporal de las categorías que se consultan por fecha (`recent`). */
const RECENT_DAYS = 30

/**
 * Distancia mínima entre dos eventos de la misma categoría.
 *
 * Las fuentes globales reportan por foco, no por incendio: una misma temporada
 * seca en el sur de África llega como decenas de eventos a pocos kilómetros
 * unos de otros. Sin este filtro el cupo de incendios se consume entero en
 * Angola y el resto del mundo queda sin marcador. 400 km es el orden de
 * magnitud de una provincia grande: junta lo que en el mapa sería un solo
 * punto y deja pasar lo que se lee como dos.
 */
const MIN_SEPARATION_KM = 400

/**
 * Los eventos de una categoría, parseados y del más reciente al más viejo.
 *
 * Es el único punto que le pega a EONET, y cada categoría es su propia entrada
 * de cache: la vista sin filtro las junta todas y la filtrada reusa la que ya
 * está, así que navegar por los chips no dispara ninguna llamada nueva.
 */
async function getCategoryPool(category: EventCategorySlug): Promise<NaturalEvent[]> {
  'use cache'
  // EONET actualiza las trazas varias veces al día, nunca al segundo.
  cacheLife('minutes')

  const now = Date.now()
  const { feed } = EVENT_CATEGORIES[category]

  const { data } = await http.get<EonetEventsResponse>(`${NASA_ENDPOINTS.eonet}/events`, {
    searchParams: {
      category,
      limit: CATEGORY_FETCH_LIMIT,
      status: feed === 'open' ? 'open' : 'all',
      days: feed === 'recent' ? RECENT_DAYS : undefined,
    },
    // Las trazas de los ciclones hacen respuestas grandes.
    timeoutMs: 15_000,
  })

  return data.events
    .map((event) => parseEvent(event, now))
    .filter((event): event is NaturalEvent => event !== null)
    .sort((a, b) => Date.parse(b.position.date) - Date.parse(a.position.date))
}

/**
 * Reparte `total` lugares entre categorías de tamaños distintos.
 *
 * Parejo mientras se pueda: lo que una categoría no llega a llenar —hay cuatro
 * ciclones en el planeta, no dieciocho— vuelve a repartirse entre las que
 * todavía tienen de dónde sacar. Sin esto el reparto parejo desperdicia los
 * lugares de las categorías chicas y la ventana queda corta.
 */
function shareQuotas(available: readonly number[], total: number): number[] {
  const quotas = available.map(() => 0)
  let left = total

  while (left > 0) {
    const hungry = quotas.flatMap((quota, index) => (quota < available[index] ? [index] : []))

    if (hungry.length === 0) break

    const share = Math.max(1, Math.floor(left / hungry.length))

    for (const index of hungry) {
      if (left <= 0) break

      const added = Math.min(share, available[index] - quotas[index], left)

      quotas[index] += added
      left -= added
    }
  }

  return quotas
}

/**
 * Hasta `quota` eventos de la lista, salteando los que caen encima de uno ya
 * elegido. Si la separación no alcanza a llenar el cupo se completa con los
 * descartados: mejor un par de vecinos que una página a medio llenar.
 */
function pickSpread(events: readonly NaturalEvent[], quota: number): NaturalEvent[] {
  const picked: NaturalEvent[] = []
  const crowded: NaturalEvent[] = []

  for (const event of events) {
    if (picked.length >= quota) break

    const overlaps = picked.some(
      (other) => distanceKm(other.position, event.position) < MIN_SEPARATION_KM,
    )

    if (overlaps) crowded.push(event)
    else picked.push(event)
  }

  return picked.concat(crowded.slice(0, quota - picked.length))
}

/**
 * La ventana que ven el grid y el mapa.
 *
 * Con un chip activo es esa categoría sola, igual de esparcida. Sin filtro, las
 * cinco con cupo, mezcladas y reordenadas por fecha para que el listado siga
 * leyéndose como una línea de tiempo y no como cinco bloques pegados.
 */
async function getEventWindow(category?: EventCategorySlug): Promise<NaturalEvent[]> {
  if (category) return pickSpread(await getCategoryPool(category), EVENTS_WINDOW)

  const pools = await Promise.all(EVENT_FILTER_SLUGS.map((slug) => getCategoryPool(slug)))
  const quotas = shareQuotas(
    pools.map((pool) => pool.length),
    EVENTS_WINDOW,
  )

  return pools
    .flatMap((pool, index) => pickSpread(pool, quotas[index]))
    .sort((a, b) => Date.parse(b.position.date) - Date.parse(a.position.date))
}

type GetEventsParams = {
  page?: number
  category?: EventCategorySlug
}

export async function getEvents({ page = 1, category }: GetEventsParams = {}): Promise<EventsPage> {
  const events = await getEventWindow(category)

  const totalPages = Math.max(Math.ceil(events.length / EVENTS_PER_PAGE), 1)
  const safePage = Math.min(Math.max(Math.trunc(page) || 1, 1), totalPages)
  const start = (safePage - 1) * EVENTS_PER_PAGE

  return {
    events: events.slice(start, start + EVENTS_PER_PAGE),
    page: safePage,
    totalPages,
    totalEvents: events.length,
  }
}

/** Todos los eventos de la ventana, para los marcadores del planisferio. */
export async function getEventMarkers(): Promise<NaturalEvent[]> {
  return getEventWindow()
}
