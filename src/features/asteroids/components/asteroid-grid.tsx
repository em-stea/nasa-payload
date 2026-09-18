import type {Asteroid} from "@/features/asteroids/types/asteroid";

import {AsteroidCard} from "@/features/asteroids/components/asteroid-card";
import {TelemetrySection} from "@/features/asteroids/components/telemetry-section";
import {ASTEROIDS_PER_PAGE} from "@/features/asteroids/services/get-asteroid-feed";
import {formatInteger} from "@/features/asteroids/utils/format-asteroid";

const GRID_CLASSNAME = "grid w-full auto-rows-96 grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3";

export function AsteroidGrid({asteroids, total}: {asteroids: Asteroid[]; total: number}) {
  return (
    <TelemetrySection
      readout={`[${formatInteger(total)} objects catalogued]`}
      title="Discovery log"
    >
      <ul className={GRID_CLASSNAME}>
        {asteroids.map((asteroid) => (
          <li className="h-full" key={asteroid.id}>
            <AsteroidCard asteroid={asteroid} />
          </li>
        ))}
      </ul>
    </TelemetrySection>
  );
}

export function AsteroidGridSkeleton() {
  return (
    <div aria-hidden="true" className={GRID_CLASSNAME}>
      {Array.from({length: ASTEROIDS_PER_PAGE}, (_, index) => (
        <div
          className="h-full animate-pulse rounded-2xl border border-basic-00-10 bg-card-foreground"
          key={index}
        />
      ))}
    </div>
  );
}
