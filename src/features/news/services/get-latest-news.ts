import { cacheLife } from 'next/cache'

import {
  NEWS_CATEGORIES,
  getNewsCategory,
  isNewsCategorySlug,
  type NewsCategorySlug,
} from '@/features/news/constants/categories'
import type { NasaPost, NewsPage } from '@/features/news/types/news'
import { parsePost } from '@/features/news/utils/parse-post'
import { NASA_ENDPOINTS } from '@/shared/constants/nasa-endpoints'
import { HttpError, http } from '@/shared/services/http'

/**
 * Últimas noticias de nasa.gov.
 *
 * De las APIs públicas de la NASA, la única que publica el feed editorial —el
 * que alimenta esta pantalla— es el WP REST del sitio: trae titular, bajada,
 * imagen destacada, antigüedad y las categorías con las que armamos los
 * filtros. `api.nasa.gov` sirve datasets (APOD, NeoWs, EPIC), no noticias.
 */

/** Tres filas de tres, como el grid del diseño. */
export const NEWS_PER_PAGE = 9

/**
 * El endpoint descarta parte de cada página después de contarla: pedirle 9
 * posts devuelve 2 o 3, aunque `x-wp-total` informe miles. Pedimos de más y
 * recortamos, que es lo que mantiene el grid completo.
 *
 * El factor sale de medir el peor caso (James Webb, que se lleva el descarte
 * más agresivo). Subirlo casi no cuesta ancho de banda —el payload lo define
 * lo que la API devuelve, no lo que le pedimos—, pero avanza el archivo más
 * rápido: entre página y página de la UI quedan noticias sin mostrar.
 */
const OVERFETCH_FACTOR = 8

/**
 * El archivo tiene cientos de páginas. Cortamos la paginación en un número que
 * la UI pueda mostrar sin que navegar sea una expedición.
 */
const MAX_PAGES = 99

/** Pedimos solo lo que pinta la card: el post completo pesa ~40x más. */
const POST_FIELDS = [
  'id',
  'date',
  'link',
  'title',
  'excerpt',
  'categories',
  'time_ago',
  'featured_image_url',
].join(',')

/**
 * Sin filtro, el feed mezcla las noticias del cosmos con comunicados
 * institucionales (pasantías, transferencia tecnológica). Acotamos el "ALL" a
 * las categorías del diccionario, que además son las que tienen tag y color.
 */
const ALL_CATEGORY_IDS = Object.values(NEWS_CATEGORIES)
  .map((category) => category.id)
  .join(',')

type GetLatestNewsParams = {
  page?: number
  category?: NewsCategorySlug
}

function readHeaderCount(headers: Headers, name: string, fallback: number) {
  const value = Number.parseInt(headers.get(name) ?? '', 10)

  return Number.isFinite(value) ? value : fallback
}

export async function getLatestNews({
  page = 1,
  category,
}: GetLatestNewsParams = {}): Promise<NewsPage> {
  'use cache'
  // El feed se mueve varias veces al día, pero nunca al segundo.
  cacheLife('minutes')

  const safePage = Math.min(Math.max(Math.trunc(page) || 1, 1), MAX_PAGES)

  try {
    const { data, headers } = await http.get<NasaPost[]>(`${NASA_ENDPOINTS.news}/posts`, {
      searchParams: {
        page: safePage,
        per_page: NEWS_PER_PAGE * OVERFETCH_FACTOR,
        orderby: 'date',
        order: 'desc',
        _fields: POST_FIELDS,
        categories: isNewsCategorySlug(category) ? getNewsCategory(category).id : ALL_CATEGORY_IDS,
      },
    })

    return {
      articles: data.slice(0, NEWS_PER_PAGE).map(parsePost),
      page: safePage,
      totalPages: Math.min(readHeaderCount(headers, 'x-wp-totalpages', 1), MAX_PAGES),
      totalArticles: readHeaderCount(headers, 'x-wp-total', 0),
    }
  } catch (error) {
    // WP responde 400 cuando la página pedida excede el total. Es una URL
    // inválida, no una caída: devolvemos vacío y la página resuelve el 404.
    if (error instanceof HttpError && error.status === 400) {
      return { articles: [], page: safePage, totalPages: 0, totalArticles: 0 }
    }

    throw error
  }
}
