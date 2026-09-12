import type { ReactNode } from 'react'

import type { NewsArticleDetail } from '@/features/news/types/news'
import { toMissionTimestamp } from '@/shared/utils/mission-date'
import { CheckCircle } from '@/shared/components/icons/feedback/check-circle'
import { Text } from '@/shared/components/text/text'
import { textVariants } from '@/shared/styles/components/text'
import { cn } from '@/shared/utils/className-builder'

/** Cuántas barras entran en el gráfico del diseño. */
const CHART_BARS = 8

const statVariants = () => textVariants({ variant: 'meta.1' })

type PanelProps = {
  title: string
  action?: ReactNode
  children: ReactNode
}

function Panel({ title, action, children }: PanelProps) {
  return (
    <section className="w-full overflow-hidden rounded-lg border border-border bg-card">
      <header className="flex items-center justify-between gap-2 border-b border-border px-2 pt-2 pb-2.25">
        <Text variant="body.4" className="text-basic-500">
          {title}
        </Text>
        {action}
      </header>

      <div className="flex flex-col gap-2 p-4">{children}</div>
    </section>
  )
}

type RowProps = {
  label: string
  children: ReactNode
  /** La última fila del panel va sin la línea de abajo. */
  last?: boolean
}

function Row({ label, children, last = false }: RowProps) {
  return (
    <div
      className={cn(
        'flex items-center justify-between gap-4',
        !last && 'border-b border-border pb-1.25',
      )}
    >
      <Text variant="meta.3" className="shrink-0 text-basic-500 uppercase">
        {label}
      </Text>
      {children}
    </div>
  )
}

function Value({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <Text variant="meta.3" className={cn('truncate text-primary-foreground', className)}>
      {children}
    </Text>
  )
}

/**
 * El gráfico del diseño, dibujado con datos de la nota: cada barra es el largo
 * de uno de los primeros párrafos, normalizado contra el más largo. Es
 * decorativo —no hay una magnitud que leer ahí— así que va oculto para lectores
 * de pantalla; lo que sí se lee son las filas de abajo.
 */
function LengthChart({ article }: { article: NewsArticleDetail }) {
  const lengths = article.blocks
    .filter((block) => block.kind === 'paragraph')
    .slice(0, CHART_BARS)
    .map((block) => block.text.length)

  if (lengths.length === 0) return null

  const longest = Math.max(...lengths)

  return (
    <div
      aria-hidden="true"
      className="flex h-24 w-full items-end justify-center gap-1 rounded-lg border border-muted-foreground bg-background p-1.25"
    >
      {lengths.map((length, index) => {
        const ratio = length / longest

        return (
          <span
            key={index}
            className="min-w-0 flex-1 bg-foreground"
            style={{
              // 40% de alto mínimo: con menos, las barras cortas desaparecen.
              height: `${40 + ratio * 60}%`,
              opacity: 0.4 + ratio * 0.5,
            }}
          />
        )
      })}
    </div>
  )
}

type StatProps = {
  label: string
  value: string
  highlight?: boolean
  last?: boolean
}

/**
 * Fila del resumen. Va como `<dt>/<dd>` en vez de con `Text`, que renderiza un
 * `<p>` y no puede envolver los ítems de una lista de definiciones.
 */
function Stat({ label, value, highlight = false, last = false }: StatProps) {
  const base = cn(statVariants(), 'tracking-n0_5')

  return (
    <div
      className={cn(
        'flex items-start justify-between gap-4',
        !last && 'border-b border-basic-00-05 pb-1.25',
      )}
    >
      <dt className={cn(base, 'text-basic-500')}>{label}</dt>
      <dd className={cn(base, highlight ? 'text-foreground' : 'text-primary-foreground')}>
        {value}
      </dd>
    </div>
  )
}

/**
 * Columna derecha del detalle: los parámetros de la "misión" (o sea, los
 * metadatos del post) y un resumen de lo que trae la nota.
 */
export function ArticleSidebar({ article }: { article: NewsArticleDetail }) {
  const isRecent = /minute|hour|day/i.test(article.timeAgo)
  const paragraphs = article.blocks.filter((block) => block.kind === 'paragraph').length

  return (
    <aside className="flex w-full flex-col gap-4">
      <Panel title="Mission parameters">
        <Row label="Target">
          <Value>{article.tag.toUpperCase()}</Value>
        </Row>

        <Row label="Status">
          <Text
            variant="meta.3"
            className="bg-blue-700-20 px-1 text-foreground uppercase"
            title={`Publicado hace ${article.timeAgo}`}
          >
            {isRecent ? 'Active_transmitting' : 'Archived'}
          </Text>
        </Row>

        <Row label="Entry">
          <Value>#{article.id}</Value>
        </Row>

        <Row label="Published" last>
          <Value>
            <time dateTime={article.publishedAt}>{toMissionTimestamp(article.publishedAt)}</time>
          </Value>
        </Row>
      </Panel>

      <Panel title="Data integrity" action={<CheckCircle className="size-4 text-foreground" />}>
        <LengthChart article={article} />

        <dl className="flex w-full flex-col gap-1">
          <Stat label="Paragraphs" value={String(paragraphs).padStart(3, '0')} highlight />
          <Stat label="Assets" value={String(article.figures.length).padStart(3, '0')} />
          <Stat label="Read time" value={article.readingTime ?? '—'} last />
        </dl>
      </Panel>
    </aside>
  )
}
