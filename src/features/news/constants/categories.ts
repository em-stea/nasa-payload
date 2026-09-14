import type {BadgeTone} from "@/shared/styles/components/badge";

/**
 * Los tonos que usa el diccionario de categorías. Es un subconjunto de
 * `BadgeTone` —el resto del vocabulario no aplica a una noticia— y es también
 * lo que la colección de favoritos sabe guardar.
 */
export type NewsTone = Extract<BadgeTone, "blue" | "red" | "orange">;

/**
 * Diccionario de categorías de nasa.gov.
 *
 * El WP de nasa.gov taxonomiza cada post con varias `categories` y las expone
 * por id numérico, así que necesitamos el mapa para tres cosas a la vez:
 * traducir un id a una etiqueta corta (el tag de la card), elegir el color con
 * el que se pinta ese tag, y armar el filtro `?categories=` del endpoint.
 *
 * El `tone` es el que decide el color: Marte va en rojo y el Sol en naranja
 * —los dos cuerpos "calientes" del set—, el resto del cosmos en azul, que es
 * el acento por defecto del sitio.
 *
 * Los ids salen de `/wp-json/wp/v2/categories?slug=<slug>` y son estables.
 * El orden importa: `resolveNewsCategory` recorre el diccionario de arriba
 * hacia abajo, así que las categorías específicas van antes que las genéricas
 * (un post de Marte suele estar también en "The Solar System").
 */

export type NewsCategory = {
  /** Id de la taxonomía `category` en el WP de nasa.gov. */
  id: number;
  /** Slug de la categoría; es el valor que viaja en `?category=` de la URL. */
  slug: string;
  /** Etiqueta corta para el chip del filtro y el tag de la card. */
  label: string;
  /** Color del tag, del punto y del hover de la card. */
  tone: NewsTone;
};

export const NEWS_CATEGORIES = {
  webb: {id: 2736, slug: "webb", label: "James Webb", tone: "blue"},
  mars: {id: 3229, slug: "mars", label: "Mars", tone: "red"},
  artemis: {id: 2681, slug: "artemis", label: "Artemis", tone: "blue"},
  station: {id: 2735, slug: "station", label: "ISS", tone: "blue"},
  exoplanets: {id: 2813, slug: "exoplanets", label: "Exoplanets", tone: "blue"},
  asteroids: {id: 3241, slug: "asteroids", label: "Asteroids", tone: "blue"},
  moon: {id: 3760, slug: "moon", label: "Moon", tone: "blue"},
  sun: {id: 11310, slug: "sun", label: "The Sun", tone: "orange"},
  earth: {id: 3228, slug: "earth", label: "Earth", tone: "blue"},
  "solar-system": {id: 2658, slug: "solar-system", label: "Deep Space", tone: "blue"},
} as const satisfies Record<string, NewsCategory>;

export type NewsCategorySlug = keyof typeof NEWS_CATEGORIES;

/** Categorías que se ofrecen como chips en la barra de filtros, en orden. */
export const NEWS_FILTER_SLUGS = [
  "mars",
  "webb",
  "artemis",
  "station",
  "exoplanets",
] as const satisfies readonly NewsCategorySlug[];

/** Tag de las noticias que no caen en ninguna categoría del diccionario. */
export const NEWS_FALLBACK_CATEGORY: NewsCategory = {
  id: 0,
  slug: "nasa",
  label: "NASA",
  tone: "blue",
};

const CATEGORIES_BY_PRIORITY = Object.values(NEWS_CATEGORIES) as NewsCategory[];

export function isNewsCategorySlug(value: string | null | undefined): value is NewsCategorySlug {
  return value != null && value in NEWS_CATEGORIES;
}

export function getNewsCategory(slug: NewsCategorySlug): NewsCategory {
  return NEWS_CATEGORIES[slug];
}

/**
 * Primera categoría conocida de un post, según el orden del diccionario.
 * Un post suele traer 3 o 4 ids y solo uno nos sirve como tag.
 */
export function resolveNewsCategory(ids: readonly number[]): NewsCategory {
  return (
    CATEGORIES_BY_PRIORITY.find((category) => ids.includes(category.id)) ?? NEWS_FALLBACK_CATEGORY
  );
}
