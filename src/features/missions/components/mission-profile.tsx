import type {MissionDetail, MissionFact} from "@/features/missions/types/mission";

import {DataPanel, InlineFact} from "@/features/missions/components/data-panel";
import {Cube} from "@/shared/components/icons/other/cube";

function buildTimeline(mission: MissionDetail) {
  if (mission.startDate && mission.endDate) return `${mission.startDate} — ${mission.endDate}`;

  return mission.startDate;
}

function buildProfileFacts(mission: MissionDetail): MissionFact[] {
  const entries: Array<[string, string | undefined]> = [
    ["Program", mission.program],
    ["Responsible organization", mission.responsibleOrganization],
    ["Lead organization", mission.leadOrganization],
    ["Technology area", mission.technologyArea],
    [
      "Destination",
      mission.destinationTypes.length > 0 ? mission.destinationTypes.join(", ") : undefined,
    ],
    ["Timeline", buildTimeline(mission)],
    ["Principal investigator", mission.principalInvestigator],
    ["Project manager", mission.projectManager],
  ];

  return entries
    .filter((entry): entry is [string, string] => Boolean(entry[1]))
    .map(([label, value]) => ({label, value}));
}

/** Ficha del proyecto: a qué programa pertenece, quién lo lleva adelante y cuándo. */
export function MissionProfile({mission}: {mission: MissionDetail}) {
  const facts = buildProfileFacts(mission);

  if (facts.length === 0) return null;

  return (
    <DataPanel icon={<Cube className="size-5 text-foreground" />} title="Mission profile">
      {facts.map((fact) => (
        <InlineFact key={fact.label} label={fact.label} value={fact.value} />
      ))}
    </DataPanel>
  );
}
