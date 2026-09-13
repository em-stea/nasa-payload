import type {NaturalEventDetail} from "@/features/events/types/events";

import Image from "next/image";

import {TONE_TEXT} from "@/features/events/constants/categories";
import {toMapPosition} from "@/features/events/utils/geo";
import {Text} from "@/shared/components/text/text";
import {cn} from "@/shared/utils/className-builder";

/**
 * El mapa del detalle: la misma textura equirectangular del hero, pero
 * encuadrada sobre el evento y con su traza dibujada encima.
 *
 * El encuadre se hace agrandando la imagen dentro de una caja con `overflow`
 * y corriéndola hasta dejar el centro del recorrido en el medio. Como los
 * marcadores y la línea se posicionan con la misma regla equirectangular que
 * la textura (`toMapPosition`), quedan alineados con el mapa a cualquier zoom
 * sin tener que sincronizar dos sistemas de coordenadas.
 */

const EARTH_TEXTURE = "https://cdn.jsdelivr.net/npm/three-globe/example/img/earth-blue-marble.jpg";

/** Relación de aspecto de la caja; fija el ancho/alto del encuadre. */
const ASPECT = 16 / 9;

/**
 * Grados de longitud mínimos a mostrar.
 *
 * Los eventos de un solo punto —casi todos los incendios— no tienen extensión
 * que encuadrar. Abrir el plano a dos docenas de grados deja ver la región
 * alrededor: la textura no tiene resolución para acercarse más que eso sin
 * quedar en una mancha.
 */
const MIN_SPAN_DEGREES = 24;

function buildViewport(event: NaturalEventDetail) {
  const lats = event.track.map(({lat}) => lat);
  const lngs = event.track.map(({lng}) => lng);

  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);
  const minLng = Math.min(...lngs);
  const maxLng = Math.max(...lngs);

  // Un 40% de aire alrededor para que la traza no toque los bordes.
  const span = Math.min(
    360,
    Math.max((maxLng - minLng) * 1.4, (maxLat - minLat) * 1.4 * ASPECT, MIN_SPAN_DEGREES),
  );

  const center = toMapPosition((minLat + maxLat) / 2, (minLng + maxLng) / 2);

  // Ancho de la textura como porcentaje de la caja; el alto sale de mantener
  // la proporción 2:1 de la proyección dentro de una caja 16:9.
  const width = 36000 / span;
  const height = (width * ASPECT) / 2;

  return {
    width,
    height,
    left: 50 - (center.left * width) / 100,
    top: 50 - (center.top * height) / 100,
  };
}

/** La traza, del punto más viejo al más nuevo. */
function TrackLine({event}: {event: NaturalEventDetail}) {
  if (event.track.length < 2) return null;

  const points = event.track.map(({lat, lng}) => `${lng + 180},${90 - lat}`).join(" ");

  return (
    <svg
      aria-hidden="true"
      className={cn("absolute inset-0 size-full", TONE_TEXT[event.category.tone])}
      preserveAspectRatio="none"
      viewBox="0 0 360 180"
    >
      <polyline
        fill="none"
        opacity="0.8"
        points={points}
        stroke="currentColor"
        strokeDasharray="4 3"
        strokeLinejoin="round"
        strokeWidth="1.5"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

export function EventTrackMap({event}: {event: NaturalEventDetail}) {
  const viewport = buildViewport(event);
  const tone = TONE_TEXT[event.category.tone];

  return (
    <section
      aria-label="Recorrido del evento"
      className="w-full overflow-hidden rounded-lg border border-border bg-card"
    >
      <header className="flex flex-wrap items-center justify-between gap-2 border-b border-border px-4 py-2.5">
        <Text className="text-foreground" variant="body.4">
          Sat_view: track_overlay
        </Text>

        <Text className="text-basic-500 uppercase" variant="meta.3">
          {event.track.length} {event.track.length === 1 ? "fix" : "fixes"}
          {" // "}
          {event.category.label}
        </Text>
      </header>

      <div className="relative aspect-16/9 w-full overflow-hidden bg-background">
        <div
          style={{
            width: `${viewport.width}%`,
            height: `${viewport.height}%`,
            left: `${viewport.left}%`,
            top: `${viewport.top}%`,
          }}
          className="absolute"
        >
          <Image
            fill
            alt=""
            className="object-fill opacity-30 contrast-125 grayscale invert dark:opacity-55 dark:brightness-90 dark:invert-0"
            sizes="100vw"
            src={EARTH_TEXTURE}
          />

          <TrackLine event={event} />

          {event.track.map((point, index) => {
            const {left, top} = toMapPosition(point.lat, point.lng);
            const isLast = index === event.track.length - 1;

            return (
              <span
                className={cn(
                  "absolute -translate-x-1/2 -translate-y-1/2 rounded-full",
                  isLast ? cn("size-3 ring-2 ring-current/30", tone) : "size-1.5",
                  isLast ? "bg-current" : "bg-basic-300/70",
                )}
                aria-hidden="true"
                key={`${point.date}-${index}`}
                style={{left: `${left}%`, top: `${top}%`}}
              />
            );
          })}
        </div>

        <div className="absolute bottom-3 left-3 flex flex-col gap-1">
          <Text
            className="w-fit rounded-lg border border-border bg-background/80 px-2 py-1 text-primary-foreground backdrop-blur-xs"
            variant="meta.3"
          >
            LAT: {Math.abs(event.position.lat).toFixed(4)}° {event.position.lat >= 0 ? "N" : "S"}
          </Text>

          <Text
            className="w-fit rounded-lg border border-border bg-background/80 px-2 py-1 text-primary-foreground backdrop-blur-xs"
            variant="meta.3"
          >
            LNG: {Math.abs(event.position.lng).toFixed(4)}° {event.position.lng >= 0 ? "E" : "W"}
          </Text>
        </div>
      </div>
    </section>
  );
}
