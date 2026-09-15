import type {Metadata} from "next";

import {Suspense} from "react";

import {
  LatestFrontiersGrid,
  LatestFrontiersGridSkeleton,
} from "@/features/latest-frontiers/components/latest-frontiers-grid";
import {LatestFrontiersHero} from "@/features/latest-frontiers/components/latest-frontiers-hero";
import {Container} from "@/shared/components/container/container";

export const metadata: Metadata = {
  title: "NASA — Latest Frontiers",
  description:
    "Curated telemetry, imagery, and updates from NASA's ongoing deep space operations, scientific discoveries, and orbital research missions.",
};

/**
 * Pide a Next que valide que navegar a esta ruta pinta UI al instante. Si algo
 * bloquea —una lectura sin cachear, un `<Suspense>` que falta— lo avisa en el
 * overlay de desarrollo en vez de dejarlo pasar a producción.
 */
export const instant = true;

type LatestFrontiersSearchParams = {
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
 * El hero es estático y viaja en el shell de la ruta. El grid depende de
 * `searchParams` y cuelga de su propio `<Suspense>`, con un fallback de las
 * mismas medidas que su contenido, así nada se mueve cuando resuelve.
 */
export default function LatestFrontiersPage({
  searchParams,
}: {
  searchParams: Promise<LatestFrontiersSearchParams>;
}) {
  return (
    <main className="flex min-h-dvh w-full flex-col items-center bg-background pt-24 pb-32 text-primary-foreground">
      <Container className="flex flex-col items-start gap-8">
        <LatestFrontiersHero />

        <Suspense fallback={<LatestFrontiersGridSkeleton />}>
          <LatestFrontiersResults searchParams={searchParams} />
        </Suspense>
      </Container>
    </main>
  );
}

async function LatestFrontiersResults({
  searchParams,
}: {
  searchParams: Promise<LatestFrontiersSearchParams>;
}) {
  const params = await searchParams;

  return <LatestFrontiersGrid page={readPage(params.page)} />;
}
