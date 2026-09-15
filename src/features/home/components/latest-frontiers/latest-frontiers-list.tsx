import type {LatestFrontier} from "@/features/latest-frontiers/types/latest-frontier";

import {assignFrontierTone} from "@/features/latest-frontiers/utils/tone";
import {LatestNewsCard} from "@/shared/components/card/latest-news-card";

interface LatestFrontiersListProps {
  latestFrontiers: LatestFrontier[];
}

export const LatestFrontiersList = ({latestFrontiers}: LatestFrontiersListProps) => {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {latestFrontiers.map((frontier, index) => (
        <LatestNewsCard data={{...frontier, tone: assignFrontierTone(index)}} key={frontier.id} />
      ))}
    </div>
  );
};
