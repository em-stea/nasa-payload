/**
 * Cuentas geográficas sobre la traza de un evento.
 *
 * EONET publica cada evento como una sucesión de posiciones fechadas, así que
 * todo lo que el diseño muestra como telemetría —la velocidad de avance, el
 * rumbo, el desplazamiento por hora— sale de restar dos puntos consecutivos.
 * No hay nada estimado acá: son los datos de la API leídos con trigonometría.
 */

const EARTH_RADIUS_KM = 6371;

function toRadians(degrees: number) {
  return (degrees * Math.PI) / 180;
}

/** `55.932° N, 110.345° W`, como en las cards del diseño. */
export function formatCoords(lat: number, lng: number) {
  const latLabel = `${Math.abs(lat).toFixed(3)}° ${lat >= 0 ? "N" : "S"}`;
  const lngLabel = `${Math.abs(lng).toFixed(3)}° ${lng >= 0 ? "E" : "W"}`;

  return `${latLabel}, ${lngLabel}`;
}

/**
 * Posición del marcador sobre el planisferio, en porcentajes.
 *
 * La textura del mapa es equirectangular (la misma proyección que usa el globo
 * de la home), así que la longitud mapea lineal al eje X y la latitud al Y.
 */
export function toMapPosition(lat: number, lng: number) {
  return {
    left: ((lng + 180) / 360) * 100,
    top: ((90 - lat) / 180) * 100,
  };
}

/** Distancia en kilómetros entre dos posiciones (haversine). */
export function distanceKm(from: {lat: number; lng: number}, to: {lat: number; lng: number}) {
  const deltaLat = toRadians(to.lat - from.lat);
  const deltaLng = toRadians(to.lng - from.lng);

  const a =
    Math.sin(deltaLat / 2) ** 2 +
    Math.cos(toRadians(from.lat)) * Math.cos(toRadians(to.lat)) * Math.sin(deltaLng / 2) ** 2;

  return 2 * EARTH_RADIUS_KM * Math.asin(Math.min(1, Math.sqrt(a)));
}

const COMPASS = [
  "N",
  "NNE",
  "NE",
  "ENE",
  "E",
  "ESE",
  "SE",
  "SSE",
  "S",
  "SSW",
  "SW",
  "WSW",
  "W",
  "WNW",
  "NW",
  "NNW",
] as const;

/** Rumbo de un punto al siguiente, en la rosa de 16 puntas: `NNE`. */
export function bearingLabel(from: {lat: number; lng: number}, to: {lat: number; lng: number}) {
  const fromLat = toRadians(from.lat);
  const toLat = toRadians(to.lat);
  const deltaLng = toRadians(to.lng - from.lng);

  const y = Math.sin(deltaLng) * Math.cos(toLat);
  const x =
    Math.cos(fromLat) * Math.sin(toLat) - Math.sin(fromLat) * Math.cos(toLat) * Math.cos(deltaLng);

  const degrees = (Math.atan2(y, x) * 180) / Math.PI;

  return COMPASS[Math.round((((degrees % 360) + 360) % 360) / 22.5) % 16];
}

/** Horas entre dos fechas ISO; `0` si alguna no parsea. */
export function hoursBetween(fromIso: string, toIso: string) {
  const from = Date.parse(fromIso);
  const to = Date.parse(toIso);

  if (!Number.isFinite(from) || !Number.isFinite(to)) return 0;

  return (to - from) / 3_600_000;
}
