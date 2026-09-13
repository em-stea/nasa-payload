/**
 * Escala logarítmica para las barras de tamaño.
 *
 * El catálogo de NeoWs abarca casi cuatro órdenes de magnitud —de objetos de
 * pocos metros a Ganymed, de 87 km— y las referencias con las que el diseño
 * los compara viven abajo de todo: un colectivo mide 12 m. En un eje lineal
 * las dos referencias quedan pegadas al cero y los asteroides, todos contra el
 * techo, así que no se compara nada.
 */

/** Extremos del eje, en metros. */
export const SCALE_MIN_METERS = 1
export const SCALE_MAX_METERS = 100_000

/** Marcas del eje, de arriba hacia abajo; una por década. */
export const SCALE_TICKS = [100_000, 10_000, 1_000, 100, 10, 1] as const

/** Metros → fracción del eje, entre 0 y 1. */
export function toLogRatio(meters: number, min = SCALE_MIN_METERS, max = SCALE_MAX_METERS) {
  const clamped = Math.min(Math.max(meters, min), max)

  return Math.log10(clamped / min) / Math.log10(max / min)
}
