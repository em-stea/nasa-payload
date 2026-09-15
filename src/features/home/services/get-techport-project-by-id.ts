import type {TechPortProjectDetailResponse} from "@/features/missions/types/mission";

import {FRONT_ENV} from "@/shared/config/front-config";
import {NASA_ENDPOINTS} from "@/shared/constants/nasa-endpoints";
import {http} from "@/shared/services/http";

/** Lo mínimo de un proyecto de TechPort: con el título se busca su imagen. */
export type TechPortProjectSummary = {
  id: number;
  title: string;
};

/**
 * Resuelve el título de cada id del índice.
 *
 * Los proyectos que no responden quedan afuera en vez de tumbar la tanda: son
 * decenas de requests en paralelo contra `api.nasa.gov`, que ante una ráfaga
 * contesta 429 a algunos. Como Featured Missions muestra tres cards de un pool
 * de 45, perder algunas no se nota; que explote la sección, sí.
 */
async function fetchProject(id: number): Promise<TechPortProjectSummary | null> {
  try {
    const {data} = await http.get<TechPortProjectDetailResponse>(
      `${NASA_ENDPOINTS.techport}/projects/${id}`,
      {searchParams: {api_key: FRONT_ENV.NEXT_PUBLIC_NASA_API_KEY}},
    );

    // TechPort tiene fichas incompletas: sin título no hay card ni búsqueda de
    // imagen posible.
    const title = data.project?.title;

    return title ? {id, title} : null;
  } catch (error) {
    console.error(`Error fetching TechPort project ${id}:`, error);

    return null;
  }
}

export async function getTechPortProjectById(
  projectIds: number[],
): Promise<TechPortProjectSummary[]> {
  const projects = await Promise.all(projectIds.map(fetchProject));

  return projects.filter((project): project is TechPortProjectSummary => project !== null);
}
