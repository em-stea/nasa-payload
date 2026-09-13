import type {ApodImage} from "@/features/apod/types/apod";

import {Heading} from "@/shared/components/heading/heading";
import {Text} from "@/shared/components/text/text";
import {toMissionTimestamp} from "@/shared/utils/mission-date";

/** Después de cuántos párrafos se intercala el log, igual que en `ArticleBody`. */
const SYSTEM_LOG_POSITION = 2;

/**
 * Bloque de telemetría del diseño, con los datos reales de la APOD del día.
 */
function SystemLog({apod}: {apod: ApodImage}) {
  const lines = [
    `> SYSTEM LOG // ENTRY ${apod.postId}`,
    `> CATEGORY: ${apod.mediaType.toUpperCase()}`,
    `> PUBLISHED: ${toMissionTimestamp(apod.date)}`,
    "> SOURCE: SCIENCE.NASA.GOV/WP-JSON",
  ];

  return (
    <div className="w-full border border-l-4 border-foreground bg-card px-5 py-4">
      {lines.map((line) => (
        <Text className="text-foreground" key={line} variant="meta.3">
          {line}
        </Text>
      ))}
    </div>
  );
}

/**
 * Cuerpo del detalle: la bajada oficial de la APOD, ya partida en párrafos de
 * texto plano por `parseApodPost`.
 */
export function ApodBody({apod}: {apod: ApodImage}) {
  return (
    <div className="flex w-full min-w-0 flex-col gap-6">
      <Heading
        as="h2"
        className="leading-9.6 w-full border-b border-border pb-2.25 font-semibold text-primary-foreground"
        variant="title.2"
      >
        Explanation
      </Heading>

      {apod.paragraphs.map((paragraph, index) => (
        <div className="contents" key={index}>
          <Text className="text-muted-foreground" variant="body.1">
            {paragraph}
          </Text>

          {index === SYSTEM_LOG_POSITION - 1 && <SystemLog apod={apod} />}
        </div>
      ))}

      {apod.paragraphs.length < SYSTEM_LOG_POSITION && <SystemLog apod={apod} />}
    </div>
  );
}
