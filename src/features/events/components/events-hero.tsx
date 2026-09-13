import {WorldMap} from "@/features/events/components/world-map";
import {getEventMarkers} from "@/features/events/services/get-events";

/**
 * Hero de la sección: el planisferio con todo lo que está pasando.
 *
 * Acá solo se traen los datos; el mapa y sus paneles —la telemetría, la
 * lectura del evento apuntado— viven en `WorldMap`, que es cliente porque el
 * hover y el foco tienen que mover las dos cosas a la vez.
 */
export async function EventsHero() {
  const events = await getEventMarkers();

  return (
    <section aria-label="Mapa de eventos naturales" className="relative w-full">
      <WorldMap events={events} />
    </section>
  );
}

/** Fallback del hero: misma caja y mismas medidas, sin marcadores. */
export function EventsHeroSkeleton() {
  return (
    <div
      aria-hidden="true"
      className="aspect-5/2 w-full animate-pulse border-b border-border bg-card"
    />
  );
}
