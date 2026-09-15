"use client";

import {CloseApproachCard} from "@/shared/components/card/close-approach-card";
import {CarouselImage} from "@/shared/components/carousel/carousel-image";

export const CelestialNearCarousel = ({neoFeed}: {neoFeed: any}) => {
  return (
    <CarouselImage
      renderItem={(neo: any) => (
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
