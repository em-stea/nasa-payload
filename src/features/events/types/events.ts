/**
 * Eventos naturales de EONET (Earth Observatory Natural Event Tracker).
 *
 * Es la API de la NASA que publica el catálogo de catástrofes naturales en
 * curso —incendios, ciclones, volcanes, inundaciones, hielo— con la traza
 * geográfica de cada una. Es la única fuente pública de la NASA con eventos
 * georreferenciados y fechados, que es exactamente lo que pinta esta sección.
 */

import type { EventCategory } from '@/features/events/constants/categories'

/** Un punto de la traza: dónde estaba el evento y con qué magnitud. */
export type EonetGeometry = {
  magnitudeValue: number | null
  magnitudeUnit: string | null
  date: string
  type: 'Point' | 'Polygon'
  /** `Point` trae `[lng, lat]`; `Polygon`, anillos de `[lng, lat]`. */
  coordinates: number[] | number[][][]
}

export type EonetEvent = {
  id: string
  title: string
  description: string | null
  link: string
  /** Fecha de cierre, o `null` si el evento sigue abierto. */
  closed: string | null
  categories: { id: string; title: string }[]
  sources: { id: string; url: string }[]
  geometry: EonetGeometry[]
}

export type EonetEventsResponse = { events: EonetEvent[] }

/**
 * Nivel de alerta del evento.
 *
 * EONET no publica una severidad: la derivamos de la magnitud y de cuándo fue
 * la última actualización de la traza (ver `resolveStatus`).
 */
export type EventStatus = 'critical' | 'elevated' | 'monitoring'

/** Una posición fechada de la traza, ya normalizada. */
export type EventPoint = {
  lat: number
  lng: number
  /** ISO tal como lo publica EONET. */
  date: string
  magnitude: number | null
  magnitudeUnit: string | null
}

/** Fila de datos de la card y del detalle: rótulo + valor ya formateado. */
export type EventStat = {
  label: string
  value: string
  /** Pinta el valor con el color de la categoría. */
  accent?: boolean
}

/** Evento listo para pintar en el grid. */
export type NaturalEvent = {
  /** Id completo de EONET: `EONET_24184`. */
  id: string
  /** Parte numérica; es lo que viaja en la URL del detalle. */
  ref: string
  /** Etiqueta del diseño: `EVT.ID.24184.WF`. */
  code: string
  href: string
  title: string
  category: EventCategory
  status: EventStatus
  /** Última posición conocida. */
  position: EventPoint
  /** `55.932° N, 110.345° W` */
  coords: string
  /** Magnitud formateada, o `UNRATED` cuando EONET no la publica. */
  severity: string
  /** Cuarta fila de la card; cambia según la categoría. */
  metric: EventStat
}

/** Evento completo: lo que pinta `/events/[id]`. */
export type NaturalEventDetail = NaturalEvent & {
  description?: string
  /** Ficha del evento en eonet.gsfc.nasa.gov. */
  sourceUrl: string
  sources: { id: string; url: string }[]
  /** Traza completa, del punto más viejo al más nuevo. */
  track: EventPoint[]
  closed: string | null
}

export type EventsPage = {
  events: NaturalEvent[]
  page: number
  totalPages: number
  totalEvents: number
}
