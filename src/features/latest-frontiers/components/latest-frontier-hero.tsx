import type {LatestFrontierDetail} from "@/features/latest-frontiers/types/latest-frontier";

import Image from "next/image";
import {ViewTransition} from "react";

import {buildLatestFrontierPhotoTransitionName} from "@/features/latest-frontiers/utils/build-latest-frontier-href";
import {Badge} from "@/shared/components/badge/badge";
import {Heading} from "@/shared/components/heading/heading";
import {Text} from "@/shared/components/text/text";
import {toMissionTimestamp} from "@/shared/utils/mission-date";

type LatestFrontierHeroProps = {
  frontier: LatestFrontierDetail;
};

/**
 * Cabecera del detalle: la imagen a sangre con el titular apoyado sobre un
 * degradado, igual que el hero de una noticia.
 */
export function LatestFrontierHero({frontier}: LatestFrontierHeroProps) {
  return (
    <header className="relative h-70 w-full overflow-hidden border border-border sm:h-96">
      {frontier.image && (
        <ViewTransition name={buildLatestFrontierPhotoTransitionName(frontier.id)}>
          <Image
            fill
            priority
            alt=""
            className="object-cover dark:opacity-80 dark:mix-blend-screen"
            sizes="100vw"
            src={frontier.image}
          />
        </ViewTransition>
      )}

      <div className="absolute inset-x-0 bottom-0 flex flex-col gap-2 bg-gradient-to-t from-background to-transparent px-4 pt-4 pb-4">
        <Badge hasDot className="self-start" tone={frontier.tone} variant="dark">
          {frontier.tag}
        </Badge>

        <Heading
          as="h1"
          className="lg:leading-13.2 text-7 leading-8.5 tracking-n0_96 text-primary-foreground sm:text-8 sm:leading-10 lg:text-12"
          variant="title.2"
        >
          {frontier.title}
        </Heading>

        <div className="flex w-full flex-wrap items-center gap-x-4 gap-y-1">
          <Text className="text-basic-500 uppercase" variant="meta.3">
            <time dateTime={frontier.dateTime}>Date: {toMissionTimestamp(frontier.dateTime)}</time>
          </Text>

          {frontier.center && (
            <Text className="text-basic-500 uppercase" variant="meta.3">
              Center: {frontier.center}
            </Text>
          )}

          {frontier.photographer && (
            <Text className="text-basic-500 uppercase" variant="meta.3">
              Credit: {frontier.photographer}
            </Text>
          )}
        </div>
      </div>
    </header>
  );
}
