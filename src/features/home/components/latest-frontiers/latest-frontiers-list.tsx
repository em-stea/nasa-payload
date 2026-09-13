import {CardTone} from "@/shared/components/card/card";
import {LatestNewsCard} from "@/shared/components/card/latest-news-card";

interface LatestFrontiersListProps {
  latestFrontiers: any[];
}

export const LatestFrontiersList = ({latestFrontiers}: LatestFrontiersListProps) => {
  const COLOR_PALETTE: CardTone[] = ["blue", "red"];

  const getToneByIndex = (index: number): CardTone => {
    return COLOR_PALETTE[index % COLOR_PALETTE.length];
  };

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {latestFrontiers.map((frontier, index) => {
        const tone = getToneByIndex(index);

        return <LatestNewsCard data={{...frontier, tone}} key={frontier.id} />;
      })}
    </div>
  );
};
