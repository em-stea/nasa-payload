import type { ApodImage, ApodPost } from '@/features/apod/types/apod'
import { toPlainText } from '@/features/news/utils/html-text'

/**
 * La bajada de la APOD llega como un único bloque de HTML inline —sin `<p>`—
 * con las secciones separadas por `<br><br>`. Partimos por ahí y bajamos cada
 * parte a texto plano, igual que se hace con el cuerpo de una noticia.
 */
function parseExplanation(html: string) {
  return html
    .split(/(?:<br\s*\/?>\s*){2,}/i)
    .map((chunk) => toPlainText(chunk.replace(/<br\s*\/?>/gi, ' ')))
    .filter(Boolean)
}

export function parseApodPost(post: ApodPost): ApodImage {
  return {
    postId: post.post_id,
    title: toPlainText(post.title),
    date: post.date,
    mediaType: post.media_type,
    sourceUrl: post.permalink,
    image: post.hdurl ?? post.url,
    alt: toPlainText(post.alt),
    paragraphs: parseExplanation(post.explanation),
    credit: post.credit ? toPlainText(post.credit) : undefined,
    copyright: post.copyright ? toPlainText(post.copyright) : undefined,
  }
}
