"use client";

import {CloseApproachCard} from "@/shared/components/card/close-approach-card";
import {CarouselImage} from "@/shared/components/carousel/carousel-image";
import {HeaderGroup} from "@/shared/components/header-group/header-group";

import {getNeoFeed} from "../../services/get-neo-feed";
import {getDate} from "../../utils/get-date";

export async function CelestialNearMisses() {
  // const neoFeed = await getNeoFeed({
  //   start_date: getDate().today,
  //   end_date: getDate().twoDaysAgo,
  // });

  // console.log(neoFeed);

  return (
    <div>
      <HeaderGroup
        description="Upcoming asteroid close approaches monitored by Near-Earth Object Observations."
        title="Celestial Near-Misses"
      />

      {/* <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {neoFeed.map((neo: any) => (
          <CloseApproachCard key={neo.id} 
          data={
            {
              title: neo.title,
              tag: neo.tag,
              tone: neo.tone,
              stats: [
                { label: "Approach date", value: neo.date },
                { label: "Miss Distance", value: neo.miss_distance, highlight: true },
                { label: "Velocity", value: neo.velocity, },
              ],
            }
          } />
        
        ))}

      </div> */}

      <CarouselImage
        // items={neoFeed}
        items={[
          {
            id: 1,
            title: "Test",
            date: "2026-09-13",
            miss_distance: "100000 km",
            velocity: "100000 km/s",
          },
          {
            id: 2,
            title: "Test 2",
            date: "2026-09-13",
            miss_distance: "100000 km",
            velocity: "100000 km/s",
          },
          {
            id: 3,
            title: "Test 3",
            date: "2026-09-13",
            miss_distance: "100000 km",
            velocity: "100000 km/s",
          },
          {
            id: 4,
            title: "Test 4",
            date: "2026-09-13",
            miss_distance: "100000 km",
            velocity: "100000 km/s",
          },
          {
            id: 5,
            title: "Test 5",
            date: "2026-09-13",
            miss_distance: "100000 km",
            velocity: "100000 km/s",
          },
        ]}
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
          />
        )}
        variant="grid"
      />
    </div>
  );
}
