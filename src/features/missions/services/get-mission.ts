import type {MissionDetail, TechPortProjectDetailResponse} from "@/features/missions/types/mission";

import {cacheLife, cacheTag} from "next/cache";

import {findMissionImage} from "@/features/missions/services/get-mission-image";
import {resolveMissionTone} from "@/features/missions/utils/mission-tone";
import {stripHtml} from "@/features/missions/utils/strip-html";
import {http, HttpError} from "@/shared/services/http";
import {getNasaApiKey} from "@/shared/services/nasa-api-key";

const TECHPORT_PROJECTS_ENDPOINT = "https://api.nasa.gov/techport/api/projects";

type ProjectContact = NonNullable<
  TechPortProjectDetailResponse["project"]["projectContacts"]
>[number];

function findContact(contacts: ProjectContact[] | undefined, role: string) {
  return contacts?.find((contact) => contact.projectContactRole === role)?.fullName;
}

/**
 * Un proyecto de TechPort, pedido por su `projectId`.
 *
 * Es el mismo catálogo que alimenta Featured Missions en el home, pero de a
 * uno: el detalle puede abrirse directo, sin pasar por el preview.
 */
export async function getMission(id: string): Promise<MissionDetail | null> {
  "use cache";
  // Los proyectos de TechPort se actualizan con el financiamiento y los
  // hitos, no en tiempo real.
  cacheLife("hours");
  cacheTag(`mission-${id}`);

  try {
    const {data} = await http.get<TechPortProjectDetailResponse>(
      `${TECHPORT_PROJECTS_ENDPOINT}/${id}`,
      {searchParams: {api_key: getNasaApiKey()}},
    );

    const project = data.project;

    if (!project?.title) return null;

    const status = project.status ?? "Unknown";

    return {
      id: String(project.projectId),
      title: project.title,
      description: project.description ? stripHtml(project.description) : "",
      benefits: project.benefits ? stripHtml(project.benefits) : undefined,
      image: await findMissionImage(project.title),
      status,
      tone: resolveMissionTone(status),
      destinationTypes: project.destinationType ?? [],
      technologyArea: project.primaryTx?.title,
      trl: {
        begin: project.trlBegin ?? null,
        current: project.trlCurrent ?? null,
        end: project.trlEnd ?? null,
      },
      startDate: project.startDate,
      endDate: project.endDate,
      program: project.program?.acronymOrTitle ?? project.program?.title,
      responsibleOrganization: project.program?.responsibleMd?.organizationName,
      leadOrganization: project.leadOrganization?.organizationName,
      principalInvestigator: findContact(project.projectContacts, "Principal_Investigator"),
      projectManager: findContact(project.projectContacts, "Project_Manager"),
    };
  } catch (error) {
    // Un id fuera del catálogo responde 404: no existe, no es un error.
    if (error instanceof HttpError && error.status === 404) {
      return null;
    }

    throw error;
  }
}
