import type {MissionDetail} from "@/features/missions/types/mission";

import {DataPanel, InlineFact} from "@/features/missions/components/data-panel";
import {ChartLine} from "@/shared/components/icons/other/chart-line";

/** TRL: de 1 (principio observado) a 9 (volado con éxito en su entorno real). */
function formatTrl(value: number | null) {
  return value !== null ? `${value} / 9` : "Not published";
}

export function TechnologyReadiness({mission}: {mission: MissionDetail}) {
  const {trl} = mission;

  if (trl.begin === null && trl.current === null && trl.end === null) return null;

  return (
    <DataPanel icon={<ChartLine className="size-5 text-foreground" />} title="Technology readiness">
      <InlineFact label="Starting TRL" value={formatTrl(trl.begin)} />
      <InlineFact label="Current TRL" value={formatTrl(trl.current)} />
      <InlineFact label="Target TRL" value={formatTrl(trl.end)} />
    </DataPanel>
  );
}
