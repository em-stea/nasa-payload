import type {Metadata} from "next";

import {Suspense} from "react";

import {
  AsteroidResults,
  AsteroidResultsSkeleton,
} from "@/features/asteroids/components/asteroid-results";
import {AsteroidResultsBoundary} from "@/features/asteroids/components/asteroid-results-boundary";
import {Container} from "@/shared/components/container/container";
import {TextHero} from "@/shared/components/text-hero/text-hero";

export const metadata: Metadata = {
  title: "Asteroid Tracker",
  description:
    "Real-time telemetry and orbital analysis of Near-Earth Objects using NASA JPL data feeds.",
};

export const instant = true;

type AsteroidsSearchParams = {
  page?: string | string[];
};

function readPage(value: string | string[] | undefined) {
  const raw = Array.isArray(value) ? value[0] : value;
  const page = Number.parseInt(raw ?? "1", 10);

  return Number.isFinite(page) && page > 0 ? page : 1;
}

export default function AsteroidsPage({
  searchParams,
}: {
  searchParams: Promise<AsteroidsSearchParams>;
}) {
  return (
    <main className="flex min-h-dvh w-full flex-col items-center bg-background pt-24 pb-32 text-primary-foreground">
      <Container className="flex flex-col items-start gap-12">
        <TextHero
          hasChip={[
            {
              active: false,
              label: "Status: Optimal",
            },
            {
              active: true,
              label: "Live Feed",
            },
          ]}
          description="Real-time telemetry and orbital analysis of Near-Earth Objects (NEOs) utilizing global radar arrays and NASA JPL data feeds. System active. Monitoring potential impact trajectories and orbital intersections."
          eyebrow="SYS_MODULE_01"
          overline="Near-Earth Object Monitoring"
          title="Asteroid Tracker"
        />

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
