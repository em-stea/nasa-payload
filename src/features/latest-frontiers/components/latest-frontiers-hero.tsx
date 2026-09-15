import {Heading} from "@/shared/components/heading/heading";
import {Text} from "@/shared/components/text/text";

/** Encabezado de la sección: eyebrow de telemetría, titular y bajada. */
export function LatestFrontiersHero() {
  return (
    <header className="gap-1.8 flex w-full flex-col border-b border-border pt-20 pb-6">
      <Text className="flex flex-wrap items-baseline gap-2" variant="body.4">
        <span className="text-foreground">SYS.MSG</span>
        <span className="text-basic-500">FRONTIER_FEED_ONLINE</span>
      </Text>

      <Heading as="h1" variant="title.1-bold">
        Latest Frontiers
      </Heading>

      <Text className="max-w-2xl text-basic-500" variant="body.1">
        Curated telemetry, imagery, and updates from NASA&apos;s ongoing deep space operations,
        scientific discoveries, and orbital research missions.
      </Text>
    </header>
  );
}
