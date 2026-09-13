import {notFound} from "next/navigation";

import {AsteroidGrid, AsteroidGridSkeleton} from "@/features/asteroids/components/asteroid-grid";
import {RadarAperture} from "@/features/asteroids/components/radar-aperture";
import {ScaleComparator} from "@/features/asteroids/components/scale-comparator";
import {getAsteroidFeed} from "@/features/asteroids/services/get-asteroid-feed";
import {buildAsteroidsHref} from "@/features/asteroids/utils/build-asteroids-href";
import {Pagination} from "@/shared/components/pagination/pagination";

/**
 * Las tres secciones que dependen de la página pedida.
 *
 * Van juntas en un solo componente —y detrás de un solo `<Suspense>`— porque
 * las tres leen la misma página del catálogo: el radar y el comparador son dos
 * lecturas distintas de los mismos nueve objetos que pinta el grid, así que
 * separarlas sería pedir el mismo dato tres veces y, peor, dejar que resuelvan
 * en momentos distintos.
 */
export async function AsteroidResults({page}: {page: number}) {
  const feed = await getAsteroidFeed({page});

  // Sin resultados en una página que existe significa URL inventada.
  if (feed.asteroids.length === 0) {
    notFound();
  }

  return (
    <>
      <RadarAperture asteroids={feed.asteroids} />

      <ScaleComparator asteroids={feed.asteroids} />

      <AsteroidGrid asteroids={feed.asteroids} total={feed.totalAsteroids} />

      <div className="w-full border-t border-border pt-6">
        <Pagination
          prefetch
          buildHref={(target) => buildAsteroidsHref({page: target})}
          page={feed.page}
          totalPages={feed.totalPages}
        />
      </div>
    </>
  );
}

/**
 * Fallback con las mismas medidas que el contenido: el panel del radar, el del
 * comparador, el grid y la fila de paginación, para que nada salte al
 * resolverse.
 */
export function AsteroidResultsSkeleton() {
  return (
    <div aria-hidden="true" className="flex w-full animate-pulse flex-col gap-12">
      <div className="flex w-full flex-col gap-4">
        <div className="h-8 w-64 rounded bg-card" />
        <div className="h-72 w-full rounded-2xl border border-border bg-muted sm:h-96 lg:h-104" />
      </div>

      <div className="flex w-full flex-col gap-4">
        <div className="h-8 w-72 rounded bg-card" />
        <div className="h-72 w-full rounded-2xl border border-border bg-muted sm:h-80" />
      </div>

      <div className="flex w-full flex-col gap-4">
        <div className="h-8 w-56 rounded bg-card" />
        <AsteroidGridSkeleton />
      </div>

      <div className="w-full border-t border-border pt-6">
        <div className="h-14" />
      </div>
    </div>
  );
}
