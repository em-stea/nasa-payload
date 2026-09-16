"use client";

import type {NaturalEvent} from "@/features/events/types/events";

import Image from "next/image";
import Link from "next/link";
import {useState} from "react";

import {CategoryIcon} from "@/features/events/components/category-icon";
import {type EventTone, TONE_BORDER, TONE_TEXT} from "@/features/events/constants/categories";
import {toMapPosition} from "@/features/events/utils/geo";
import {Text} from "@/shared/components/text/text";
import {textVariants} from "@/shared/styles/components/text";
import {cn} from "@/shared/utils/className-builder";

/**
 * Planisferio con un marcador por evento de la ventana.
 *
 * La textura es la misma que usa el globo de la home, en proyección
 * equirectangular: eso es justamente lo que permite ubicar cada evento con una
 * regla de tres sobre latitud y longitud (ver `toMapPosition`), sin traer una
 * librería de mapas ni un dataset de fronteras.
 *
 * Va en escala de grises y bajada de brillo para que quede el relieve apagado
 * del diseño y los marcadores sean lo único con color. En claro se invierte:
 * sin eso la textura —oscura de origen— se lava contra el fondo blanco y el
 * mapa desaparece.
 *
 * Cada marcador se identifica al pasarle el cursor o al tabular hasta él, con
 * la misma mecánica que el radar de asteroides: sale el nombre al lado del
 * punto y el panel de abajo a la izquierda pasa a leer ese evento. Antes el
 * mapa era un campo de puntos anónimos —había que entrar al detalle para saber
 * qué era cada uno—; ahora nombra lo que dibuja sin sacar al lector de la
 * pantalla, y sigue siendo navegación, no adorno.
 */

const EARTH_TEXTURE = "https://cdn.jsdelivr.net/npm/three-globe/example/img/earth-blue-marble.jpg";

/**
 * Hasta qué latitud se muestra.
 *
 * El mapa completo es 2:1 y a lo ancho de la pantalla queda altísimo, así que
 * se recortan los casquetes: la textura se agranda dentro de una caja más baja
 * y sobresale arriba y abajo. 72° deja afuera el hielo permanente pero entra
 * todo lo que EONET reporta, incluidos los témpanos del mar de Weddell.
 *
 * Los marcadores viven dentro de la misma caja agrandada, así que siguen
 * alineados con el mapa sin tener que corregirlos por el recorte.
 */
const LAT_LIMIT = 72;

/** Alto de la textura como porcentaje de la caja, y cuánto sobresale arriba. */
const INNER_HEIGHT = (180 / (2 * LAT_LIMIT)) * 100;
const INNER_TOP = -((90 - LAT_LIMIT) / 180) * INNER_HEIGHT;

