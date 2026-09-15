import type {MissionDetail} from "@/features/missions/types/mission";

import {Heading} from "@/shared/components/heading/heading";
import {Text} from "@/shared/components/text/text";

type MissionOverviewProps = {
  mission: MissionDetail;
};

/** Descripción del proyecto y, cuando TechPort la publica, su aplicación práctica. */
export function MissionOverview({mission}: MissionOverviewProps) {
  return (
    <div className="flex w-full min-w-0 flex-col gap-6">
      {mission.description && (
        <Text className="text-muted-foreground" variant="body.1">
          {mission.description}
        </Text>
      )}

      {mission.benefits && (
        <div className="flex flex-col gap-2">
          <Heading as="h2" className="text-foreground uppercase" variant="title.4">
            Benefits
          </Heading>
          <Text className="text-muted-foreground" variant="body.1">
            {mission.benefits}
          </Text>
        </div>
      )}
    </div>
  );
}
