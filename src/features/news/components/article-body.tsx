import type { NewsArticleDetail } from '@/features/news/types/news'
import { toMissionTimestamp } from '@/shared/utils/mission-date'
import { Heading } from '@/shared/components/heading/heading'
import { Text } from '@/shared/components/text/text'

/**
 * Después de cuántos bloques se intercala el log.
 *
 * En el diseño cae después de la primera sección con subtítulo; acá se fija en
 * una posición para que caiga siempre en el mismo lugar independientemente de
 * cómo venga estructurada la nota.
 */
const SYSTEM_LOG_POSITION = 3

/** Pasa un texto al formato de las etiquetas del diseño: `JAMES_WEBB`. */
function toSlug(value: string) {
  return value.toUpperCase().replace(/\s+/g, '_')
}

/**
 * Bloque de telemetría del diseño.
 *
 * Son datos reales del artículo —id, categoría, fecha, imágenes adjuntas—
 * escritos en la voz de consola con la que está contado el sitio. No hay nada
 * inventado adentro: si dice `ASSETS_ATTACHED: 03` es porque la nota trae tres
 * imágenes.
 */
function SystemLog({ article }: { article: NewsArticleDetail }) {
  const lines = [
    `> SYSTEM LOG // ENTRY ${article.id}`,
    `> CATEGORY: ${toSlug(article.tag)}`,
    `> PUBLISHED: ${toMissionTimestamp(article.publishedAt)}`,
    `> ASSETS_ATTACHED: ${String(article.figures.length).padStart(2, '0')}`,
    '> SOURCE: NASA.GOV/WP-JSON',
  ]

  return (
    <div className="w-full border border-l-4 border-foreground bg-card px-5 py-4">
      {lines.map((line) => (
        <Text key={line} variant="meta.3" className="text-foreground">
          {line}
        </Text>
      ))}
    </div>
  )
}

/**
 * Cuerpo de la nota.
 *
 * Los bloques llegan ya bajados a texto plano desde `parseArticleContent`, así
 * que la tipografía es la del sitio y no la que trae el HTML de nasa.gov.
 */
export function ArticleBody({ article }: { article: NewsArticleDetail }) {
  return (
    <div className="flex w-full min-w-0 flex-col gap-6">
      {article.blocks.map((block, index) => (
        <div key={index} className="contents">
          {block.kind === 'heading' ? (
            <Heading
              as="h2"
              variant="title.2"
              className="mt-2 w-full border-b border-border pb-2.25 leading-9.6 font-semibold text-primary-foreground"
            >
              {block.text}
            </Heading>
          ) : (
            <Text variant="body.1" className="text-muted-foreground">
              {block.text}
            </Text>
          )}

          {index === SYSTEM_LOG_POSITION - 1 && <SystemLog article={article} />}
        </div>
      ))}

      {article.blocks.length < SYSTEM_LOG_POSITION && <SystemLog article={article} />}
    </div>
  )
}
