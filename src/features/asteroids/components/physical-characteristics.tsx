import type {AsteroidDetail} from "@/features/asteroids/types/asteroid";

import {DataPanel, StackedFact} from "@/features/asteroids/components/data-panel";
import {
  formatDiameterRange,
  formatInteger,
  formatMagnitude,
  formatSize,
} from "@/features/asteroids/utils/format-asteroid";
import {SCALE_MAX_METERS, SCALE_MIN_METERS, toLogRatio} from "@/features/asteroids/utils/scale";
import {Cube} from "@/shared/components/icons/other/cube";
import {Text} from "@/shared/components/text/text";

/**
 * Tamaño y brillo del objeto.
 *
 * El albedo y el período de rotación que pide el diseño no están en NeoWs
 * —salen de campañas de observación puntuales, objeto por objeto—, así que el
 * panel muestra lo que sí publica: el rango de diámetro estimado, la magnitud
 * absoluta de la que ese rango se deriva, y la clase orbital.
 *
 * La barra usa el mismo eje logarítmico que el comparador de escala del
 * listado, para que las dos pantallas se lean con la misma vara.
 */
export function PhysicalCharacteristics({asteroid}: {asteroid: AsteroidDetail}) {
  const fill = toLogRatio(asteroid.diameterMaxM) * 100;

  return (
    <DataPanel
      icon={<Cube className="size-5 text-muted-foreground" />}
      title="Physical characteristics"
    >
      <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="flex min-w-0 flex-col gap-2 py-3 sm:border-r sm:border-border sm:pr-6">
          <Text className="text-muted-foreground" variant="meta.1">
            Est. diameter (min–max)
          </Text>

          <Text className="text-primary-foreground" variant="body.1">
            {formatDiameterRange(asteroid.diameterMinM, asteroid.diameterMaxM)}
          </Text>

          <div
            aria-label={`Diameter on a logarithmic scale from ${formatSize(SCALE_MIN_METERS)} to ${formatSize(SCALE_MAX_METERS)}`}
            className="h-1.5 w-full overflow-hidden rounded-full bg-basic-00-10"
            role="img"
          >
            <div className="h-full rounded-full bg-blue-700" style={{width: `${fill}%`}} />
          </div>

          <Text className="text-muted-foreground" variant="meta.1">
            Log scale · {formatSize(SCALE_MIN_METERS)} – {formatSize(SCALE_MAX_METERS)}
          </Text>
        </div>

        <div className="flex min-w-0 flex-col">
          <StackedFact label="Absolute magnitude">
            <Text className="text-primary-foreground" variant="body.3">
              {formatMagnitude(asteroid.magnitude)}
            </Text>
          </StackedFact>

          <StackedFact label="Orbit class">
            <Text className="text-primary-foreground" variant="body.3">
              {asteroid.orbitClass ?? "Not published"}
            </Text>
          </StackedFact>

          <StackedFact label="Observations used">
            <Text className="text-primary-foreground" variant="body.3">
              {asteroid.observations.used !== null
                ? formatInteger(asteroid.observations.used)
                : "Not published"}
            </Text>
          </StackedFact>
        </div>
      </div>
    </DataPanel>
  );
}
