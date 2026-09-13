import type {AsteroidDetail} from "@/features/asteroids/types/asteroid";

import {ViewTransition} from "react";

import {AsteroidMesh} from "@/features/asteroids/components/asteroid-mesh";
import {buildAsteroidMeshTransitionName} from "@/features/asteroids/utils/build-asteroids-href";
import {Heading} from "@/shared/components/heading/heading";
import {Text} from "@/shared/components/text/text";

/**
 * Cabecera del detalle: la ficha del objeto a la izquierda y el render de
 * malla a la derecha.
 *
 * El render comparte el `ViewTransition` con la card del listado, así que al
 * entrar desde el grid la silueta se morphea en vez de reemplazarse.
 */

export function AsteroidDetailHero({asteroid}: {asteroid: AsteroidDetail}) {
  return (
    <header className="grid w-full grid-cols-1 items-start gap-6 lg:grid-cols-12 lg:gap-8">
      <div className="flex min-w-0 flex-col gap-3 lg:col-span-8">
        <Text className="text-muted-foreground" variant="meta.1">
          Near-Earth object / ID: {asteroid.id}
        </Text>

        <Heading
          as="h1"
          className="text-7 leading-8.5 tracking-n0.96 text-foreground uppercase sm:text-8 sm:leading-10"
          variant="title.2"
        >
          Object: {asteroid.name}
        </Heading>

        <Text className="max-w-2xl text-muted-foreground" variant="body.1">
          {asteroid.summary}
        </Text>

        <Text className="text-muted-foreground" variant="meta.1">
          Data source:{" "}
          <a
            className="text-primary-foreground normal-case underline underline-offset-4 transition-colors duration-200 hover:text-foreground"
            href={asteroid.jplUrl}
            rel="noreferrer"
            target="_blank"
          >
            NASA NeoWs API
          </a>
        </Text>
      </div>

      <figure className="relative aspect-4/3 w-full overflow-hidden rounded-lg border border-border bg-muted lg:col-span-4">
        <ViewTransition name={buildAsteroidMeshTransitionName(asteroid.id)}>
          <AsteroidMesh className="text-basic-300" seed={asteroid.id} />
        </ViewTransition>

        <figcaption className="absolute inset-x-0 bottom-0 bg-basic-960-80 px-3 py-2 backdrop-blur-xs">
          <Text className="text-basic-300" variant="meta.1">
            Visualization: mesh render
          </Text>
        </figcaption>
      </figure>
    </header>
  );
}
