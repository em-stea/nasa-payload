import { Heading } from '@/shared/components/heading/heading'
import { Text } from '@/shared/components/text/text'

/** Encabezado de la sección: eyebrow de telemetría, titular y bajada. */
export function NewsHero() {
  return (
    <header className="flex w-full flex-col gap-1.8 border-b border-border pt-20 pb-6">
      <Text variant="body.4" className="flex flex-wrap items-baseline gap-2">
        <span className="text-foreground">SYS.MSG</span>
        <span className="text-basic-500">ARCHIVE_ACCESS_GRANTED</span>
      </Text>

      <Heading as="h1" variant="title.1-bold">
        NASA News
      </Heading>

      <Text variant="body.1" className="max-w-2xl text-basic-500">
        The latest updates from deep space missions, planetary defense, and scientific breakthroughs
        across the cosmos.
      </Text>
    </header>
  )
}
