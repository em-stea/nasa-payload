import Link from 'next/link'

import { EventStatusBadge } from '@/features/events/components/event-status-badge'
import type { NaturalEventDetail } from '@/features/events/types/events'
import { Button } from '@/shared/components/button/button'
import { Heading } from '@/shared/components/heading/heading'
import { Text } from '@/shared/components/text/text'

/**
 * Cabecera del detalle: nivel de alerta, identificador, titular y los dos
 * accesos del diseño.
 *
 * Los botones no son decorativos: "Monitor area" lleva al feed de la agencia
 * que sigue el evento (NOAA, InciWeb, el observatorio de turno, según lo que
 * declare EONET en `sources`) y "Export data" al JSON del evento en EONET, que
 * es de donde sale todo lo que se ve en esta pantalla.
 */

/** Bajada cuando EONET no publica descripción, que es lo habitual. */
function toFallbackDescription(event: NaturalEventDetail) {
  const first = event.track[0]

  return `${event.category.label} tracked by NASA EONET since ${first.date}, last fix at ${event.coords}.`
}

export function EventDetailHero({ event }: { event: NaturalEventDetail }) {
  const feed = event.sources[0]

  return (
    <header className="flex w-full flex-col gap-4">
      <div className="flex flex-wrap items-center gap-3">
        <EventStatusBadge status={event.status} />

        <Text variant="meta.3" className="text-basic-500">
          {event.code}
        </Text>
      </div>

      <Heading
        as="h1"
        variant="title.2"
        className="text-8 leading-10 text-primary-foreground lg:text-12 lg:leading-13.2"
      >
        {event.title}
      </Heading>

      <Text variant="body.1" className="max-w-3xl text-muted-foreground">
        {event.description ?? toFallbackDescription(event)}
      </Text>

      <div className="flex flex-wrap items-center gap-3">
        {feed && (
          <Button asChild variant="primary" size="xs" className="uppercase">
            <Link href={feed.url} target="_blank" rel="noreferrer">
              Monitor area
            </Link>
          </Button>
        )}

        <Button asChild variant="secondary" size="xs">
          <Link href={event.sourceUrl} target="_blank" rel="noreferrer">
            Export data
          </Link>
        </Button>
      </div>
    </header>
  )
}
