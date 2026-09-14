import type {EventStatus} from "@/features/events/types/events";

import {Badge} from "@/shared/components/badge/badge";
import {badgeVariants} from "@/shared/styles/components/badge";

/**
 * Pastilla de alerta del diseño: un punto y el nivel en mayúsculas.
 *
 * Los tres niveles son las tres `full-filled` del frame 321-85, así que salen
 * de las variantes del Badge en vez de repetir la tabla de colores acá. El
 * punto toma el color del texto solo.
 *
 * El nivel no viene de EONET —ver `resolveStatus`—, así que el `title` explica
 * de dónde sale en vez de dejarlo como un dato sin origen.
 */
const STATUS = {
  critical: {
    label: "Critical",
    hint: "Magnitud de ciclón mayor, o traza actualizada en las últimas 24 horas",
    variant: "alert",
  },
  elevated: {
    label: "Elevated",
    hint: "Magnitud de tormenta tropical, o traza actualizada en los últimos 3 días",
    variant: "default",
  },
  monitoring: {
    label: "Monitoring",
    hint: "Evento cerrado o sin actualizaciones recientes",
    variant: "neutral",
  },
} as const satisfies Record<
  EventStatus,
  {
    label: string;
    hint: string;
    variant: NonNullable<Parameters<typeof badgeVariants>[0]>["variant"];
  }
>;

export function EventStatusBadge({status, className}: {status: EventStatus; className?: string}) {
  const {label, hint, variant} = STATUS[status];

  return (
    <Badge hasDot className={className} title={hint} variant={variant}>
      {label}
    </Badge>
  );
}
