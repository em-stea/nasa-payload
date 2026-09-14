import type {Asteroid, AsteroidApproach} from "@/features/asteroids/types/asteroid";

/**
 * Geometría de la pantalla de radar.
 *
 * Cada objeto de la página es un contacto: el ángulo sale del id —para que
 * caiga siempre en el mismo lugar— y el radio, de la distancia de su
 * aproximación de referencia, en escala logarítmica. Sin log, todo lo que pasa
 * a menos de 0.05 AU se amontona contra el centro y el resto se pega al borde:
 * la escala real abarca cuatro órdenes de magnitud.
 *
 * El plano se mira desde arriba, de plano: el barrido y los anillos son
 * círculos, no elipses en escorzo. Antes la pantalla iba inclinada, llenaba el
 * panel de punta a punta y los contactos del borde quedaban pegados al marco:
 * al apuntarlos, el rótulo salía del recorte y no había forma de leerlo. Ahora
 * la cámara se aleja y el instrumento entra entero.
 *
 * Va acá y no en el componente porque son cuentas puras y son varias: el
 * componente se queda con el dibujo.
 */

/** Distancias que definen el rango del barrido, en AU. */
export const MIN_AU = 0.0005;

export const MAX_AU = 1.5;

/**
 * El `viewBox` es cuadrado y se dibuja con `meet`.
 *
 * El panel es mucho más ancho que alto y encima su ancho no tiene tope —el
 * container resuelve a 5600px—, así que con `slice` el SVG se escalaba hasta
 * cubrir el ancho y lo que se perdía era alto: cuanto más grande el monitor,
 * más se comía de arriba y de abajo. Con un cuadrado y `meet` la escala la
 * manda siempre el lado corto, así que todo lo que caiga adentro de estas 400
 * unidades se ve entero en cualquier pantalla. Lo que se dibuja afuera —los
 * anillos lejanos, el resplandor— se recorta contra el alto del panel, que es
 * justo el corte que pide el diseño.
 */
export const VIEW_SIZE = 400;

export const CENTER = VIEW_SIZE / 2;

/** Margen contra el borde del cuadrado: nada legible lo pisa. */
export const SAFE_MARGIN = 6;

/** Radio del plano donde caen los contactos. */
export const PLOT_R = 148;

/**
 * Anillo de adorno, fuera del rango de los contactos.
 *
 * Se sale del cuadrado a propósito: cortado contra el alto del panel es lo que
 * hace leer la pantalla como más grande que su marco.
 */
export const OUTER_R = PLOT_R * 1.5;

/** Anillo lejano, punteado: siempre cortado, da profundidad al fondo. */
export const FAR_R = PLOT_R * 2;

/** Alcance del fósforo de la pantalla. */
export const GLOW_R = 330;

/**
 * Anillos de alcance, una década por anillo.
 *
 * Rotulados y en la posición que les toca en la escala log: son la regla que
 * permite leer a qué distancia está cada contacto sin pasar por la card.
 */
export const RANGE_RINGS = [
  {au: 0.001, label: "0.001"},
  {au: 0.01, label: "0.01"},
  {au: 0.1, label: "0.1"},
  {au: 1, label: "1 AU"},
] as const;

/** Marcas de rumbo alrededor del plano, cada 15°. */
export const BEARING_TICKS = Array.from({length: 24}, (_, index) => (index * Math.PI) / 12);

/** Radio del barrido. */
export const SWEEP_RADIUS = 330;

/** Apertura del haz, en grados. */
export const SWEEP_DEGREES = 62;

/**
 * Ángulo del contacto en la pantalla, a partir del id.
 *
 * Usa FNV-1a y no una suma ponderada: los ids de NeoWs de una misma página son
 * casi consecutivos (2000433, 2000719, 2000887…) y con un hash lineal caen en
 * ángulos casi consecutivos, así que los contactos se apilan en un mismo
 * sector en vez de repartirse por el barrido.
 */
function hashAngle(id: string) {
  let hash = 0x811c9dc5;

  for (let index = 0; index < id.length; index += 1) {
    hash ^= id.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193);
  }

  return ((hash >>> 0) / 4294967296) * Math.PI * 2;
}

/** Recorta un valor a un rango. */
export function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

