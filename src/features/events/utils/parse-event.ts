import type {
  EonetEvent,
  EonetGeometry,
  EventPoint,
  EventStat,
  EventStatus,
  NaturalEvent,
  NaturalEventDetail,
} from "@/features/events/types/events";

import {
  type EventCategory,
  type EventMetricKind,
  resolveEventCategory,
} from "@/features/events/constants/categories";
import {bearingLabel, distanceKm, formatCoords, hoursBetween} from "@/features/events/utils/geo";

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

const KNOTS_TO_KMH = 1.852;
const ACRES_TO_HECTARES = 0.404686;

/** Horas desde la última actualización para considerar al evento en curso. */
const CRITICAL_HOURS = 24;
const ELEVATED_HOURS = 72;

/** Escala Saffir-Simpson, que es la unidad con la que EONET reporta ciclones. */
const HURRICANE_KNOTS = 64;
const TROPICAL_STORM_KNOTS = 34;

/** Parte numérica del id de EONET: `EONET_24184` -> `24184`. */
export function toEventRef(id: string) {
  return id.replace(/^EONET_/, "");
}

/** Id completo a partir de lo que viaja en la URL. */
export function toEventId(ref: string) {
  return `EONET_${ref}`;
}

/** Ruta del detalle dentro del sitio. */
export function buildEventHref(ref: string) {
  return `/events/${ref}`;
}

/** Etiqueta del diseño: `EVT.ID.24184.WF`. */
export function buildEventCode(ref: string, category: EventCategory) {
  return `EVT.ID.${ref}.${category.code}`;
}

function formatNumber(value: number, fractionDigits = 0) {
  return value.toLocaleString("en-US", {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  });
}

/**
 * Centro de una geometría.
 *
 * Casi todas son `Point`. Las que no, son las inundaciones: GDACS las publica
 * como `Polygon` y de ahí sale el centro de la caja que las contiene, que es
 * lo que hay que clavar en el mapa.
 *
 * Y ahí está la trampa: esos anillos vienen `[lat, lng]`, al revés del orden
 * que manda GeoJSON y que usan los `Point` de la misma API. Leídos al derecho,
 * la inundación de Perú aterriza en la Antártida y la de Japón ni siquiera da
 * una latitud válida.
 *
 * En vez de confiar en la fuente se deduce del propio anillo: una latitud no
 * puede pasar de 90°, así que el eje que se sale de ese rango es la longitud.
 * Cuando los dos entran —un evento cerca del ecuador y del meridiano cero— se
 * asume `[lat, lng]`, que es como EONET publica todos los polígonos que tiene.
 */
function toCenter(geometry: EonetGeometry): {lat: number; lng: number} | null {
  if (geometry.type === "Point") {
    const [lng, lat] = geometry.coordinates as number[];

    return Number.isFinite(lat) && Number.isFinite(lng) ? {lat, lng} : null;
  }

  const ring = (geometry.coordinates as number[][][])[0];

  if (!Array.isArray(ring) || ring.length === 0) return null;

  const first = ring.map(([value]) => value).filter(Number.isFinite);
  const second = ring.map(([, value]) => value).filter(Number.isFinite);

  if (first.length === 0 || second.length === 0) return null;

  const center = (values: number[]) => (Math.min(...values) + Math.max(...values)) / 2;
  const exceedsLatRange = (values: number[]) => values.some((value) => Math.abs(value) > 90);

  return exceedsLatRange(second) || !exceedsLatRange(first)
    ? {lat: center(first), lng: center(second)}
    : {lat: center(second), lng: center(first)};
}

function toEventPoint(geometry: EonetGeometry): EventPoint | null {
  const center = toCenter(geometry);

  if (!center) return null;

  return {
    ...center,
    date: geometry.date,
    magnitude: geometry.magnitudeValue,
    magnitudeUnit: geometry.magnitudeUnit,
  };
}

/** La traza completa, ordenada del punto más viejo al más nuevo. */
function toTrack(geometry: EonetGeometry[]): EventPoint[] {
  return geometry
    .map(toEventPoint)
    .filter((point): point is EventPoint => point !== null)
    .sort((a, b) => Date.parse(a.date) - Date.parse(b.date));
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
  if (event.closed) return "monitoring";

  if (last.magnitudeUnit === "kts" && last.magnitude !== null) {
    if (last.magnitude >= HURRICANE_KNOTS) return "critical";
    if (last.magnitude >= TROPICAL_STORM_KNOTS) return "elevated";

    return "monitoring";
  }

  const age = hoursBetween(last.date, new Date(now).toISOString());

  if (age <= CRITICAL_HOURS) return "critical";
  if (age <= ELEVATED_HOURS) return "elevated";

  return "monitoring";
}