/** Meridianos y paralelos cada 30°, como la grilla del diseño. */
function Graticule() {
  return (
    <svg
      aria-hidden="true"
      className="absolute inset-0 size-full text-muted-foreground/20"
      preserveAspectRatio="none"
      viewBox="0 0 360 180"
    >
      {[30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((x) => (
        <line key={x} stroke="currentColor" strokeWidth="0.3" x1={x} x2={x} y1="0" y2="180" />
      ))}
      {[30, 60, 90, 120, 150].map((y) => (
        <line key={y} stroke="currentColor" strokeWidth="0.3" x1="0" x2="360" y1={y} y2={y} />
      ))}
      {/* El ecuador, un punto más marcado que el resto. */}
      <line stroke="currentColor" strokeWidth="0.7" x1="0" x2="360" y1="90" y2="90" />
    </svg>
  );
}

const MARKER_TONE = {
  orange: "bg-orange-200",
  blue: "bg-foreground",
  neutral: "bg-primary-foreground",
} as const satisfies Record<EventTone, string>;

/**
 * Rótulo del marcador apuntado.
 *
 * Sale del lado que no se va contra el borde: en la mitad derecha del mapa,
 * hacia la izquierda. Va con `w-max` y tope, así que la caja se ajusta al
 * texto y un título largo se corta en vez de estirarse fuera del marco.
 */
function MarkerLabel({event, flip}: {event: NaturalEvent; flip: boolean}) {
  return (
    <span
      className={cn(
        "pointer-events-none absolute top-1/2 flex w-max max-w-56 -translate-y-1/2 items-center gap-2 rounded-lg border border-border bg-background/90 px-2 py-1.5 backdrop-blur-xs",
        flip ? "right-full mr-3" : "left-full ml-3",
      )}
      aria-hidden="true"
    >
      <CategoryIcon
        category={event.category}
        className={cn("size-3.5 shrink-0", TONE_TEXT[event.category.tone])}
      />

      <span className="flex min-w-0 flex-col">
        <Text className="truncate text-primary-foreground" variant="meta.2">
          {event.title}
        </Text>
        <Text className="truncate text-muted-foreground" variant="meta.1">
          {event.severity}
        </Text>
      </span>
    </span>
  );
}

type MarkerProps = {
  event: NaturalEvent;
  active: boolean;
  dimmed: boolean;
  onActivate: (id: string | null) => void;
};

function Marker({event, active, dimmed, onActivate}: MarkerProps) {
  const {left, top} = toMapPosition(event.position.lat, event.position.lng);
  const tone = MARKER_TONE[event.category.tone];

  return (
    <Link
      className={cn(
        "group absolute size-4 -translate-x-1/2 -translate-y-1/2 rounded-full transition-opacity duration-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-200",
        active && "z-20",
        dimmed && "opacity-35",
      )}
      aria-label={`${event.title} — ${event.coords}`}
      href={event.href}
      style={{left: `${left}%`, top: `${top}%`}}
      onBlur={() => onActivate(null)}
      onFocus={() => onActivate(event.id)}
      onPointerEnter={() => onActivate(event.id)}
      onPointerLeave={() => onActivate(null)}
    >
      <span className="sr-only">{event.title}</span>

      {/* Halo: marca la posición sin tapar el mapa. */}
      <span aria-hidden="true" className={cn("absolute inset-0 rounded-full opacity-25", tone)} />
      <span
        className={cn(
          "absolute inset-1 rounded-full transition-transform duration-200 group-hover:scale-150",
          active && "scale-150",
          tone,
        )}
        aria-hidden="true"
      />

      {/* Cerco de enganche, como el del radar: confirma cuál está apuntado
          cuando hay varios marcadores encimados. */}
      {active && (
        <span
          className={cn(
            "absolute -inset-1.5 rounded-full border",
            TONE_BORDER[event.category.tone],
          )}
          aria-hidden="true"
        />
      )}

      {active && <MarkerLabel event={event} flip={left > 50} />}
    </Link>
  );
}

/** Fila del panel de lectura, con el mismo formato que las cards del grid. */
function ReadoutRow({label, value, accent}: {label: string; value: string; accent?: string}) {
  const base = textVariants({variant: "meta.1"});

  return (
    <div className="flex items-baseline justify-between gap-3">
      <dt className={cn(base, "shrink-0 text-muted-foreground")}>{label}</dt>
      <dd className={cn(base, "truncate text-primary-foreground", accent)}>{value}</dd>
    </div>
  );
}

/**
 * La lectura del evento apuntado.
 *
 * Va en un lugar fijo del mapa: el rótulo del marcador se mueve con el cursor,
 * esto no. Sin nada apuntado lee el evento más reciente, que es el mismo que
 * firma el `UPDATED` del panel de telemetría: deja la lectura en pantalla —que
 * es la que explica para qué sirve pasar el cursor— en vez de un hueco.
 *
 * En mobile no se muestra: no hay hover que la active y el mapa es demasiado
 * bajo para dos paneles sin que se encimen.
 */
function EventReadout({event, locked}: {event: NaturalEvent; locked: boolean}) {
  const accent = TONE_TEXT[event.category.tone];

  return (
    <div className="absolute bottom-4 left-4 hidden w-fit max-w-64 sm:bottom-6 sm:left-6 sm:block">
      <div className="flex flex-col gap-1 rounded-lg border border-border bg-background/85 px-3 py-2 backdrop-blur-xs">
        <div className="flex items-center gap-1.5">
          <span
            aria-hidden="true"
            className={cn("size-1.5 shrink-0 rounded-full", MARKER_TONE[event.category.tone])}
          />
          <Text className="whitespace-nowrap text-muted-foreground" variant="meta.1">
            [{locked ? "event lock" : "latest fix"}]
          </Text>
        </div>

        <Text className="truncate text-primary-foreground" variant="meta.2">
          {event.title}
        </Text>

        <dl className="flex flex-col gap-0.5">
          <ReadoutRow label="Coord" value={event.coords} />
          <ReadoutRow accent={accent} label="Severity" value={event.severity} />
          <ReadoutRow label="T-Stamp" value={event.position.date} />
          <ReadoutRow
            accent={event.metric.accent ? accent : undefined}
            label={event.metric.label}
            value={event.metric.value}
          />
        </dl>
      </div>
    </div>
  );
}

/**
 * Caja de telemetría del diseño.
 *
 * Lo que muestra son datos del propio catálogo —cuántos eventos se están
 * siguiendo y cuándo se actualizó la traza más reciente— y no telemetría de un
 * satélite, que sería un número inventado sobre un mapa de datos reales.
 */
function TelemetryPanel({events, latest}: {events: NaturalEvent[]; latest?: NaturalEvent}) {
  return (
    <div className="absolute top-4 left-4 rounded-lg border border-border bg-background/80 px-4 py-3 backdrop-blur-xs sm:top-6 sm:left-6">
      <Text className="text-foreground" variant="body.4">
        Live_telemetry
      </Text>

      <dl className="mt-2 flex flex-col gap-1">
        <div className="flex items-baseline gap-2">
          <dt className="sr-only">Eventos monitoreados</dt>
          <dd className="leading-4.2 font-jetbrains-mono text-3 text-primary-foreground">
            TRACKED: {String(events.length).padStart(3, "0")}
          </dd>
        </div>

        {latest && (
          <div className="flex items-baseline gap-2">
            <dt className="sr-only">Última actualización</dt>
            <dd className="leading-4.2 font-jetbrains-mono text-3 text-muted-foreground">
              <time dateTime={latest.position.date}>UPDATED: {latest.position.date}</time>
            </dd>
          </div>
        )}
      </dl>
    </div>
  );
}

/** El evento con el punto más nuevo de todo el conjunto. */
function toLatest(events: NaturalEvent[]) {
  return events.reduce<NaturalEvent | undefined>(
    (latest, event) =>
      latest === undefined || Date.parse(event.position.date) > Date.parse(latest.position.date)
        ? event
        : latest,
    undefined,
  );
}

export function WorldMap({events}: {events: NaturalEvent[]}) {
  const [activeId, setActiveId] = useState<string | null>(null);

  const latest = toLatest(events);
  const locked = events.find((event) => event.id === activeId);
  const readout = locked ?? latest;

  return (
    // La textura se ve a través de su `opacity-*`, así que el fondo del panel
    // se mezcla con ella. En oscuro `bg-background` (casi negro) es lo que le
    // da relieve al relieve; en claro esa misma base es blanco puro y lava la
    // imagen entera, así que ahí hace falta `bg-muted`.
    <div className="relative aspect-5/2 w-full overflow-hidden border-b border-border bg-muted dark:bg-background">
      <div
        className="absolute inset-x-0"
        style={{height: `${INNER_HEIGHT}%`, top: `${INNER_TOP}%`}}
      >
        <Image
          fill
          priority
          alt=""
          className="object-fill opacity-25 contrast-125 grayscale invert dark:opacity-30 dark:brightness-75 dark:invert-0"
          sizes="100vw"
          src={EARTH_TEXTURE}
        />

        <Graticule />

        {events.map((event) => (
          <Marker
            active={event.id === activeId}
            dimmed={activeId !== null && event.id !== activeId}
            event={event}
            key={event.id}
            onActivate={setActiveId}
          />
        ))}
      </div>

      <TelemetryPanel events={events} latest={latest} />

      {/* La pista del hover no va en mobile: no hay hover, y contra el panel de
          telemetría de enfrente no queda ancho para las dos. */}
      <Text
        className="absolute top-6 right-6 hidden text-muted-foreground sm:block"
        variant="meta.1"
      >
        [pick an event]
      </Text>

      {readout && <EventReadout event={readout} locked={locked !== undefined} />}
    </div>
  );
}
