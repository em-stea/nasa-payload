import type {Asteroid} from "@/features/asteroids/types/asteroid";

import {TelemetrySection} from "@/features/asteroids/components/telemetry-section";
import {formatSize} from "@/features/asteroids/utils/format-asteroid";
import {SCALE_TICKS, toLogRatio} from "@/features/asteroids/utils/scale";
import {Text} from "@/shared/components/text/text";
import {cn} from "@/shared/utils/className-builder";

/**
 * Comparador de tamaños.
 *
 * Pone los dos objetos más grandes de la página contra dos referencias que
 * cualquiera tiene medidas: un colectivo y la Torre Eiffel. El diámetro que
 * publica NeoWs es un rango estimado a partir de la magnitud absoluta, así que
 * la barra se dibuja con el máximo y el rango completo va en el rótulo.
 *
 * El eje es logarítmico y lo dice en el encabezado: con uno lineal, la primera
 * página del catálogo —donde viven los asteroides numerados, de 2 a 87 km—
 * aplasta las dos referencias contra el cero.
 */

/** Referencias fijas, en metros. */
const REFERENCES = [
  {name: "City bus", note: "Ref", meters: 12},
  {name: "Eiffel tower", note: "Ref", meters: 330},
] as const;

/** Alto del área de barras; el eje y las guías comparten esta medida. */
const CHART_HEIGHT = "h-56 sm:h-64";

type Bar = {
  key: string;
  name: string;
  note: string;
  meters: number;
  label: string;
  neo: boolean;
  hazardous: boolean;
};

export function ScaleComparator({asteroids}: {asteroids: Asteroid[]}) {
  const largest = [...asteroids]
    .filter((asteroid) => asteroid.diameterMaxM > 0)
    .sort((a, b) => b.diameterMaxM - a.diameterMaxM)
    .slice(0, 2);

  const bars: Bar[] = [
    ...REFERENCES.map((reference) => ({
      key: reference.name,
      name: reference.name,
      note: reference.note,
      meters: reference.meters,
      label: formatSize(reference.meters),
      neo: false,
      hazardous: false,
    })),
    ...largest.map((asteroid) => ({
      key: asteroid.id,
      name: asteroid.name,
      note: "NEO",
      meters: asteroid.diameterMaxM,
      label: `${formatSize(asteroid.diameterMinM)} – ${formatSize(asteroid.diameterMaxM)}`,
      neo: true,
      hazardous: asteroid.hazardous,
    })),
  ];

  return (
    <TelemetrySection readout="[ref_metric: log meters]" title="Scale comparator">
      <div className="w-full rounded-2xl border border-border bg-muted p-4 sm:p-6">
        <div className="flex w-full items-start gap-3">
          {/* Las marcas se posicionan por su valor, no por su índice: en un eje
              log la década no cae donde caería en uno lineal. */}
          <div aria-hidden="true" className={cn("relative w-12 shrink-0", CHART_HEIGHT)}>
            {SCALE_TICKS.map((tick) => (
              <Text
                className="absolute right-0 -translate-y-1/2 text-muted-foreground"
                key={tick}
                style={{top: `${(1 - toLogRatio(tick)) * 100}%`}}
                variant="meta.1"
              >
                {formatSize(tick)}
              </Text>
            ))}
          </div>

          <div className="min-w-0 flex-1">
            <div className={cn("relative w-full", CHART_HEIGHT)}>
              <div aria-hidden="true" className="absolute inset-0">
                {SCALE_TICKS.map((tick) => (
                  <span
                    className="absolute inset-x-0 h-px bg-border"
                    key={tick}
                    style={{top: `${(1 - toLogRatio(tick)) * 100}%`}}
                  />
                ))}
              </div>

              <div className="relative flex size-full items-end gap-2">
                {bars.map((bar) => (
                  <div
                    className="flex h-full min-w-0 flex-1 items-end justify-center"
                    key={bar.key}
                  >
                    <div
                      className={cn(
                        "w-full max-w-24 rounded-t-sm border",
                        bar.hazardous
                          ? "border-destructive bg-red-700-20"
                          : bar.neo
                            ? "border-foreground bg-blue-700-20"
                            : "border-basic-500 bg-basic-500/15",
                      )}
                      style={{height: `${toLogRatio(bar.meters) * 100}%`}}
                      title={`${bar.name}: ${bar.label}`}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Misma estructura de columnas que las barras, para que cada
                rótulo caiga debajo de la suya. Los nombres envuelven en vez de
                recortarse: en mobile, cuatro columnas de 80px dejarían
                `EIFFEL …` y `[NEO] 3…`, que no dicen nada. */}
            <dl className="flex w-full gap-2 border-t border-border pt-2">
              {bars.map((bar) => (
                <div className="flex min-w-0 flex-1 flex-col items-center gap-0.5" key={bar.key}>
                  <dt className="w-full min-w-0">
                    <Text
                      className="text-center break-words text-primary-foreground"
                      variant="meta.1"
                    >
                      {bar.name}
                    </Text>
                  </dt>
                  <dd className="w-full min-w-0">
                    <Text
                      className={cn(
                        "text-center break-words",
                        bar.neo ? "text-foreground" : "text-muted-foreground",
                      )}
                      variant="meta.1"
                    >
                      [{bar.note}] {bar.label}
                    </Text>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </TelemetrySection>
  );
}
