import type {Metadata} from "next";

import {notFound} from "next/navigation";
import {Suspense} from "react";

import {AsteroidDetailHero} from "@/features/asteroids/components/asteroid-detail-hero";
import {CloseApproachPanel} from "@/features/asteroids/components/close-approach-panel";
import {HazardAnalysis} from "@/features/asteroids/components/hazard-analysis";
import {OrbitalParameters} from "@/features/asteroids/components/orbital-parameters";
import {PhysicalCharacteristics} from "@/features/asteroids/components/physical-characteristics";
import {getAsteroid} from "@/features/asteroids/services/get-asteroid";
import {ArticleBreadcrumbs} from "@/features/news/components/article-breadcrumbs";
import {Container} from "@/shared/components/container/container";

/**
 * Detalle de un objeto del catálogo.
 *
 * Todo lo que se ve depende de `params`, así que el shell estático de la ruta
 * es el esqueleto y el contenido entra por streaming, igual que en el detalle
 * de una noticia.
 */

export const instant = true;

type AsteroidParams = {id: string};

/** El id de NeoWs es numérico y viaja como string; cualquier otra cosa es 404. */
function readAsteroidId(value: string) {
  return /^\d+$/.test(value) ? value : null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<AsteroidParams>;
}): Promise<Metadata> {
  const id = readAsteroidId((await params).id);
  const asteroid = id ? await getAsteroid(id) : null;

  if (!asteroid) return {title: "Objeto no encontrado"};

  return {
    title: `${asteroid.name} · Asteroid Tracker`,
    description: asteroid.summary,
  };
}

export default function AsteroidPage({params}: {params: Promise<AsteroidParams>}) {
  return (
    <main className="flex min-h-dvh w-full flex-col items-center bg-background pt-24 pb-32 text-primary-foreground">
      <Container className="flex flex-col items-start gap-8">
        <Suspense fallback={<AsteroidDetailSkeleton />}>
          <AsteroidRoute params={params} />
        </Suspense>
      </Container>
    </main>
  );
}

async function AsteroidRoute({params}: {params: Promise<AsteroidParams>}) {
  const id = readAsteroidId((await params).id);
  const asteroid = id ? await getAsteroid(id) : null;

  if (!asteroid) notFound();

  return (
    <>
      <ArticleBreadcrumbs
        items={[
          {label: "Archive", href: "/"},
          {label: "Asteroids", href: "/asteroids"},
          {label: asteroid.name},
        ]}
      />

      <AsteroidDetailHero asteroid={asteroid} />

      <div className="grid w-full grid-cols-1 gap-8 lg:grid-cols-12">
        <div className="min-w-0 lg:col-span-4">
          <HazardAnalysis asteroid={asteroid} />
        </div>

        <div className="min-w-0 lg:col-span-8">
          <OrbitalParameters asteroid={asteroid} />
        </div>
      </div>

      <div className="grid w-full grid-cols-1 gap-8 lg:grid-cols-12">
        <div className="min-w-0 lg:col-span-5">
          <CloseApproachPanel asteroid={asteroid} />
        </div>

        <div className="min-w-0 lg:col-span-7">
          <PhysicalCharacteristics asteroid={asteroid} />
        </div>
      </div>
    </>
  );
}

/** Mismas medidas que el contenido, para que nada salte al resolverse. */
function AsteroidDetailSkeleton() {
  return (
    <div aria-hidden="true" className="flex w-full animate-pulse flex-col gap-8">
      <div className="h-4 w-64 bg-card" />

      <div className="grid w-full grid-cols-1 items-start gap-6 lg:grid-cols-12 lg:gap-8">
        <div className="flex flex-col gap-3 lg:col-span-8">
          <div className="h-3 w-48 bg-card" />
          <div className="h-10 w-2/3 bg-card" />
          <div className="h-24 w-full bg-card" />
        </div>
        <div className="aspect-4/3 w-full rounded-lg border border-border bg-card lg:col-span-4" />
      </div>

      <div className="grid w-full grid-cols-1 gap-8 lg:grid-cols-12">
        <div className="h-60 w-full bg-card lg:col-span-4" />
        <div className="h-40 w-full bg-card lg:col-span-8" />
      </div>

      <div className="grid w-full grid-cols-1 gap-8 lg:grid-cols-12">
        <div className="h-64 w-full rounded-lg border border-border bg-card lg:col-span-5" />
        <div className="h-56 w-full bg-card lg:col-span-7" />
      </div>
    </div>
  );
}
