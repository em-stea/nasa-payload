import type {NaturalEventDetail} from "@/features/events/types/events";

import Link from "next/link";

import {TONE_TEXT} from "@/features/events/constants/categories";
import {distanceKm, hoursBetween} from "@/features/events/utils/geo";
import {resolveHeading} from "@/features/events/utils/parse-event";
import {Text} from "@/shared/components/text/text";
import {textVariants} from "@/shared/styles/components/text";
import {cn} from "@/shared/utils/className-builder";

/**
 * Panel de telemetría del diseño, con los números que se pueden derivar de la
 * traza de EONET: la magnitud tal como la reporta la fuente, y la velocidad,
 * el rumbo y la duración que salen de restar posiciones consecutivas.
 *
 * Lo que la API no publica se muestra como `—`. La tabla de abajo son las
 * últimas posiciones crudas: es el equivalente honesto al log de sensores del
 * diseño, que en el mockup estaba poblado con instrumentos inventados.
 */

/** Últimas posiciones que se listan en la tabla. */
const LOG_ROWS = 5;

type StatProps = {
  label: string;
  value: string;
  hint: string;
  accent?: string;
};

function Stat({label, value, hint, accent}: StatProps) {
  return (
    <div className="flex min-w-0 flex-col gap-1">
      <Text className="truncate text-basic-500" variant="meta.1">
        {label}
      </Text>

      <p
        className={cn(
          "font-space-grotesk text-8 leading-10 font-medium",
          accent ?? "text-primary-foreground",
        )}
      >
        {value}
      </p>

      <Text className="truncate text-basic-500" variant="meta.3">
        {hint}
      </Text>
    </div>
  );
}

export function EventTelemetry({event}: {event: NaturalEventDetail}) {
  const accent = TONE_TEXT[event.category.tone];
  const cell = textVariants({variant: "meta.3"});

  const last = event.track[event.track.length - 1];
  const previous = event.track[event.track.length - 2];

  const driftHours = previous ? hoursBetween(previous.date, last.date) : 0;
  const drift =
    previous && driftHours > 0
      ? `${(distanceKm(previous, last) / driftHours).toFixed(1)} KM/H`
      : "—";
  const heading = resolveHeading(event.track);
  const span = hoursBetween(event.track[0].date, last.date);

  const log = event.track.slice(-LOG_ROWS).reverse();

  return (
    <section
      aria-label="Telemetría del evento"
      className="w-full overflow-hidden rounded-lg border border-border bg-card"
    >
      <header className="border-b border-border px-4 py-2.5">
        <Text className="text-foreground" variant="body.4">
          Telemetry data [source: {event.sources[0]?.id ?? "EONET"}]
        </Text>
      </header>

      <div className="grid grid-cols-2 gap-6 p-4 lg:grid-cols-4">
        <Stat accent={accent} hint="As reported" label="Magnitude" value={event.severity} />
        <Stat hint={heading ? `Vector ${heading}` : "Stationary"} label="Drift" value={drift} />
        <Stat
          hint="Since first fix"
          label="Span"
          value={span > 0 ? `${Math.round(span)} H` : "—"}
        />
        <Stat
          hint="Track points"
          label="Fixes"
          value={String(event.track.length).padStart(2, "0")}
        />
      </div>

      <table className="w-full border-t border-border">
        <caption className="sr-only">Últimas posiciones registradas</caption>

        <thead>
          <tr className="bg-muted">
            <th className={cn(cell, "px-4 py-2 text-left text-basic-500 uppercase")} scope="col">
              T-Stamp
            </th>
            <th className={cn(cell, "px-4 py-2 text-left text-basic-500 uppercase")} scope="col">
              Coord
            </th>
            <th className={cn(cell, "px-4 py-2 text-right text-basic-500 uppercase")} scope="col">
              Mag
            </th>
          </tr>
        </thead>

        <tbody>
          {log.map((point, index) => (
            <tr className="border-t border-border" key={`${point.date}-${index}`}>
              <td className={cn(cell, "px-4 py-2.5 text-primary-foreground")}>
                <time dateTime={point.date}>{point.date}</time>
              </td>
              <td className={cn(cell, "px-4 py-2.5 text-basic-500")}>
                {Math.abs(point.lat).toFixed(2)}° {point.lat >= 0 ? "N" : "S"},{" "}
                {Math.abs(point.lng).toFixed(2)}° {point.lng >= 0 ? "E" : "W"}
              </td>
              <td className={cn(cell, "px-4 py-2.5 text-right", accent)}>
                {point.magnitude !== null && point.magnitudeUnit
                  ? `${point.magnitude} ${point.magnitudeUnit}`
                  : "—"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {event.sources.length > 0 && (
        <footer className="flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-border px-4 py-3">
          <Text className="text-basic-500 uppercase" variant="meta.3">
            Feeds
          </Text>

          {event.sources.map((source) => (
            <Link
              className={cn(
                cell,
                "text-foreground uppercase transition-colors duration-200 hover:text-highlight",
              )}
              href={source.url}
              key={source.id}
              rel="noreferrer"
              target="_blank"
            >
              {source.id}
            </Link>
          ))}
        </footer>
      )}
    </section>
  );
}
