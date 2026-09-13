import {HeaderGroup} from "@/shared/components/header-group/header-group";

import {getLatestFrontiers} from "../../services/get-latest-frontiers";
import {LatestFrontiersList} from "./latest-frontiers-list";

export default async function LatestFrontiers() {
  const latestFrontiers = await getLatestFrontiers({pageSize: 3});

  return (
    <div className="py-20">
      <HeaderGroup
        description="Curated telemetry, imagery, and updates from NASA's ongoing deep space operations, scientific discoveries, and orbital research missions."
        link={{text: "view all archives", href: "/"}}
        title="Latest Frontiers"
      />
      <LatestFrontiersList latestFrontiers={latestFrontiers} />
    </div>
  );
}
