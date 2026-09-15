import {notFound} from "next/navigation";

import {
  getLatestFrontiers,
  LATEST_FRONTIERS_PER_PAGE,
} from "@/features/latest-frontiers/services/get-latest-frontiers";
import {buildLatestFrontiersHref} from "@/features/latest-frontiers/utils/build-latest-frontiers-href";
import {assignFrontierTone} from "@/features/latest-frontiers/utils/tone";
import {LatestNewsCard} from "@/shared/components/card/latest-news-card";
import {Pagination} from "@/shared/components/pagination/pagination";

type LatestFrontiersGridProps = {
  page: number;
};

const GRID_CLASSNAME = "grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3";
const PAGINATION_CLASSNAME = "w-full border-t border-border pt-6";

export async function LatestFrontiersGrid({page}: LatestFrontiersGridProps) {
  const frontiers = await getLatestFrontiers({page});

  // Sin resultados en una página que existe significa URL inventada.
  if (frontiers.items.length === 0) {
    notFound();
  }

  return (
    <>
      <div className={GRID_CLASSNAME}>
        {frontiers.items.map((frontier, index) => (
          <LatestNewsCard data={{...frontier, tone: assignFrontierTone(index)}} key={frontier.id} />
        ))}
      </div>

      <div className={PAGINATION_CLASSNAME}>
        <Pagination
          prefetch
          buildHref={(target) => buildLatestFrontiersHref({page: target})}
          page={frontiers.page}
          totalPages={frontiers.totalPages}
        />
      </div>
    </>
  );
}

/** Mismo layout, mismas alturas, sin contenido: reserva el espacio del grid y la paginación. */
export function LatestFrontiersGridSkeleton() {
  return (
    <>
      <div aria-hidden="true" className={GRID_CLASSNAME}>
        {Array.from({length: LATEST_FRONTIERS_PER_PAGE}, (_, index) => (
          <div
            className="h-72 animate-pulse rounded-2xl border border-basic-00-10 bg-card-foreground"
            key={index}
          />
        ))}
      </div>

      <div aria-hidden="true" className={PAGINATION_CLASSNAME}>
        <div className="h-14" />
      </div>
    </>
  );
}
