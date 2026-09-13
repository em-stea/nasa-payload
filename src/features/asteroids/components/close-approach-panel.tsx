import type {AsteroidDetail} from "@/features/asteroids/types/asteroid";

import {DataPanel, InlineFact} from "@/features/asteroids/components/data-panel";
import {
  formatKilometers,
  formatLunar,
  formatVelocity,
} from "@/features/asteroids/utils/format-asteroid";
import {Target} from "@/shared/components/icons/other/target";
import {Text} from "@/shared/components/text/text";

/**
 * La aproximación de referencia del objeto.
 *
 * El rótulo cambia según de qué lado del calendario cae: NeoWs devuelve el
 * historial completo, así que un objeto sin pasadas por delante muestra la
 * última que ocurrió en vez de un panel vacío.
 */
export function CloseApproachPanel({asteroid}: {asteroid: AsteroidDetail}) {
  const approach = asteroid.approach;

  if (!approach) {
    return (
      <DataPanel
        icon={<Target className="size-5 text-foreground" />}
        title="Close approach"
        variant="raised"
      >
        <Text className="py-3 text-muted-foreground" variant="body.3">
          No approaches to Earth on record.
        </Text>
      </DataPanel>
    );
  }

  return (
    <DataPanel
      icon={<Target className="size-5 text-foreground" />}
      title={approach.upcoming ? "Next closest approach" : "Last recorded approach"}
      variant="raised"
    >
      <div className="flex items-baseline justify-between gap-4 border-b border-border py-3">
        <Text className="shrink-0 text-muted-foreground" variant="meta.1">
          Date
        </Text>
        <Text className="truncate text-right text-foreground" variant="body.3">
          <time dateTime={approach.date}>{approach.dateLabel}</time>
        </Text>
      </div>

      <InlineFact label="Relative velocity" value={formatVelocity(approach.velocityKmS)} />
      <InlineFact label="Miss distance (lunar)" value={formatLunar(approach.missLunar)} />
      <InlineFact label="Miss distance (km)" value={formatKilometers(approach.missKm)} />
    </DataPanel>
  );
}
