import type {EonetEvent, NaturalEventDetail} from "@/features/events/types/events";

import {cacheLife, cacheTag} from "next/cache";

import {parseEventDetail, toEventId} from "@/features/events/utils/parse-event";
import {NASA_ENDPOINTS} from "@/shared/constants/nasa-endpoints";
import {http, HttpError} from "@/shared/services/http";

/**
 * Un evento completo de EONET.
 *
 * Es el mismo catálogo que alimenta el listado, pero pedido de a uno: así
 * llega la traza entera y no solo el último punto, que es de donde sale la
 * línea de tiempo del detalle.
 */
export async function getEvent(ref: string): Promise<NaturalEventDetail | null> {
  "use cache";
  // La traza de un evento abierto se extiende a lo largo del día.
  cacheLife("minutes");
  cacheTag(`event-${ref}`);

  try {
    const {data} = await http.get<EonetEvent>(`${NASA_ENDPOINTS.eonet}/events/${toEventId(ref)}`, {
      timeoutMs: 15_000,
    });

    return parseEventDetail(data, Date.now());
  } catch (error) {
    // Con un id que no existe EONET no responde 404 sino 500, así que los dos
    // status se leen como "no está": a esta altura el ref ya viene validado
    // como numérico desde la ruta, y lo único que puede fallar es que ese
    // número no exista en el catálogo.
    if (error instanceof HttpError && (error.status === 404 || error.status === 500)) return null;

    throw error;
  }
}