/**
 * Rótulo de la unidad.
 *
 * EONET arrastra la notación de cada fuente: los nudos en minúscula, las
 * hectáreas en singular, las millas náuticas cuadradas con acento circunflejo.
 * En mayúsculas quedaban como `HECTARE` y `NM^2`; lo que no está acá pasa
 * derecho en mayúsculas, que es lo correcto para `ACRES` o `KTS`.
 */
const UNIT_LABELS: Record<string, string> = {
  hectare: "HA",
  hectares: "HA",
  "nm^2": "NM²",
};

function formatUnit(unit: string) {
  return UNIT_LABELS[unit.toLowerCase()] ?? unit.toUpperCase();
}

/**
 * Superficie del incendio en hectáreas.
 *
 * Las dos fuentes de incendios no publican en la misma unidad: IRWIN manda
 * acres y GDACS ya manda hectáreas. La card muestra una sola, así que acá se
 * normaliza en vez de mostrar `—` para la mitad del catálogo.
 */
function toHectares(last: EventPoint) {
  if (last.magnitude === null) return null;

  switch (last.magnitudeUnit?.toLowerCase()) {
    case "acres":
      return last.magnitude * ACRES_TO_HECTARES;
    case "hectare":
    case "hectares":
      return last.magnitude;
    default:
      return null;
  }
}

/** Magnitud tal como la publica EONET: `55 KTS`, `12,000 HA`. */
function formatSeverity(last: EventPoint) {
  if (last.magnitude === null || !last.magnitudeUnit) return "UNRATED";

  return `${formatNumber(last.magnitude)} ${formatUnit(last.magnitudeUnit)}`;
}

/**
 * Cuarta fila de la card: el dato que mejor describe a cada categoría.
 * Si EONET no lo publica para ese evento, va `—`.
 */
function buildMetric(kind: EventMetricKind, event: EonetEvent, track: EventPoint[]): EventStat {
  const last = track[track.length - 1];
  const previous = track[track.length - 2];

  switch (kind) {
    case "wind":
      return {
        label: "Wind",
        value:
          last.magnitudeUnit === "kts" && last.magnitude !== null
            ? `${formatNumber(last.magnitude * KNOTS_TO_KMH)} KM/H`
            : "—",
        accent: true,
      };

    case "area": {
      const hectares = toHectares(last);

      return {
        label: "Area",
        value: hectares === null ? "—" : `${formatNumber(hectares)} HA`,
      };
    }

    case "status":
      return {label: "Status", value: event.closed ? "DORMANT" : "ACTIVE", accent: !event.closed};

    case "drift": {
      if (!previous) return {label: "Drift", value: "—"};

      const hours = hoursBetween(previous.date, last.date);

      return {
        label: "Drift",
        value: hours > 0 ? `${(distanceKm(previous, last) / hours).toFixed(1)} KM/H` : "—",
      };
    }

    case "updated":
      return {label: "Track", value: `${String(track.length).padStart(2, "0")} PTS`};
  }
}

export function parseEvent(event: EonetEvent, now: number): NaturalEvent | null {
  const track = toTrack(event.geometry);
  const last = track[track.length - 1];

  // Sin una posición válida no hay card que pintar ni marcador que ubicar.
  if (!last) return null;

  const category = resolveEventCategory(event.categories.map(({id}) => id));
  const ref = toEventRef(event.id);

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
  };
}

export function parseEventDetail(event: EonetEvent, now: number): NaturalEventDetail | null {
  const base = parseEvent(event, now);

  if (!base) return null;

  return {
    ...base,
    description: event.description ?? undefined,
    sourceUrl: `https://eonet.gsfc.nasa.gov/api/v3/events/${event.id}`,
    sources: event.sources,
    track: toTrack(event.geometry),
    closed: event.closed,
  };
}

/** Rumbo del tramo final de la traza; `null` si el evento no se movió. */
export function resolveHeading(track: EventPoint[]) {
  const last = track[track.length - 1];
  const previous = track[track.length - 2];

  if (!previous || !last) return null;

  return bearingLabel(previous, last);
}
