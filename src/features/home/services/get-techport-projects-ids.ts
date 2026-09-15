import type {TechPortProjectsListResponse} from "@/features/missions/types/mission";

import {FRONT_ENV} from "@/shared/config/front-config";
import {NASA_ENDPOINTS} from "@/shared/constants/nasa-endpoints";
import {http} from "@/shared/services/http";

/**
 * TechPort devuelve el índice entero —decenas de miles de proyectos— y el
 * título hay que pedirlo de a uno. Cortamos temprano: de estos 45 salen las
 * tres cards que muestra Featured Missions.
 */
const MAX_PROJECTS = 45;

/**
 * Ids del índice de TechPort, ya recortados. Si el índice no responde devuelve
 * vacío: Featured Missions se queda sin cards pero el home sigue en pie.
 */
export async function getTechPortProjectsIds(): Promise<number[]> {
  try {
    const {data} = await http.get<TechPortProjectsListResponse>(
      `${NASA_ENDPOINTS.techport}/projects`,
      {searchParams: {api_key: FRONT_ENV.NEXT_PUBLIC_NASA_API_KEY}},
    );

    return data.projects.slice(0, MAX_PROJECTS).map((project) => project.projectId);
  } catch (error) {
    console.error("Error fetching TechPort projects index:", error);

    return [];
  }
}
