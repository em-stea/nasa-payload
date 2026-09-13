import type {EventStatus} from "@/features/events/types/events";

import {Text} from "@/shared/components/text/text";
import {cn} from "@/shared/utils/className-builder";

/**
 * Pastilla de alerta del diseño: un punto y el nivel en mayúsculas.
 *
 * El nivel no viene de EONET —ver `resolveStatus`—, así que el `title` explica
 * de dónde sale en vez de dejarlo como un dato sin origen.
 */
const STATUS = {
  critical: {
    label: "Critical",
    hint: "Magnitud de ciclón mayor, o traza actualizada en las últimas 24 horas",
    className: "border-red-200-30 bg-red-700-20 text-red-200",
    dot: "bg-red-200",
  },
  elevated: {
    label: "Elevated",
    hint: "Magnitud de tormenta tropical, o traza actualizada en los últimos 3 días",
    className: "border-blue-200-30 bg-blue-700-20 text-foreground",
    dot: "bg-foreground",
  },
  monitoring: {
    label: "Monitoring",
    hint: "Evento cerrado o sin actualizaciones recientes",
    className: "border-border bg-card text-basic-500",
    dot: "bg-basic-500",
  },
} as const satisfies Record<EventStatus, unknown>;

export function EventStatusBadge({status, className}: {status: EventStatus; className?: string}) {
  const {label, hint, className: tone, dot} = STATUS[status];

  return (
    <span
      className={cn(
        "inline-flex w-fit shrink-0 items-center gap-1.5 rounded-lg border px-2.25 py-1.25",
        tone,
        className,
      )}
      title={hint}
    >
      <span aria-hidden="true" className={cn("size-1.5 shrink-0 rounded-full", dot)} />
      <Text className="font-bold" variant="meta.1">
        {label}
      </Text>
    </span>
  );
}
