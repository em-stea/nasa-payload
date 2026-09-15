import type {LaunchLibraryUpcomingResponse, UpcomingLaunch} from "@/features/home/types/launch";

import {NASA_ENDPOINTS} from "@/shared/constants/nasa-endpoints";
import {http} from "@/shared/services/http";

/**
 * El próximo despegue del calendario de TheSpaceDevs.
 *
 * Devuelve `null` cuando la API no responde o el calendario viene vacío: la
 * caja "UPCOMING" del home no se pinta y el resto de Featured Missions queda
 * intacto. El endpoint no pide key pero limita a 15 requests por hora por IP,
 * así que un 429 acá es esperable.
 */
export async function getNextUpcomingLaunch(): Promise<UpcomingLaunch | null> {
  try {
    const {data} = await http.get<LaunchLibraryUpcomingResponse>(
      `${NASA_ENDPOINTS.launches}/launch/upcoming/`,
      {searchParams: {limit: 1}},
    );

    const nextLaunch = data.results?.[0];

    if (!nextLaunch) return null;

    return {
      name: nextLaunch.name,
      // El `net` es ISO completo; la caja sólo muestra el día.
      date: nextLaunch.net.split("T")[0],
      status: nextLaunch.status?.name ?? "Unknown",
      location: nextLaunch.pad?.location?.name ?? "Unknown",
    };
  } catch (error) {
    console.error("Error fetching upcoming launch:", error);

    return null;
  }
}
