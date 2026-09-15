"use client";

import Link from "next/link";

import {
  buildMissionHref,
  buildMissionPhotoTransitionName,
} from "@/features/missions/utils/build-mission-href";
import {Card, type CardData} from "@/shared/components/card/card";
import {cn} from "@/shared/utils/className-builder";

type MissionCardProps = {
  data: CardData;
  /** `projectId` de TechPort: arma el link al detalle en `/missions/[id]`. */
  id: string;
  className?: string;
};

/** Card de Featured Missions: la card entera linkea a su detalle. */
export function MissionCard({data, id, className}: MissionCardProps) {
  return (
    <Link
      className="block h-full rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-200"
      href={buildMissionHref(id)}
    >
      <Card
        className={cn("h-full", className)}
        data={{...data, viewTransitionName: buildMissionPhotoTransitionName(id)}}
      >
        <Card.Header>
          <Card.Image />
          <Card.Badge />
        </Card.Header>
        <Card.Body className="pb-4">
          <Card.Title />
          <Card.Description />
        </Card.Body>
        <Card.Footer withSeparator variant="stats">
          {data.stats?.map((stat, index) => (
            <Card.Stat index={index} key={stat.label} size="sm" />
          ))}
        </Card.Footer>
      </Card>
    </Link>
  );
}
