import type {Metadata} from "next";

import {Suspense} from "react";

import {AsteroidHero} from "@/features/asteroids/components/asteroid-hero";
import {
  AsteroidResults,
  AsteroidResultsSkeleton,
} from "@/features/asteroids/components/asteroid-results";
import {AsteroidResultsBoundary} from "@/features/asteroids/components/asteroid-results-boundary";
import {Container} from "@/shared/components/container/container";

export const metadata: Metadata = {
  title: "Asteroid Tracker",
  description:
    "Real-time telemetry and orbital analysis of Near-Earth Objects using NASA JPL data feeds.",
};

/**
 * Pide a Next que valide que navegar a esta ruta pinta UI al instante. Si algo
 * bloquea —una lectura sin cachear, un `<Suspense>` que falta— lo avisa en el
 * overlay de desarrollo en vez de dejarlo pasar a producción.
 */
export const instant = true;

type AsteroidsSearchParams = {
  page?: string | string[];
};

function readPage(value: string | string[] | undefined) {
  const raw = Array.isArray(value) ? value[0] : value;
  const page = Number.parseInt(raw ?? "1", 10);

  return Number.isFinite(page) && page > 0 ? page : 1;
}

/**
 * El hero es estático y viaja en el shell de la ruta. Todo lo que depende de
 * `searchParams` —radar, comparador y grid— cuelga de un `<Suspense>` con un
 * fallback de las mismas medidas, así nada se mueve cuando resuelve.
 */
export default function AsteroidsPage({
  searchParams,
}: {
  searchParams: Promise<AsteroidsSearchParams>;
}) {
  return (
    <main className="flex min-h-dvh w-full flex-col items-center bg-background pt-24 pb-32 text-primary-foreground">
      <Container className="flex flex-col items-start gap-12">
        <AsteroidHero />

        <Suspense fallback={<AsteroidResultsSkeleton />}>
          <AsteroidResultsBoundary fallback={<AsteroidResultsSkeleton />}>
            <AsteroidsRoute searchParams={searchParams} />
          </AsteroidResultsBoundary>
        </Suspense>
      </Container>
    </main>
  );
}

async function AsteroidsRoute({searchParams}: {searchParams: Promise<AsteroidsSearchParams>}) {
  return <AsteroidResults page={readPage((await searchParams).page)} />;
}
