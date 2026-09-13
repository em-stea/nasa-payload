import Link from 'next/link'

import { CategoryIcon } from '@/features/events/components/category-icon'
import { EventStatusBadge } from '@/features/events/components/event-status-badge'
import { TONE_TEXT } from '@/features/events/constants/categories'
import type { NaturalEvent } from '@/features/events/types/events'
import { Heading } from '@/shared/components/heading/heading'
import { Text } from '@/shared/components/text/text'
import { textVariants } from '@/shared/styles/components/text'
import { cn } from '@/shared/utils/className-builder'

type EventRowProps = {
  label: string
  value: string
  accent?: string
}

/**
 * Fila de datos: rótulo a la izquierda, valor alineado a la derecha.
 *
 * Va como `<dt>/<dd>` y no con `Text`, que renderiza un `<p>` y no puede
 * colgar de una lista de definiciones.
 */
function EventRow({ label, value, accent }: EventRowProps) {
  const base = textVariants({ variant: 'meta.3' })

  return (
    <div className="flex items-baseline justify-between gap-4">
      <dt className={cn(base, 'shrink-0 text-basic-500 uppercase')}>{label}</dt>
      <dd className={cn(base, 'truncate text-primary-foreground', accent)}>{value}</dd>
    </div>
  )
}

/**
 * Card del grid de eventos.
 *
 * Las cuatro filas son las del diseño y salen todas de EONET: la posición y la
 * fecha del último punto de la traza, la magnitud tal como la publica la API y
 * un cuarto dato que cambia según la categoría (el viento de un ciclón, la
 * superficie de un incendio, la deriva de un témpano).
 *
 * No reusa `Card` porque esa está armada alrededor de una imagen destacada y
 * acá no hay ninguna: el evento se cuenta con números.
 */
export function EventCard({ event }: { event: NaturalEvent }) {
  const accent = TONE_TEXT[event.category.tone]

  return (
    <Link
      href={event.href}
      className="group flex h-full flex-col overflow-hidden rounded-lg border border-border bg-card transition-colors duration-300 hover:border-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-200"
    >
      <header className="flex items-center justify-between gap-2 border-b border-border px-4 py-3">
        <Text variant="meta.3" className="truncate text-basic-500">
          {event.code}
        </Text>

        <EventStatusBadge status={event.status} />
      </header>

      <div className="flex flex-1 flex-col gap-4 p-4">
        {/* Dos líneas fijas: alinea las filas de datos entre cards vecinas. */}
        <div className="flex min-h-15.6 items-start justify-between gap-3">
          <Heading
            as="h3"
            variant="title.3"
            className="line-clamp-2 text-6 leading-7.8 text-foreground transition-colors duration-300 group-hover:text-highlight"
          >
            {event.title}
          </Heading>

          <CategoryIcon category={event.category} className={cn('size-6 shrink-0', accent)} />
        </div>

        <dl className="flex flex-col gap-2 border-l border-border pl-3">
          <EventRow label="Coord" value={event.coords} />
          <EventRow label="Severity" value={event.severity} accent={accent} />
          <EventRow label="T-Stamp" value={event.position.date} />
          <EventRow
            label={event.metric.label}
            value={event.metric.value}
            accent={event.metric.accent ? accent : undefined}
          />
        </dl>
      </div>
    </Link>
  )
}
