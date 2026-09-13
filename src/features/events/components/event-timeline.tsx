import type {EventPoint, NaturalEventDetail} from "@/features/events/types/events";

import {CategoryIcon} from "@/features/events/components/category-icon";
import {TONE_BORDER, TONE_TEXT} from "@/features/events/constants/categories";
import {bearingLabel, distanceKm, hoursBetween} from "@/features/events/utils/geo";
import {Heading} from "@/shared/components/heading/heading";
import {Text} from "@/shared/components/text/text";
import {cn} from "@/shared/utils/className-builder";

/**
 * "Mission log" del diseño, contado con la traza real del evento.
 *
 * Cada entrada es una posición que publicó EONET: el rótulo es cuánto antes de
 * la última medición se tomó, el titular es la magnitud de ese momento y la
 * bajada, cuánto y hacia dónde se movió respecto de la anterior. La línea de
 * tiempo del mockup era prosa inventada; ésta cuenta lo mismo con los números
 * que la API sí publica.
 */

/** Cuántas mediciones se listan; las trazas de ciclones traen cientos. */
const MAX_ENTRIES = 6;

/** `T-04:22:00`, la cuenta regresiva del diseño. */
function toOffsetLabel(point: EventPoint, last: EventPoint) {
  const hours = Math.max(hoursBetween(point.date, last.date), 0);
  const wholeHours = Math.floor(hours);
  const minutes = Math.round((hours - wholeHours) * 60);

  return `T-${String(wholeHours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:00`;
}

function toEntryTitle(point: EventPoint) {
  if (point.magnitude === null || !point.magnitudeUnit) return "Position fix";

  return `${point.magnitude} ${point.magnitudeUnit.toUpperCase()}`;
}

function toEntryDescription(point: EventPoint, previous: EventPoint | undefined) {
  const position = `${Math.abs(point.lat).toFixed(3)}° ${point.lat >= 0 ? "N" : "S"}, ${Math.abs(
    point.lng,
  ).toFixed(3)}° ${point.lng >= 0 ? "E" : "W"}`;

  if (!previous) return `First fix on record, at ${position}.`;

  const distance = distanceKm(previous, point);

  if (distance < 1) return `Held position at ${position}.`;

  return `Moved ${distance.toFixed(1)} km ${bearingLabel(previous, point)} since the previous fix, to ${position}.`;
}

export function EventTimeline({event}: {event: NaturalEventDetail}) {
  const last = event.track[event.track.length - 1];

  // Del más nuevo al más viejo, como se lee un log.
  const entries = event.track
    .slice(-MAX_ENTRIES)
    .map((point, index, list) => ({point, previous: list[index - 1]}))
    .reverse();

  const accent = TONE_TEXT[event.category.tone];

  return (
    <section
      aria-label="Evolución del evento"
      className="flex w-full flex-col overflow-hidden rounded-lg border border-border bg-card"
    >
      <header className="border-b border-border px-4 py-2.5">
        <Text className="text-foreground" variant="body.4">
          Mission log // Evolution timeline
        </Text>
      </header>

      <ol className="flex flex-col gap-6 p-4">
        {entries.map(({point, previous}, index) => {
          const isCurrent = index === 0;

          return (
            <li className="flex gap-3" key={`${point.date}-${index}`}>
              <div className="flex flex-col items-center gap-2">
                <span
                  className={cn(
                    "flex size-8 shrink-0 items-center justify-center rounded-full border",
                    isCurrent ? cn(TONE_BORDER[event.category.tone], accent) : "border-border",
                  )}
                  aria-hidden="true"
                >
                  {isCurrent ? (
                    <CategoryIcon category={event.category} className="size-4" />
                  ) : (
                    <span className="size-1.5 rounded-full bg-basic-500" />
                  )}
                </span>

                {/* Riel que une una entrada con la siguiente. */}
                {index < entries.length - 1 && (
                  <span aria-hidden="true" className="w-px flex-1 bg-border" />
                )}
              </div>

              <div className="flex min-w-0 flex-col gap-1 pb-2">
                <Text className="text-basic-500 uppercase" variant="meta.3">
                  <time dateTime={point.date}>{toOffsetLabel(point, last)}</time>
                  {isCurrent && (
                    // eslint-disable-next-line react/jsx-curly-brace-presence -- sin llaves, `// Current` se lee como un comentario JSX.
                    <span className={cn("ms-2", accent)}>{"// Current"}</span>
                  )}
                </Text>

                <Heading as="h3" className="text-primary-foreground" variant="title.3">
                  {toEntryTitle(point)}
                </Heading>

                <Text className="text-muted-foreground" variant="body.3">
                  {toEntryDescription(point, previous)}
                </Text>
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
