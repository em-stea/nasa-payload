import { Heading } from '@/shared/components/heading/heading'
import { Text } from '@/shared/components/text/text'
import { textVariants } from '@/shared/styles/components/text'
import { cn } from '@/shared/utils/className-builder'

/** Chip de estado del hero. No es un control: no lleva foco ni click. */
function StatusChip({ children, active = false }: { children: string; active?: boolean }) {
  return (
    <span
      className={cn(
        textVariants({ variant: 'body.4' }),
        'inline-flex shrink-0 items-center rounded-lg border px-4.25 py-2.25 whitespace-nowrap',
        active
          ? 'border-blue-200 bg-blue-200 text-basic-970'
          : 'border-border bg-background text-primary-foreground',
      )}
    >
      {children}
    </span>
  )
}

/** Encabezado de la sección: eyebrow de telemetría, titular, bajada y estado. */
export function AsteroidHero() {
  return (
    <header className="flex w-full flex-col gap-1.8 border-b border-border pt-20 pb-6">
      <Text variant="body.4" className="flex flex-wrap items-baseline gap-2">
        <span className="text-foreground">[SYS_MODULE_01]</span>
        <span className="text-muted-foreground">Near-Earth Object Monitoring</span>
      </Text>

      <Heading as="h1" variant="title.1-bold">
        Asteroid Tracker
      </Heading>

      <Text variant="body.1" className="max-w-2xl text-muted-foreground">
        Real-time telemetry and orbital analysis of Near-Earth Objects (NEOs) utilizing global radar
        arrays and NASA JPL data feeds. System active. Monitoring potential impact trajectories and
        orbital intersections.
      </Text>

      <div className="mt-2 flex flex-wrap items-center gap-2">
        <StatusChip>Status: Optimal</StatusChip>
        <StatusChip active>Live Feed</StatusChip>
      </div>
    </header>
  )
}
