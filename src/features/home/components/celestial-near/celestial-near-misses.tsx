import {HeaderGroup} from "@/shared/components/header-group/header-group";

import {getNeoFeed} from "../../services/get-neo-feed";
import {getDate} from "../../utils/get-date";
import {CelestialNearCarousel} from "./celestial-near-carousel";

export async function CelestialNearMisses() {
  const neoFeed = await getNeoFeed({
    start_date: getDate().today,
    end_date: getDate().twoDaysAgo,
  });

  return (
    <div>
      <HeaderGroup
        description="Upcoming asteroid close approaches monitored by Near-Earth Object Observations."
        title="Celestial Near-Misses"
      />

      <CelestialNearCarousel neoFeed={neoFeed} />
    </div>
  );
}
