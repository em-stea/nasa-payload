import type {Metadata} from "next";

import {notFound} from "next/navigation";
import {Suspense} from "react";

import {MissionDetailHero} from "@/features/missions/components/mission-detail-hero";
import {MissionOverview} from "@/features/missions/components/mission-overview";
import {MissionProfile} from "@/features/missions/components/mission-profile";
import {TechnologyReadiness} from "@/features/missions/components/technology-readiness";
import {getMission} from "@/features/missions/services/get-mission";
import {ArticleBreadcrumbs} from "@/features/news/components/article-breadcrumbs";
import {Container} from "@/shared/components/container/container";

/**
 * Detalle de un proyecto de TechPort.
 *
 * Todo lo que se ve depende de `params`, así que el shell estático de la ruta
 * es el esqueleto y el contenido entra por streaming, igual que en el detalle
 * de un asteroide o de un item del catálogo de imágenes.
 */

export const instant = true;

type MissionParams = {id: string};

/** El projectId de TechPort es numérico; cualquier otra cosa es 404. */
function readMissionId(value: string) {
  return /^\d+$/.test(value) ? value : null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<MissionParams>;
}): Promise<Metadata> {
  const id = readMissionId((await params).id);
  const mission = id ? await getMission(id) : null;

  if (!mission) return {title: "Mission no encontrada"};

  return {
    title: `${mission.title} · Featured Missions`,
    description: mission.description,
  };
}

export default function MissionPage({params}: {params: Promise<MissionParams>}) {
  return (
    <main className="flex min-h-dvh w-full flex-col items-center bg-background pt-24 pb-32 text-primary-foreground">
      <Container className="flex flex-col items-start gap-8">
        <Suspense fallback={<MissionDetailSkeleton />}>
          <MissionRoute params={params} />
        </Suspense>
      </Container>
    </main>
  );
}

async function MissionRoute({params}: {params: Promise<MissionParams>}) {
  const id = readMissionId((await params).id);
  const mission = id ? await getMission(id) : null;

  if (!mission) notFound();

  return (
    <>
      <ArticleBreadcrumbs
        items={[
          {label: "Archive", href: "/"},
          {label: "Featured Missions", href: "/"},
          {label: mission.title},
        ]}
      />

      <MissionDetailHero mission={mission} />

      <MissionOverview mission={mission} />

      <div className="grid w-full grid-cols-1 gap-8 lg:grid-cols-12">
        <div className="min-w-0 lg:col-span-5">
          <TechnologyReadiness mission={mission} />
        </div>

        <div className="min-w-0 lg:col-span-7">
          <MissionProfile mission={mission} />
        </div>
      </div>
    </>
  );
}

/** Mismas medidas que el contenido, para que nada salte al resolverse. */
function MissionDetailSkeleton() {
  return (
    <div aria-hidden="true" className="flex w-full animate-pulse flex-col gap-8">
      <div className="h-4 w-64 bg-card" />
      <div className="h-70 w-full border border-border bg-card sm:h-96" />

      <div className="flex flex-col gap-3">
        <div className="h-4 w-full bg-card" />
        <div className="h-4 w-full bg-card" />
        <div className="h-4 w-2/3 bg-card" />
      </div>

      <div className="grid w-full grid-cols-1 gap-8 lg:grid-cols-12">
        <div className="h-40 w-full bg-card lg:col-span-5" />
        <div className="h-64 w-full bg-card lg:col-span-7" />
      </div>
    </div>
  );
}
