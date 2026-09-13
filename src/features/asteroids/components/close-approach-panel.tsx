import { DataPanel, InlineFact } from '@/features/asteroids/components/data-panel'
import type { AsteroidDetail } from '@/features/asteroids/types/asteroid'
import {
  formatKilometers,
  formatLunar,
  formatVelocity,
} from '@/features/asteroids/utils/format-asteroid'
import { Target } from '@/shared/components/icons/other/target'
import { Text } from '@/shared/components/text/text'

/**
 * La aproximación de referencia del objeto.
 *
 * El rótulo cambia según de qué lado del calendario cae: NeoWs devuelve el
 * historial completo, así que un objeto sin pasadas por delante muestra la
 * última que ocurrió en vez de un panel vacío.
 */
export function CloseApproachPanel({ asteroid }: { asteroid: AsteroidDetail }) {
  const approach = asteroid.approach

  if (!approach) {
    return (
      <DataPanel
        title="Close approach"
        variant="raised"
        icon={<Target className="size-5 text-foreground" />}
      >
        <Text variant="body.3" className="py-3 text-muted-foreground">
          No approaches to Earth on record.
        </Text>
      </DataPanel>
    )
  }

  return (
    <DataPanel
      title={approach.upcoming ? 'Next closest approach' : 'Last recorded approach'}
      variant="raised"
      icon={<Target className="size-5 text-foreground" />}
    >
      <div className="flex items-baseline justify-between gap-4 border-b border-border py-3">
        <Text variant="meta.1" className="shrink-0 text-muted-foreground">
          Date
        </Text>
        <Text variant="body.3" className="truncate text-right text-foreground">
          <time dateTime={approach.date}>{approach.dateLabel}</time>
        </Text>
      </div>

      <InlineFact label="Relative velocity" value={formatVelocity(approach.velocityKmS)} />
      <InlineFact label="Miss distance (lunar)" value={formatLunar(approach.missLunar)} />
      <InlineFact label="Miss distance (km)" value={formatKilometers(approach.missKm)} />
    </DataPanel>
  )
}
