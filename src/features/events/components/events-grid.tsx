import type {EventCategorySlug} from "@/features/events/constants/categories";

import {notFound} from "next/navigation";

import {EventCard} from "@/features/events/components/event-card";
import {EVENTS_PER_PAGE, getEvents} from "@/features/events/services/get-events";
import {buildEventsHref} from "@/features/events/utils/build-events-href";
import {Heading} from "@/shared/components/heading/heading";
import {Pagination} from "@/shared/components/pagination/pagination";

type EventsGridProps = {
  page: number;
  category?: EventCategorySlug;
};

/**
 * Filas de alto fijo, como el grid del diseño.
 *
 * No es cosmético: es lo que hace que el skeleton ocupe exactamente el mismo
 * espacio que el contenido y que la navegación no empuje nada al resolverse.
 * El contenido entra porque el titular está clampeado a dos líneas.
 */
const GRID_CLASSNAME = "grid w-full auto-rows-72 grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3";

const PAGINATION_CLASSNAME = "w-full border-t border-border pt-6";

/**
 * Rótulo de la sección. Es el `h1` de la página: el hero es un mapa sin
 * titular, así que el encabezado de la lista es el título real de la pantalla.
 */
function SectionTitle() {
  return (
    <Heading as="h1" variant="title.1-bold">
      Latest Worldwide Catastrophes
    </Heading>
  );
}

export async function EventsGrid({page, category}: EventsGridProps) {
  const events = await getEvents({page, category});

  // Sin resultados en una página que existe significa URL inventada.
  if (events.events.length === 0) notFound();

  return (
    <>
      <SectionTitle />

      <div className={GRID_CLASSNAME}>
        {events.events.map((event) => (
          <EventCard event={event} key={event.id} />
        ))}
      </div>

      <div className={PAGINATION_CLASSNAME}>
        <Pagination
          prefetch
          buildHref={(target) => buildEventsHref({page: target, category})}
          page={events.page}
          totalPages={events.totalPages}
        />
      </div>
    </>
  );
}

/**
 * Fallback del grid: mismo layout, mismas alturas, sin contenido. Reserva
 * también el bloque de paginación para que el footer no salte.
 */
export function EventsGridSkeleton() {
  return (
    <>
      <SectionTitle />

      <div aria-hidden="true" className={GRID_CLASSNAME}>
        {Array.from({length: EVENTS_PER_PAGE}, (_, index) => (
          <div
            className="h-full animate-pulse rounded-lg border border-basic-00-10 bg-card"
            key={index}
          />
        ))}
      </div>

      <div aria-hidden="true" className={PAGINATION_CLASSNAME}>
        <div className="h-14" />
      </div>
    </>
  );
}
