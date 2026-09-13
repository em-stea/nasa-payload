import type {AsteroidDetail} from "@/features/asteroids/types/asteroid";

import {DataPanel} from "@/features/asteroids/components/data-panel";
import {ChartLine} from "@/shared/components/icons/other/chart-line";
import {Text} from "@/shared/components/text/text";

/**
 * Los elementos de la órbita, en la grilla de tres columnas del diseño.
 *
 * Cada celda lleva su línea abajo —no la grilla entera— porque NeoWs puede no
 * publicar alguno de los seis y la fila tiene que seguir cerrando igual.
 */
export function OrbitalParameters({asteroid}: {asteroid: AsteroidDetail}) {
  if (asteroid.orbital.length === 0) return null;

  return (
    <DataPanel icon={<ChartLine className="size-5 text-foreground" />} title="Orbital parameters">
      <dl className="grid w-full grid-cols-1 gap-x-6 sm:grid-cols-2 lg:grid-cols-3">
        {asteroid.orbital.map((fact) => (
          <div
            className="flex min-w-0 flex-col gap-0.5 border-b border-border py-3"
            key={fact.label}
          >
            <dt>
              <Text className="text-muted-foreground" variant="meta.1">
                {fact.label}
              </Text>
            </dt>
            <dd>
              <Text className="truncate text-primary-foreground" variant="body.3">
                {fact.value}
              </Text>
            </dd>
          </div>
        ))}
      </dl>
    </DataPanel>
  );
}
