import {notFound} from "next/navigation";

import {AsteroidGrid, AsteroidGridSkeleton} from "@/features/asteroids/components/asteroid-grid";
import {RadarAperture} from "@/features/asteroids/components/radar-aperture";
import {ScaleComparator} from "@/features/asteroids/components/scale-comparator";
import {getAsteroidFeed} from "@/features/asteroids/services/get-asteroid-feed";
import {buildAsteroidsHref} from "@/features/asteroids/utils/build-asteroids-href";
import {Pagination} from "@/shared/components/pagination/pagination";

export async function AsteroidResults({page}: {page: number}) {
  const feed = await getAsteroidFeed({page});

  if (feed.asteroids.length === 0) notFound();

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
