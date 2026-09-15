"use client";

import type {CloseApproachPreview} from "@/features/home/types/neo-feed";

import {CloseApproachCard} from "@/shared/components/card/close-approach-card";
import {CarouselImage} from "@/shared/components/carousel/carousel-image";

type CelestialNearCarouselProps = {
  neoFeed: CloseApproachPreview[];
};

export const CelestialNearCarousel = ({neoFeed}: CelestialNearCarouselProps) => {
  return (
    <CarouselImage
      renderItem={(neo) => (
        <CloseApproachCard
          data={{
            title: neo.title,
            tag: neo.tag,
            tone: neo.tone,
            stats: [
              {label: "Approach date", value: neo.date},
              {label: "Miss Distance", value: neo.miss_distance, highlight: true},
              {label: "Velocity", value: neo.velocity},
            ],
          }}
          key={neo.id}
          tagVariant={neo.tagVariant}
        />
      )}
      items={neoFeed}
      variant="grid"
    />
  );
};
