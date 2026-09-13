import {
  resolveEventCategory,
  type EventCategory,
  type EventMetricKind,
} from '@/features/events/constants/categories'
import type {
  EonetEvent,
  EonetGeometry,
  EventPoint,
  EventStat,
  EventStatus,
  NaturalEvent,
  NaturalEventDetail,
} from '@/features/events/types/events'
import { bearingLabel, distanceKm, formatCoords, hoursBetween } from '@/features/events/utils/geo'

/**
 * Baja un evento de EONET a lo que pinta la UI.
 *
 * EONET publica poco y bien: identificador, categoría, fuentes y una traza de
 * posiciones fechadas. Todo lo que el diseño muestra como telemetría se deriva
 * de ahí —magnitud, rumbo, velocidad de desplazamiento— y lo que la API no
 * publica se muestra como `—` en vez de inventarse.
 *
 * `now` entra por parámetro en vez de leerse acá adentro para que el parseo
 * sea puro: quien lo llama es el service, que ya está bajo `'use cache'`, y así
 * el instante contra el que se mide la frescura queda congelado junto con el
 * resto de la entrada de cache.
 */

const KNOTS_TO_KMH = 1.852
const ACRES_TO_HECTARES = 0.404686

/** Horas desde la última actualización para considerar al evento en curso. */
const CRITICAL_HOURS = 24
const ELEVATED_HOURS = 72

/** Escala Saffir-Simpson, que es la unidad con la que EONET reporta ciclones. */
const HURRICANE_KNOTS = 64
const TROPICAL_STORM_KNOTS = 34

/** Parte numérica del id de EONET: `EONET_24184` -> `24184`. */
export function toEventRef(id: string) {
  return id.replace(/^EONET_/, '')
}

/** Id completo a partir de lo que viaja en la URL. */
export function toEventId(ref: string) {
  return `EONET_${ref}`
}

/** Ruta del detalle dentro del sitio. */
export function buildEventHref(ref: string) {
  return `/events/${ref}`
}

/** Etiqueta del diseño: `EVT.ID.24184.WF`. */
export function buildEventCode(ref: string, category: EventCategory) {
  return `EVT.ID.${ref}.${category.code}`
}

function formatNumber(value: number, fractionDigits = 0) {
  return value.toLocaleString('en-US', {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  })
}

/**
 * Centro de una geometría.
 *
 * Casi todas son `Point`, pero los incendios grandes llegan como `Polygon`: de
 * esos tomamos el centro de la caja que los contiene, que es lo que hay que
 * clavar en el mapa.
 */
function toCenter(geometry: EonetGeometry): { lat: number; lng: number } | null {
  if (geometry.type === 'Point') {
    const [lng, lat] = geometry.coordinates as number[]

    return Number.isFinite(lat) && Number.isFinite(lng) ? { lat, lng } : null
  }

  const ring = (geometry.coordinates as number[][][])[0]

  if (!Array.isArray(ring) || ring.length === 0) return null

  const lngs = ring.map(([lng]) => lng)
  const lats = ring.map(([, lat]) => lat)

  return {
    lat: (Math.min(...lats) + Math.max(...lats)) / 2,
    lng: (Math.min(...lngs) + Math.max(...lngs)) / 2,
  }
}

function toEventPoint(geometry: EonetGeometry): EventPoint | null {
  const center = toCenter(geometry)

  if (!center) return null

  return {
    ...center,
    date: geometry.date,
    magnitude: geometry.magnitudeValue,
    magnitudeUnit: geometry.magnitudeUnit,
  }
}

/** La traza completa, ordenada del punto más viejo al más nuevo. */
function toTrack(geometry: EonetGeometry[]): EventPoint[] {
  return geometry
    .map(toEventPoint)
    .filter((point): point is EventPoint => point !== null)
    .sort((a, b) => Date.parse(a.date) - Date.parse(b.date))
}

