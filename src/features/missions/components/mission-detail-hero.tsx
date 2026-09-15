import type {MissionDetail} from "@/features/missions/types/mission";

import Image from "next/image";
import {ViewTransition} from "react";

import {buildMissionPhotoTransitionName} from "@/features/missions/utils/build-mission-href";
import {Badge} from "@/shared/components/badge/badge";
import {Heading} from "@/shared/components/heading/heading";
import {Text} from "@/shared/components/text/text";

type MissionDetailHeroProps = {
  mission: MissionDetail;
};

/**
 * Cabecera del detalle: la imagen a sangre con el titular apoyado sobre un
 * degradado, igual que el hero de latest frontiers.
 */
export function MissionDetailHero({mission}: MissionDetailHeroProps) {
  return (
    <header className="relative h-70 w-full overflow-hidden border border-border sm:h-96">
      {mission.image && (
        <ViewTransition name={buildMissionPhotoTransitionName(mission.id)}>
          <Image
            fill
            priority
            alt=""
            className="object-cover dark:opacity-80 dark:mix-blend-screen"
            sizes="100vw"
            src={mission.image}
          />
        </ViewTransition>
      )}

      <div className="absolute inset-x-0 bottom-0 flex flex-col gap-2 bg-gradient-to-t from-background to-transparent px-4 pt-4 pb-4">
        <Badge hasDot className="self-start" tone={mission.tone} variant="dark">
          {mission.status}
        </Badge>

        <Heading
          as="h1"
          className="lg:leading-13.2 text-7 leading-8.5 tracking-n0_96 text-primary-foreground sm:text-8 sm:leading-10 lg:text-12"
          variant="title.2"
        >
          {mission.title}
        </Heading>

        <div className="flex w-full flex-wrap items-center gap-x-4 gap-y-1">
          {mission.program && (
            <Text className="text-basic-500 uppercase" variant="meta.3">
              Program: {mission.program}
            </Text>
          )}

          {mission.leadOrganization && (
            <Text className="text-basic-500 uppercase" variant="meta.3">
              Lead: {mission.leadOrganization}
            </Text>
          )}

          {mission.startDate && (
            <Text className="text-basic-500 uppercase" variant="meta.3">
              Start: {mission.startDate}
            </Text>
          )}
        </div>
      </div>
    </header>
  );
}
