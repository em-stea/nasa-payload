"use client";

import type {LatestFrontier} from "@/features/latest-frontiers/types/latest-frontier";

import Link from "next/link";

import {
  buildLatestFrontierHref,
  buildLatestFrontierPhotoTransitionName,
} from "@/features/latest-frontiers/utils/build-latest-frontier-href";
import {Card} from "@/shared/components/card/card";
import {cn} from "@/shared/utils/className-builder";

type LatestNewsCardProps = {
  data: LatestFrontier;
  className?: string;
};

/** Card del grid de latest frontiers: la card entera linkea a su detalle. */
export function LatestNewsCard({data, className}: LatestNewsCardProps) {
  return (
    <Link
      className="block h-full rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-200"
      href={buildLatestFrontierHref(data.id)}
    >
      <Card
        className={cn("h-full", className)}
        data={{...data, viewTransitionName: buildLatestFrontierPhotoTransitionName(data.id)}}
        variant="media"
      >
        <Card.Header>
          <Card.Image />
          <Card.Badge position="top-left" variant="dark" />
        </Card.Header>
        <Card.Body>
          <Card.Title />
          <Card.Description />
        </Card.Body>
        <Card.Footer>
          <Card.Date />
        </Card.Footer>
      </Card>
    </Link>
  );
}
