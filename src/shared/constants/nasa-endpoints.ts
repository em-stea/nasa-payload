/**
 * Bases de las APIs públicas de la NASA que consume el proyecto.
 *
 * Centralizarlas acá evita que cada service pegue la URL pelada y la repita
 * (como pasaba con el feed de noticias, declarado dos veces): quien necesite
 * pegarle a un endpoint concatena el path sobre la base correspondiente.
 */
export const NASA_ENDPOINTS = {
  /** EPIC: imágenes de la Tierra en 3D. */
  epic: "https://epic.gsfc.nasa.gov/api",
  /** APOD: Astronomy Picture of the Day (WP REST de science.nasa.gov). */
  apod: "https://science.nasa.gov/wp-json/wp/v2",
  /** Feed editorial de noticias (WP REST de www.nasa.gov). */
  news: "https://www.nasa.gov/wp-json/wp/v2",
  /** EONET: catálogo de eventos naturales en curso, con su traza geográfica. */
  eonet: "https://eonet.gsfc.nasa.gov/api/v3",
  /** NeoWs: catálogo de objetos cercanos a la Tierra. */
  neo: "https://api.nasa.gov/neo/rest/v1",
  /** NASA Image and Video Library: búsqueda de imágenes por keyword/fecha. */
  images: "https://images-api.nasa.gov",
} as const;
