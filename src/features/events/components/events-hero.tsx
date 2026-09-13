import { WorldMap } from '@/features/events/components/world-map'
import { getEventMarkers } from '@/features/events/services/get-events'
import type { NaturalEvent } from '@/features/events/types/events'
import { Text } from '@/shared/components/text/text'

/**
 * Hero de la sección: el planisferio con todo lo que está pasando, y encima la
 * caja de telemetría del diseño.
 *
 * Lo que muestra la caja son datos del propio catálogo —cuántos eventos hay
 * abiertos y cuándo se actualizó la traza más reciente— y no telemetría de un
 * satélite, que sería un número inventado sobre un mapa de datos reales.
 */

/** Fecha del punto más nuevo de todo el conjunto. */
function toLastUpdate(events: NaturalEvent[]) {
  return events.reduce<string | null>((latest, event) => {
    const date = event.position.date

    return latest === null || Date.parse(date) > Date.parse(latest) ? date : latest
  }, null)
}

function TelemetryPanel({ events }: { events: NaturalEvent[] }) {
  const lastUpdate = toLastUpdate(events)

  return (
    <div className="absolute top-4 left-4 rounded-lg border border-border bg-background/80 px-4 py-3 backdrop-blur-xs sm:top-6 sm:left-6">
      <Text variant="body.4" className="text-foreground">
        Live_telemetry
      </Text>

      <dl className="mt-2 flex flex-col gap-1">
        <div className="flex items-baseline gap-2">
          <dt className="sr-only">Eventos monitoreados</dt>
          <dd className="font-jetbrains-mono text-3 leading-4.2 text-primary-foreground">
            TRACKED: {String(events.length).padStart(3, '0')}
          </dd>
        </div>

        {lastUpdate && (
          <div className="flex items-baseline gap-2">
            <dt className="sr-only">Última actualización</dt>
            <dd className="font-jetbrains-mono text-3 leading-4.2 text-basic-500">
              <time dateTime={lastUpdate}>UPDATED: {lastUpdate}</time>
            </dd>
          </div>
        )}
      </dl>
    </div>
  )
}

export async function EventsHero() {
  const events = await getEventMarkers()

  return (
    <section aria-label="Mapa de eventos naturales" className="relative w-full">
      <WorldMap events={events} />
      <TelemetryPanel events={events} />
    </section>
  )
}

/** Fallback del hero: misma caja y mismas medidas, sin marcadores. */
export function EventsHeroSkeleton() {
  return (
    <div
      aria-hidden="true"
      className="aspect-2/1 w-full animate-pulse border-b border-border bg-card"
    />
  )
}
