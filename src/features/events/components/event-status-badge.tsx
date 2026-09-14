import type {EventStatus} from "@/features/events/types/events";
import type {BadgeTone} from "@/shared/styles/components/badge";

import {Badge} from "@/shared/components/badge/badge";

/**
 * Pastilla de alerta del diseño: un punto y el nivel en mayúsculas.
 *
 * Los tres niveles son la misma pastilla `full-filled` con distinto tono, así
 * que acá sólo vive el mapa nivel → tono. El punto toma el color del texto solo.
 *
 * El nivel no viene de EONET —ver `resolveStatus`—, así que el `title` explica
 * de dónde sale en vez de dejarlo como un dato sin origen.
 */
const STATUS = {
  critical: {
    label: "Critical",
    hint: "Magnitud de ciclón mayor, o traza actualizada en las últimas 24 horas",
    tone: "red",
  },
  elevated: {
    label: "Elevated",
    hint: "Magnitud de tormenta tropical, o traza actualizada en los últimos 3 días",
    tone: "blue",
  },
  monitoring: {
    label: "Monitoring",
    hint: "Evento cerrado o sin actualizaciones recientes",
    tone: "neutral",
  },
} as const satisfies Record<EventStatus, {label: string; hint: string; tone: BadgeTone}>;

export function EventStatusBadge({status, className}: {status: EventStatus; className?: string}) {
  const {label, hint, tone} = STATUS[status];

  return (
    <Badge hasDot className={className} title={hint} tone={tone} variant="full-filled">
      {label}
    </Badge>
  );
}
