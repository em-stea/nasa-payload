import type { Asteroid, AsteroidApproach } from '@/features/asteroids/types/asteroid'

/**
 * Geometría de la pantalla de radar.
 *
 * Cada objeto de la página es un contacto: el ángulo sale del id —para que
 * caiga siempre en el mismo lugar— y el radio, de la distancia de su
 * aproximación de referencia, en escala logarítmica. Sin log, todo lo que pasa
 * a menos de 0.05 AU se amontona contra el centro y el resto se pega al borde:
 * la escala real abarca cuatro órdenes de magnitud.
 *
 * Va acá y no en el componente porque son cuentas puras y son varias: el
 * componente se queda con el dibujo.
 */

/** Distancias que definen el rango del barrido, en AU. */
export const MIN_AU = 0.0005
export const MAX_AU = 1.5

export const VIEW_WIDTH = 800
export const VIEW_HEIGHT = 400
export const CENTER_X = VIEW_WIDTH / 2
export const CENTER_Y = VIEW_HEIGHT / 2

/**
 * El plano del radar se ve en escorzo, como en el diseño: es una elipse, no un
 * círculo. Los semiejes son deliberadamente chicos contra el `viewBox` porque
 * el SVG se recorta con `slice` para llenar el panel —ancho en desktop, casi
 * cuadrado en mobile— y estas medidas son las que sobreviven al recorte en las
 * dos puntas.
 */
export const PLOT_RX = 230
export const PLOT_RY = 115

/**
 * Anillos de alcance, una década por anillo.
 *
 * Rotulados y en la posición que les toca en la escala log: son la regla que
 * permite leer a qué distancia está cada contacto sin pasar por la card.
 */
export const RANGE_RINGS = [
  { au: 0.001, label: '0.001' },
  { au: 0.01, label: '0.01' },
  { au: 0.1, label: '0.1' },
  { au: 1, label: '1 AU' },
] as const

/**
 * Anillo de adorno, fuera del rango de los contactos.
 *
 * Se sale del marco a propósito: recortarse es lo que hace leer la pantalla
 * como más grande que su panel.
 */
export const OUTER_RING = 1.34

/** Marcas de rumbo sobre el borde del plano, cada 15°. */
export const BEARING_TICKS = Array.from({ length: 24 }, (_, index) => (index * Math.PI) / 12)

/** Radio del barrido en el espacio circular, antes de achatarlo. */
export const SWEEP_RADIUS = 340

/** Apertura del haz, en grados. */
export const SWEEP_DEGREES = 62

/**
 * Ángulo del contacto en la pantalla, a partir del id.
 *
 * Usa FNV-1a y no una suma ponderada: los ids de NeoWs de una misma página son
 * casi consecutivos (2000433, 2000719, 2000887…) y con un hash lineal caen en
 * ángulos casi consecutivos, así que los contactos se apilan en un mismo
 * sector en vez de repartirse por el barrido.
 */
function hashAngle(id: string) {
  let hash = 0x811c9dc5

  for (let index = 0; index < id.length; index += 1) {
    hash ^= id.charCodeAt(index)
    hash = Math.imul(hash, 0x01000193)
  }

  return ((hash >>> 0) / 4294967296) * Math.PI * 2
}

/** Distancia → fracción del semieje, en log y dejando libre el centro. */
export function toRatio(au: number) {
  const clamped = Math.min(Math.max(au, MIN_AU), MAX_AU)
  const ratio = Math.log10(clamped / MIN_AU) / Math.log10(MAX_AU / MIN_AU)

  // El 14% del centro queda para la Tierra.
  return 0.14 + ratio * 0.86
}

/** Punto del plano a partir del ángulo y la fracción del semieje. */
export function toPoint(angle: number, ratio: number) {
  return {
    x: CENTER_X + Math.cos(angle) * PLOT_RX * ratio,
    y: CENTER_Y + Math.sin(angle) * PLOT_RY * ratio,
  }
}

/** Sector circular con el vértice en el centro, para el haz. */
function buildSweepPath() {
  const radians = (SWEEP_DEGREES * Math.PI) / 180
  const endX = CENTER_X + Math.cos(radians) * SWEEP_RADIUS
  const endY = CENTER_Y + Math.sin(radians) * SWEEP_RADIUS

  return [
    `M ${CENTER_X} ${CENTER_Y}`,
    `L ${CENTER_X + SWEEP_RADIUS} ${CENTER_Y}`,
    `A ${SWEEP_RADIUS} ${SWEEP_RADIUS} 0 0 1 ${endX.toFixed(1)} ${endY.toFixed(1)}`,
    'Z',
  ].join(' ')
}

export const SWEEP_PATH = buildSweepPath()

/**
 * Punta del haz, en el espacio circular: el filo que va adelante en el giro.
 *
 * Va sin achatar porque se dibuja adentro del mismo grupo que el sector, que
 * es el que aplica el escorzo.
 */
export const SWEEP_EDGE = {
  x: CENTER_X + Math.cos((SWEEP_DEGREES * Math.PI) / 180) * SWEEP_RADIUS,
  y: CENTER_Y + Math.sin((SWEEP_DEGREES * Math.PI) / 180) * SWEEP_RADIUS,
}

/** Lo mínimo que pueden separarse dos contactos, en unidades del `viewBox`. */
const MIN_BLIP_GAP = 34

/** Lo que gira el contacto tapado en cada pasada, en radianes. */
const NUDGE = 0.07

const MAX_PASSES = 24

/**
 * Separa en ángulo los contactos que se pisan.
 *
 * Con el ángulo salido del hash, dos objetos a distancia parecida pueden caer
 * casi encima —en la primera página del catálogo ya pasa— y ahí el de abajo
 * queda sin área de hover: no hay forma de preguntarle cuál es. Cada pasada
 * corre el segundo de cada par que quedó cerca, siempre en el mismo sentido y
 * recorriendo la lista en orden, así que el resultado depende sólo de qué
 * objetos trae la página. El radio no se toca: ese es el dato.
 */
function spreadOverlaps(contacts: { angle: number; ratio: number }[]) {
  for (let pass = 0; pass < MAX_PASSES; pass += 1) {
    let moved = false

    for (let first = 0; first < contacts.length; first += 1) {
      for (let second = first + 1; second < contacts.length; second += 1) {
        const a = toPoint(contacts[first].angle, contacts[first].ratio)
        const b = toPoint(contacts[second].angle, contacts[second].ratio)

        if (Math.hypot(a.x - b.x, a.y - b.y) >= MIN_BLIP_GAP) continue

        contacts[second].angle += NUDGE
        moved = true
      }
    }

    if (!moved) return
  }
}

/** Contacto listo para pintar: el objeto, su aproximación y su lugar. */
export type RadarContact = {
  asteroid: Asteroid
  approach: AsteroidApproach
  x: number
  y: number
}

/** Los objetos de la página con aproximación, ya ubicados en la pantalla. */
export function buildRadarContacts(asteroids: Asteroid[]): RadarContact[] {
  const placed = asteroids
    .filter(
      (asteroid): asteroid is Asteroid & { approach: AsteroidApproach } =>
        asteroid.approach !== undefined,
    )
    .map((asteroid) => ({
      asteroid,
      approach: asteroid.approach,
      angle: hashAngle(asteroid.id),
      ratio: toRatio(asteroid.approach.missAu),
    }))

  spreadOverlaps(placed)

  return placed.map(({ asteroid, approach, angle, ratio }) => ({
    asteroid,
    approach,
    ...toPoint(angle, ratio),
  }))
}
