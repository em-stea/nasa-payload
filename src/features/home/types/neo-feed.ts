import type {NeoObject} from "@/features/asteroids/types/asteroid";
import type {CardTone} from "@/shared/components/card/card";
import type {BadgeVariant} from "@/shared/styles/components/badge";

/**
 * NeoWs `/feed`: los objetos que se acercan a la Tierra en una ventana de
 * fechas (máximo siete días).
 *
 * A diferencia de `/neo/browse` —que devuelve una lista paginada y alimenta el
 * DISCOVERY LOG— acá los objetos vienen agrupados por día, con la fecha como
 * clave del objeto. Cada elemento es el mismo `NeoObject` del catálogo, sin
 * `orbital_data`: el feed no lo incluye.
 */
export type NeoFeedResponse = {
  links: {
    next?: string;
    previous?: string;
    self: string;
  };
  /** Total de objetos sumando todos los días de la ventana. */
  element_count: number;
  /** `{"2026-09-15": [...], "2026-09-16": [...]}`. */
  near_earth_objects: Record<string, NeoObject[]>;
};

/**
 * Una aproximación lista para la card del carrusel "Celestial Near-Misses":
 * las magnitudes ya vienen formateadas con su unidad, y el tag sale de cruzar
 * el flag de peligrosidad de NeoWs con el diseño del Badge.
 */
export type CloseApproachPreview = {
  id: string;
  /** `429584 (2011 EU29)`, como lo publica NeoWs. */
  title: string;
  /** Día de la aproximación (`YYYY-MM-DD`), o `N/A` si el feed no la trae. */
  date: string;
  /** Distancia mínima en unidades astronómicas: `0.13 AU`. */
  miss_distance: string;
  /** Velocidad relativa: `21.01 km/s`. */
  velocity: string;
  tag: string;
  tone: CardTone;
  tagVariant: BadgeVariant;
};
