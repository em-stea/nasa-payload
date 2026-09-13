import type {NaturalEventDetail} from "@/features/events/types/events";

import Link from "next/link";

import {EventStatusBadge} from "@/features/events/components/event-status-badge";
import {Button} from "@/shared/components/button/button";
import {Heading} from "@/shared/components/heading/heading";
import {Text} from "@/shared/components/text/text";

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
  const first = event.track[0];

  return `${event.category.label} tracked by NASA EONET since ${first.date}, last fix at ${event.coords}.`;
}

export function EventDetailHero({event}: {event: NaturalEventDetail}) {
  const feed = event.sources[0];

  return (
    <header className="flex w-full flex-col gap-4">
      <div className="flex flex-wrap items-center gap-3">
        <EventStatusBadge status={event.status} />

        <Text className="text-basic-500" variant="meta.3">
          {event.code}
        </Text>
      </div>

      <Heading
        as="h1"
        className="lg:leading-13.2 text-8 leading-10 text-primary-foreground lg:text-12"
        variant="title.2"
      >
        {event.title}
      </Heading>

      <Text className="max-w-3xl text-muted-foreground" variant="body.1">
        {event.description ?? toFallbackDescription(event)}
      </Text>

      <div className="flex flex-wrap items-center gap-3">
        {feed && (
          <Button asChild className="uppercase" size="xs" variant="primary">
            <Link href={feed.url} rel="noreferrer" target="_blank">
              Monitor area
            </Link>
          </Button>
        )}

        <Button asChild size="xs" variant="secondary">
          <Link href={event.sourceUrl} rel="noreferrer" target="_blank">
            Export data
          </Link>
        </Button>
      </div>
    </header>
  );
}
