import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'

import { EventDetailHero } from '@/features/events/components/event-detail-hero'
import { EventTelemetry } from '@/features/events/components/event-telemetry'
import { EventTimeline } from '@/features/events/components/event-timeline'
import { EventTrackMap } from '@/features/events/components/event-track-map'
import { getEvent } from '@/features/events/services/get-event'
import { Container } from '@/shared/components/container/container'

/**
 * Detalle de un evento natural.
 *
 * Todo lo que se ve depende de `params`, así que el shell estático de la ruta
 * es el esqueleto y el contenido entra por streaming, con un fallback de las
 * mismas medidas para que nada salte al resolverse.
 */

export const instant = true

type EventParams = { id: string }

/** El id de la URL es la parte numérica del identificador de EONET. */
function readEventRef(value: string) {
  return /^\d+$/.test(value) ? value : null
}

export async function generateMetadata({
  params,
}: {
  params: Promise<EventParams>
}): Promise<Metadata> {
  const ref = readEventRef((await params).id)
  const event = ref ? await getEvent(ref) : null

  if (!event) return { title: 'Evento no encontrado' }

  return {
    title: event.title,
    description:
      event.description ?? `${event.category.label} tracked by NASA EONET at ${event.coords}.`,
  }
}

export default function EventPage({ params }: { params: Promise<EventParams> }) {
  return (
    <main className="flex min-h-dvh w-full flex-col items-center bg-background pt-24 pb-32 text-primary-foreground">
      <Container className="flex flex-col items-start gap-8">
        <Suspense fallback={<EventSkeleton />}>
          <EventRoute params={params} />
        </Suspense>
      </Container>
    </main>
  )
}

async function EventRoute({ params }: { params: Promise<EventParams> }) {
  const ref = readEventRef((await params).id)
  const event = ref ? await getEvent(ref) : null

  if (!event) notFound()

  return (
    <>
      <EventDetailHero event={event} />

      <div className="grid w-full grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="flex min-w-0 flex-col gap-6 lg:col-span-8">
          <EventTrackMap event={event} />
          <EventTelemetry event={event} />
        </div>

        <div className="lg:col-span-4">
          <EventTimeline event={event} />
        </div>
      </div>
    </>
  )
}

/** Mismas medidas que el contenido, para que nada salte al resolverse. */
function EventSkeleton() {
  return (
    <div className="flex w-full animate-pulse flex-col gap-8" aria-hidden="true">
      <div className="flex flex-col gap-4">
        <div className="h-6 w-48 rounded-lg bg-card" />
        <div className="h-12 w-3/4 bg-card" />
        <div className="h-12 w-full max-w-3xl bg-card" />
        <div className="h-9 w-64 bg-card" />
      </div>

      <div className="grid w-full grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="flex flex-col gap-6 lg:col-span-8">
          <div className="aspect-16/9 w-full rounded-lg border border-border bg-card" />
          <div className="h-80 w-full rounded-lg border border-border bg-card" />
        </div>

        <div className="lg:col-span-4">
          <div className="h-150 w-full rounded-lg border border-border bg-card" />
        </div>
      </div>
    </div>
  )
}
