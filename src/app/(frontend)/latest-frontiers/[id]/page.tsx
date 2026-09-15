import type {Metadata} from "next";

import {notFound} from "next/navigation";
import {Suspense} from "react";

import {LatestFrontierHero} from "@/features/latest-frontiers/components/latest-frontier-hero";
import {getLatestFrontier} from "@/features/latest-frontiers/services/get-latest-frontier";
import {ArticleBreadcrumbs} from "@/features/news/components/article-breadcrumbs";
import {Container} from "@/shared/components/container/container";
import {Text} from "@/shared/components/text/text";

/**
 * Detalle de un item del catálogo de imágenes.
 *
 * Todo lo que se ve depende de `params`, así que el shell estático de la ruta
 * es el esqueleto y el contenido entra por streaming, igual que en el detalle
 * de una noticia o de un asteroide.
 */

export const instant = true;

type LatestFrontierParams = {id: string};

function readFrontierId(value: string) {
  const id = decodeURIComponent(value).trim();

  return id.length > 0 ? id : null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<LatestFrontierParams>;
}): Promise<Metadata> {
  const id = readFrontierId((await params).id);
  const frontier = id ? await getLatestFrontier(id) : null;

  if (!frontier) return {title: "Frontier no encontrado"};

  return {
    title: frontier.title,
    description: frontier.description,
    openGraph: {
      type: "article",
      title: frontier.title,
      description: frontier.description,
      publishedTime: frontier.dateTime,
      images: frontier.image ? [{url: frontier.image}] : undefined,
    },
  };
}

export default function LatestFrontierPage({params}: {params: Promise<LatestFrontierParams>}) {
  return (
    <main className="flex min-h-dvh w-full flex-col items-center bg-background pt-24 pb-32 text-primary-foreground">
      <Container className="flex flex-col items-start gap-8">
        <Suspense fallback={<LatestFrontierDetailSkeleton />}>
          <LatestFrontierRoute params={params} />
        </Suspense>
      </Container>
    </main>
  );
}

async function LatestFrontierRoute({params}: {params: Promise<LatestFrontierParams>}) {
  const id = readFrontierId((await params).id);
  const frontier = id ? await getLatestFrontier(id) : null;

  if (!frontier) notFound();

  return (
    <>
      <ArticleBreadcrumbs
        items={[
          {label: "Archive", href: "/"},
          {label: "Latest Frontiers", href: "/latest-frontiers"},
          {label: frontier.title},
        ]}
      />

      <LatestFrontierHero frontier={frontier} />

      <div className="flex w-full min-w-0 flex-col gap-6">
        {frontier.description && (
          <Text className="text-muted-foreground" variant="body.1">
            {frontier.description}
          </Text>
        )}

        {frontier.location && (
          <Text className="text-basic-500 uppercase" variant="meta.3">
            Location: {frontier.location}
          </Text>
        )}
      </div>
    </>
  );
}

/** Mismas medidas que el contenido, para que nada salte al resolverse. */
function LatestFrontierDetailSkeleton() {
  return (
    <div aria-hidden="true" className="flex w-full animate-pulse flex-col gap-8">
      <div className="h-4 w-64 bg-card" />
      <div className="h-70 w-full border border-border bg-card sm:h-96" />

      <div className="flex flex-col gap-3">
        <div className="h-4 w-full bg-card" />
        <div className="h-4 w-full bg-card" />
        <div className="h-4 w-2/3 bg-card" />
      </div>
    </div>
  );
}
