import { cacheLife, cacheTag } from 'next/cache'

import { resolveNewsCategory } from '@/features/news/constants/categories'
import type { NasaPostDetail, NewsArticleDetail } from '@/features/news/types/news'
import { toPlainText } from '@/features/news/utils/html-text'
import { parseArticleContent } from '@/features/news/utils/parse-article-content'
import { toCardImage } from '@/features/news/utils/parse-post'
import { HttpError, http } from '@/shared/services/http'

/**
 * Una noticia completa de nasa.gov.
 *
 * Es el mismo WP REST que alimenta el listado, pero pedido de a un post y con
 * `content` incluido: el listado se queda en el excerpt porque traer el cuerpo
 * de nueve notas a la vez multiplica por veinte el peso de la respuesta.
 */

const NASA_POSTS_URL = 'https://www.nasa.gov/wp-json/wp/v2/posts'

const POST_FIELDS = [
  'id',
  'date',
  'link',
  'title',
  'excerpt',
  'content',
  'categories',
  'time_ago',
  'featured_image_url',
].join(',')

export async function getNewsArticle(id: number): Promise<NewsArticleDetail | null> {
  'use cache'
  // El cuerpo de una nota publicada no se mueve; lo que puede cambiar es una
  // corrección editorial, y para eso alcanza con revisar cada tanto.
  cacheLife('hours')
  cacheTag(`news-article-${id}`)

  try {
    const { data } = await http.get<NasaPostDetail>(`${NASA_POSTS_URL}/${id}`, {
      searchParams: { _fields: POST_FIELDS },
      // El cuerpo completo pesa bastante más que una página del listado.
      timeoutMs: 15_000,
    })

    const category = resolveNewsCategory(data.categories)
    const { blocks, figures, readingTime } = parseArticleContent(data.content.rendered)

    return {
      id: data.id,
      title: toPlainText(data.title.rendered),
      excerpt: toPlainText(data.excerpt.rendered),
      sourceUrl: data.link,
      image: toCardImage(data.featured_image_url),
      tag: category.label,
      tone: category.tone,
      publishedAt: data.date,
      timeAgo: data.time_ago,
      readingTime,
      blocks,
      figures,
    }
  } catch (error) {
    // 404 es un id que no existe y 401 un post que dejó de ser público: en los
    // dos casos la página resuelve el not-found, no un error.
    if (error instanceof HttpError && (error.status === 404 || error.status === 401)) {
      return null
    }

    throw error
  }
}
