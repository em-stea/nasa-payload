import { resolveNewsCategory } from '@/features/news/constants/categories'
import type { NasaPost, NewsArticle } from '@/features/news/types/news'
import { toPlainText } from '@/features/news/utils/html-text'

/**
 * Ancho pedido a la CDN de nasa.gov. Sin esto llegan originales de 8 MB o más
 * que el optimizador de Next rechaza con 500.
 */
const IMAGE_WIDTH = 1200

export function toCardImage(url: string) {
  if (!url) return undefined

  return url.includes('?') ? url : `${url}?w=${IMAGE_WIDTH}`
}

/** Ruta del detalle de una noticia dentro del sitio. */
export function buildArticleHref(id: number | string) {
  return `/news/${id}`
}

/**
 * Nombre de identidad compartido entre la card del grid y el hero del
 * detalle, para que React morphee una imagen en la otra con `ViewTransition`.
 */
export function buildArticlePhotoTransitionName(id: number | string) {
  return `news-photo-${id}`
}

export function parsePost(post: NasaPost): NewsArticle {
  const category = resolveNewsCategory(post.categories)
  const title = toPlainText(post.title.rendered)

  return {
    id: post.id,
    // El detalle vive en el sitio; el permalink de nasa.gov queda como fuente.
    href: buildArticleHref(post.id),
    sourceUrl: post.link,
    tag: category.label,
    tone: category.tone,
    image: toCardImage(post.featured_image_url),
    // Decorativa: el titular ya está en el DOM al lado de la imagen, y un alt
    // vacío evita que una imagen caída deje un párrafo de texto roto.
    imageAlt: '',
    title,
    description: toPlainText(post.excerpt.rendered),
    // El diseño cuenta la antigüedad como una cuenta regresiva de misión.
    date: `T-minus ${post.time_ago}`,
    dateTime: post.date,
  }
}
