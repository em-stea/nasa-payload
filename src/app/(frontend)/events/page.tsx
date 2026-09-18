import type {Metadata} from "next";

import {Suspense} from "react";

import {EventsFilterBar} from "@/features/events/components/events-filter-bar";
import {EventsFilterBarLive} from "@/features/events/components/events-filter-bar-live";
import {EventsGrid, EventsGridSkeleton} from "@/features/events/components/events-grid";
import {EventsHero, EventsHeroSkeleton} from "@/features/events/components/events-hero";
import {EventsResultsBoundary} from "@/features/events/components/events-results-boundary";
import {isEventCategorySlug} from "@/features/events/constants/categories";
import {Container} from "@/shared/components/container/container";

export const metadata: Metadata = {
  title: "Global Events Tracker",
  description:
    "Wildfires, storms, floods, volcanoes and ice events currently tracked by NASA EONET, plotted worldwide.",
};

export const instant = true;

type EventsSearchParams = {
  category?: string | string[];
  page?: string | string[];
};

function readParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function readPage(value: string | string[] | undefined) {
  const page = Number.parseInt(readParam(value) ?? "1", 10);

  return Number.isFinite(page) && page > 0 ? page : 1;
}

/**
 * El mapa va a sangre debajo de la barra; el resto de la pantalla entra en el
 * container. Cada bloque que depende de datos o de `searchParams` cuelga de su
 * propio `<Suspense>`, con un fallback de las mismas medidas que su contenido,
 * así nada se mueve cuando resuelve.
 */
export default function EventsPage({searchParams}: {searchParams: Promise<EventsSearchParams>}) {
  return (
    <main className="flex min-h-dvh w-full flex-col items-center bg-background pt-18 pb-32 text-primary-foreground">
      <Suspense fallback={<EventsHeroSkeleton />}>
        <EventsHero />
      </Suspense>

      <Container className="flex flex-col items-start gap-8 pt-8">
        <div className="w-full border-b border-border">
          <Suspense fallback={<EventsFilterBar />}>
            <EventsFilterBarLive />
          </Suspense>
        </div>

        <Suspense fallback={<EventsGridSkeleton />}>
          <EventsResultsBoundary fallback={<EventsGridSkeleton />}>
            <EventsResults searchParams={searchParams} />
          </EventsResultsBoundary>
        </Suspense>
      </Container>
    </main>
  );
}

async function EventsResults({searchParams}: {searchParams: Promise<EventsSearchParams>}) {
  const params = await searchParams;
  const rawCategory = readParam(params.category);

  return (
    <EventsGrid
      category={isEventCategorySlug(rawCategory) ? rawCategory : undefined}
      page={readPage(params.page)}
    />
  );
}
