/**
 * Formateo de las magnitudes de NeoWs.
 *
 * Todo se arma a mano, sin `Intl`: estos valores viajan en el HTML del server
 * y el cliente los rehidrata, así que un separador que dependa del locale
 * dejaría dos textos distintos para el mismo dato.
 */

/** Agrupa de a tres: `37399` → `37,399`. */
export function formatInteger(value: number) {
  return Math.round(value)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

/** Saca los ceros de la derecha dejando al menos dos decimales. */
function trimDecimals(value: string) {
  if (!value.includes('.')) return value

  const trimmed = value.replace(/0+$/, '')
  const [whole, decimals = ''] = trimmed.split('.')

  return `${whole}.${decimals.padEnd(2, '0')}`
}

/**
 * Distancia de una aproximación, en AU.
 *
 * La escala va de más de 1 AU a menos de 0.0005, así que la precisión se mide
 * en cifras significativas y no en decimales: con un número fijo de decimales
 * o se pierde la diferencia entre dos pasadas rasantes, o se arrastran ceros
 * en las lejanas. Dos cifras alcanzan para las dos puntas.
 */
export function formatMissAu(value: number) {
  if (value >= 1) return value.toFixed(2)

  return trimDecimals(value.toPrecision(2))
}

/** Parámetro orbital en AU: `0.746 AU`. */
export function formatOrbitAu(value: number) {
  return `${value.toFixed(3)} AU`
}

/** Velocidad relativa: `7.42 km/s`. */
export function formatVelocity(value: number) {
  return `${value.toFixed(2)} km/s`
}

/** Magnitud absoluta: `20.9 H`. */
export function formatMagnitude(value: number) {
  return `${value.toFixed(1)} H`
}

/** Diámetro en metros; por debajo de 10 m un entero pierde demasiado. */
export function formatMeters(value: number) {
  return value < 10 ? `${value.toFixed(1)}m` : `${formatInteger(value)}m`
}

/** `12.0` → `12`, `87.1` → `87.1`. */
function dropTrailingZero(value: string) {
  return value.replace(/\.0$/, '')
}

/**
 * Tamaño con la unidad que lo hace legible.
 *
 * El catálogo va de objetos de metros a otros de decenas de kilómetros, y
 * `49,436m` se lee mucho peor que `49.4km`: arriba del kilómetro la escala
 * cambia de unidad.
 */
export function formatSize(meters: number) {
  if (meters >= 1000) return `${dropTrailingZero((meters / 1000).toFixed(1))}km`
  if (meters >= 10) return `${formatInteger(meters)}m`

  return `${dropTrailingZero(meters.toFixed(1))}m`
}

/** Rango estimado de diámetro: `340m - 370m`, `22.1km - 49.4km`. */
export function formatDiameterRange(min: number, max: number) {
  return `${formatSize(min)} - ${formatSize(max)}`
}

/** Distancia en distancias lunares: `0.098 LD`. */
export function formatLunar(value: number) {
  return `${value.toFixed(3)} LD`
}

/** Distancia en kilómetros: `37,399 km`. */
export function formatKilometers(value: number) {
  return `${formatInteger(value)} km`
}

/** Período orbital: `323.6 DAYS`. */
export function formatPeriod(days: number) {
  return `${days.toFixed(1)} days`
}

/** Inclinación: `3.331°`. */
export function formatDegrees(value: number) {
  return `${value.toFixed(3)}°`
}

/** Excentricidad y albedo: adimensionales, tres decimales. */
export function formatRatio(value: number) {
  return value.toFixed(3)
}
