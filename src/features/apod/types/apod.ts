/**
 * Respuesta cruda de `wp-json/wp/v2/apod-basic` en science.nasa.gov.
 *
 * Es la "Astronomy Picture of the Day": a diferencia del listado de noticias,
 * acá no hay paginación por id — el endpoint siempre devuelve la foto vigente,
 * así que un solo shape sirve tanto para el hero de la home como para el
 * detalle.
 */
export type ApodPost = {
  date: string;
  post_id: number;
  title: string;
  permalink: string;
  media_type: "image" | "video" | string;
  /** HTML con la bajada del día; trae links y algún `<strong>` inline. */
  explanation: string;
  credit?: string;
  copyright?: string;
  alt: string;
  url: string;
  /** Sólo viene cuando `media_type` es `image`. */
  hdurl?: string;
};

/** La foto del día, lista para pintar. */
export type ApodImage = {
  postId: number;
  title: string;
  date: string;
  mediaType: string;
  /** Permalink original en science.nasa.gov. */
  sourceUrl: string;
  /** Imagen en máxima resolución cuando la hay; si no, la de tamaño estándar. */
  image: string;
  alt: string;
  /** Bajada del día ya partida en párrafos de texto plano. */
  paragraphs: string[];
  credit?: string;
  copyright?: string;
};