/** Distancia → fracción del radio, en log y dejando libre el centro. */
export function toRatio(au: number) {
  const clamped = clamp(au, MIN_AU, MAX_AU);
  const ratio = Math.log10(clamped / MIN_AU) / Math.log10(MAX_AU / MIN_AU);

  // El 14% del centro queda para la Tierra.
  return 0.14 + ratio * 0.86;
}

/** Punto del plano a partir del ángulo y la fracción del radio. */
export function toPoint(angle: number, ratio: number) {
  return {
    x: CENTER + Math.cos(angle) * PLOT_R * ratio,
    y: CENTER + Math.sin(angle) * PLOT_R * ratio,
  };
}

/** Punto del borde del barrido, en grados desde el eje +x. */
function sweepEdge(degrees: number) {
  const radians = (degrees * Math.PI) / 180;

  return {
    x: CENTER + Math.cos(radians) * SWEEP_RADIUS,
    y: CENTER + Math.sin(radians) * SWEEP_RADIUS,
  };
}

/** Sector con el vértice en el centro, colgando del filo de ataque. */
function buildSweepPath(span: number) {
  const from = sweepEdge(SWEEP_DEGREES - span);
  const to = sweepEdge(SWEEP_DEGREES);
  const large = span > 180 ? 1 : 0;

  return [
    `M ${CENTER} ${CENTER}`,
    `L ${from.x.toFixed(1)} ${from.y.toFixed(1)}`,
    `A ${SWEEP_RADIUS} ${SWEEP_RADIUS} 0 ${large} 1 ${to.x.toFixed(1)} ${to.y.toFixed(1)}`,
    "Z",
  ].join(" ");
}

/**
 * El haz, en capas.
 *
 * Un solo sector deja dos filos duros y el barrido se lee como un triángulo
 * que gira. Apilando sectores que comparten el filo de ataque y se van
 * abriendo hacia atrás, la estela se apaga de a poco —lo que SVG no da con un
 * degradé cónico— y queda el resplandor del diseño.
 */
export const SWEEP_LAYERS = [
  {span: 150, opacity: 0.35},
  {span: 90, opacity: 0.4},
  {span: 48, opacity: 0.5},
].map(({span, opacity}) => ({span, opacity, path: buildSweepPath(span)}));

/** Punta del haz: el filo que va adelante en el giro. */
export const SWEEP_EDGE = sweepEdge(SWEEP_DEGREES);

/** Lo mínimo que pueden separarse dos contactos, en unidades del `viewBox`. */
const MIN_BLIP_GAP = 26;

/** Lo que gira el contacto tapado en cada pasada, en radianes. */
const NUDGE = 0.07;

const MAX_PASSES = 24;

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
function spreadOverlaps(contacts: {angle: number; ratio: number}[]) {
  for (let pass = 0; pass < MAX_PASSES; pass += 1) {
    let moved = false;

    for (let first = 0; first < contacts.length; first += 1) {
      for (let second = first + 1; second < contacts.length; second += 1) {
        const a = toPoint(contacts[first].angle, contacts[first].ratio);
        const b = toPoint(contacts[second].angle, contacts[second].ratio);

        if (Math.hypot(a.x - b.x, a.y - b.y) >= MIN_BLIP_GAP) continue;

        contacts[second].angle += NUDGE;
        moved = true;
      }
    }

    if (!moved) return;
  }
}

/** Contacto listo para pintar: el objeto, su aproximación y su lugar. */
export type RadarContact = {
  asteroid: Asteroid;
  approach: AsteroidApproach;
  x: number;
  y: number;
};

/** Los objetos de la página con aproximación, ya ubicados en la pantalla. */
export function buildRadarContacts(asteroids: Asteroid[]): RadarContact[] {
  const placed = asteroids
    .filter(
      (asteroid): asteroid is Asteroid & {approach: AsteroidApproach} =>
        asteroid.approach !== undefined,
    )
    .map((asteroid) => ({
      asteroid,
      approach: asteroid.approach,
      angle: hashAngle(asteroid.id),
      ratio: toRatio(asteroid.approach.missAu),
    }));

  spreadOverlaps(placed);

  return placed.map(({asteroid, approach, angle, ratio}) => ({
    asteroid,
    approach,
    ...toPoint(angle, ratio),
  }));
}
