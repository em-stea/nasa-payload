/**
 * Medidas, paleta y tiempos de la escena del 404.
 *
 * Viven acá para que los componentes queden en la coreografía y no en los
 * números: la escena es una sola toma —el 404 armado con planetas, visto por
 * el ocular de un telescopio— y todo su encuadre sale de estas constantes.
 */

/** Glifo del 4 en celdas: cada `#` es un planeta. */
export const FOUR_GLYPH = ["..#.", ".##.", "#.#.", "####", "..#.", "..#."] as const;

/** Lado de la celda del glifo, en unidades de mundo. */
export const CELL = 1.25;

/** El 0 no es una grilla: sus planetas se reparten sobre una elipse. */
export const ZERO = {
  count: 12,
  radiusX: 1.9,
  radiusY: 3.35,
} as const;

/** Distancia entre el centro de un dígito y el siguiente. */
export const DIGIT_GAP = 7.4;

/**
 * Caja que la cámara tiene que encuadrar dentro del ocular, con aire.
 * El 404 mide 19.8 × 7.5 unidades: el resto es respiro contra el borde.
 */
export const SCENE_BOUNDS = {width: 22.5, height: 10.5} as const;

/**
 * Radio del ocular como fracción del viewport. El overlay lo escribe en CSS y
 * la cámara lo usa para encuadrar: si cambia acá, cambian los dos a la vez.
 */
export const EYEPIECE_RATIO = {width: 0.42, height: 0.32} as const;

/**
 * Centro óptico del ocular, como fracción de la altura del viewport. Va algo
 * más arriba que el medio: abajo entra el texto.
 */
export const EYEPIECE_CENTER = 0.38;

/** Cuánto tarda el telescopio en enfocar, en segundos. */
export const FOCUS_DURATION = 2.4;

/** Viaje de cada planeta hasta su lugar en el glifo. */
export const PLANET_TRAVEL = 1.5;

/** Diferencia de arranque entre un planeta y el siguiente. */
export const PLANET_STAGGER = 0.035;

/**
 * Pieles de los planetas del glifo. Los colores son literales y no tokens:
 * WebGL no entiende `oklch()`, y `THREE.Color` sólo parsea hex/rgb/hsl.
 */
export const PLANET_SKINS = [
  {kind: "banded", base: "#3b4a91", tints: ["#5f6fc0", "#2a3370", "#8f9ada", "#26306a"]},
  {kind: "banded", base: "#8c6a4a", tints: ["#c2996d", "#6b4d35", "#e0bb8e", "#5a3f2d"]},
  {kind: "rocky", base: "#6a6d86", tints: ["#9aa0bd", "#474a5f", "#b9bfd8"]},
  {kind: "rocky", base: "#9c5b45", tints: ["#c98163", "#6d3a2c", "#e0a487"]},
  {kind: "icy", base: "#7f9fc4", tints: ["#cfe2f5", "#4f6f96", "#a9c8e6"]},
  {kind: "banded", base: "#5b3f7a", tints: ["#8b6bb5", "#3c2854", "#b79ade"]},
] as const;

export type PlanetSkin = (typeof PLANET_SKINS)[number];

/** Paleta de la vegetación: verdes apagados, nada de neón. */
export const FOLIAGE_COLORS = ["#5f9a5f", "#74b26c", "#4c8659", "#8ac26f"] as const;

export const TRUNK_COLOR = "#6b5140";