/**
 * Nivel de alerta.
 *
 * EONET no publica severidad, así que se deduce de lo que sí publica: para
 * ciclones, de la escala en nudos; para el resto, de hace cuánto que no se
 * actualiza la traza. Un evento cerrado baja a `monitoring` sin importar la
 * magnitud: ya no está pasando.
 */
function resolveStatus(event: EonetEvent, last: EventPoint, now: number): EventStatus {
  if (event.closed) return 'monitoring'

  if (last.magnitudeUnit === 'kts' && last.magnitude !== null) {
    if (last.magnitude >= HURRICANE_KNOTS) return 'critical'
    if (last.magnitude >= TROPICAL_STORM_KNOTS) return 'elevated'

    return 'monitoring'
  }

  const age = hoursBetween(last.date, new Date(now).toISOString())

  if (age <= CRITICAL_HOURS) return 'critical'
  if (age <= ELEVATED_HOURS) return 'elevated'

  return 'monitoring'
}

/** Magnitud tal como la publica EONET: `55 KTS`, `12,000 ACRES`. */
function formatSeverity(last: EventPoint) {
  if (last.magnitude === null || !last.magnitudeUnit) return 'UNRATED'

  return `${formatNumber(last.magnitude)} ${last.magnitudeUnit.toUpperCase()}`
}

/**
 * Cuarta fila de la card: el dato que mejor describe a cada categoría.
 * Si EONET no lo publica para ese evento, va `—`.
 */
function buildMetric(kind: EventMetricKind, event: EonetEvent, track: EventPoint[]): EventStat {
  const last = track[track.length - 1]
  const previous = track[track.length - 2]

  switch (kind) {
    case 'wind':
      return {
        label: 'Wind',
        value:
          last.magnitudeUnit === 'kts' && last.magnitude !== null
            ? `${formatNumber(last.magnitude * KNOTS_TO_KMH)} KM/H`
            : '—',
        accent: true,
      }

    case 'area':
      return {
        label: 'Area',
        value:
          last.magnitudeUnit?.toLowerCase() === 'acres' && last.magnitude !== null
            ? `${formatNumber(last.magnitude * ACRES_TO_HECTARES)} HA`
            : '—',
      }

    case 'status':
      return { label: 'Status', value: event.closed ? 'DORMANT' : 'ACTIVE', accent: !event.closed }

    case 'drift': {
      if (!previous) return { label: 'Drift', value: '—' }

      const hours = hoursBetween(previous.date, last.date)

      return {
        label: 'Drift',
        value: hours > 0 ? `${(distanceKm(previous, last) / hours).toFixed(1)} KM/H` : '—',
      }
    }

    case 'updated':
      return { label: 'Track', value: `${String(track.length).padStart(2, '0')} PTS` }
  }
}

export function parseEvent(event: EonetEvent, now: number): NaturalEvent | null {
  const track = toTrack(event.geometry)
  const last = track[track.length - 1]

  // Sin una posición válida no hay card que pintar ni marcador que ubicar.
  if (!last) return null

  const category = resolveEventCategory(event.categories.map(({ id }) => id))
  const ref = toEventRef(event.id)

  return {
    id: event.id,
    ref,
    code: buildEventCode(ref, category),
    href: buildEventHref(ref),
    title: event.title,
    category,
    status: resolveStatus(event, last, now),
    position: last,
    coords: formatCoords(last.lat, last.lng),
    severity: formatSeverity(last),
    metric: buildMetric(category.metric, event, track),
  }
}

export function parseEventDetail(event: EonetEvent, now: number): NaturalEventDetail | null {
  const base = parseEvent(event, now)

  if (!base) return null

  return {
    ...base,
    description: event.description ?? undefined,
    sourceUrl: `https://eonet.gsfc.nasa.gov/api/v3/events/${event.id}`,
    sources: event.sources,
    track: toTrack(event.geometry),
    closed: event.closed,
  }
}

/** Rumbo del tramo final de la traza; `null` si el evento no se movió. */
export function resolveHeading(track: EventPoint[]) {
  const last = track[track.length - 1]
  const previous = track[track.length - 2]

  if (!previous || !last) return null

  return bearingLabel(previous, last)
}
