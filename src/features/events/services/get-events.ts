import { cacheLife } from 'next/cache'

import {
  EVENT_CATEGORIES,
  isEventCategorySlug,
  type EventCategorySlug,
} from '@/features/events/constants/categories'
import type { EonetEventsResponse, EventsPage, NaturalEvent } from '@/features/events/types/events'
import { parseEvent } from '@/features/events/utils/parse-event'
import { NASA_ENDPOINTS } from '@/shared/constants/nasa-endpoints'
import { http } from '@/shared/services/http'

/**
 * Eventos naturales en curso, de EONET.
 *
 * A diferencia del feed de noticias, EONET no pagina: acepta `limit` pero no
 * un offset, así que la única forma de servir una página N es traer una
 * ventana y cortarla acá. No es tan caro como suena —entra en una sola llamada
 * y queda cacheada para todas las páginas que se sirvan de ella— y a cambio la
 * paginación es exacta, sin los huecos entre páginas que obliga a tener el
 * overfetch de las noticias.
 */

/** Tres filas de tres, como el grid del diseño. */
export const EVENTS_PER_PAGE = 9

/**
 * Cuántos eventos se traen por consulta. Diez páginas alcanzan para recorrer
 * lo que hay abierto en un momento dado sin volver la respuesta pesada: las
 * tormentas llegan con trazas de cientos de puntos.
 */
const EVENTS_WINDOW = EVENTS_PER_PAGE * 10

/**
 * La ventana completa, ya parseada.
 *
 * Es el único punto que le pega a EONET. El grid la pagina y el mapa del hero
 * la marca entera, y como las dos pasan por acá comparten la misma entrada de
 * cache: una sola llamada alimenta la pantalla completa.
 */
async function getEventWindow(category?: EventCategorySlug): Promise<NaturalEvent[]> {
  'use cache'
  // EONET actualiza las trazas varias veces al día, nunca al segundo.
  cacheLife('minutes')

  const now = Date.now()

  const { data } = await http.get<EonetEventsResponse>(`${NASA_ENDPOINTS.eonet}/events`, {
    searchParams: {
      status: 'open',
      limit: EVENTS_WINDOW,
      category: isEventCategorySlug(category) ? EVENT_CATEGORIES[category].id : undefined,
    },
    // Las trazas de los ciclones hacen respuestas grandes.
    timeoutMs: 15_000,
  })

  return data.events
    .map((event) => parseEvent(event, now))
    .filter((event): event is NaturalEvent => event !== null)
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

/** Todos los eventos abiertos, para los marcadores del planisferio del hero. */
export async function getEventMarkers(): Promise<NaturalEvent[]> {
  return getEventWindow()
}
