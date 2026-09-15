import type {NeoObject} from "@/features/asteroids/types/asteroid";
import type {CloseApproachPreview, NeoFeedResponse} from "@/features/home/types/neo-feed";

import {FRONT_ENV} from "@/shared/config/front-config";
import {NASA_ENDPOINTS} from "@/shared/constants/nasa-endpoints";
import {http} from "@/shared/services/http";

type GetNeoFeedParams = {
  start_date: string;
  end_date: string;
};

/**
 * Las dos etiquetas del carrusel. NeoWs sólo publica el booleano de
 * peligrosidad, así que el tag es una lectura nuestra de ese flag.
 */
const HAZARD_BADGE = {
  true: {
    tag: "HIGH ALERT",
    tone: "red",
    tagVariant: "full-filled",
  },
  false: {
    tag: "MONITORED",
    tone: "neutral",
    tagVariant: "default",
  },
} as const satisfies Record<
  "true" | "false",
  Pick<CloseApproachPreview, "tag" | "tone" | "tagVariant">
>;

/** Formatea una magnitud de NeoWs, que siempre llega como string. */
function formatMagnitude(raw: string | undefined, unit: string) {
  if (!raw) return "N/A";

  const value = Number(raw);

  return Number.isFinite(value) ? `${value.toFixed(2)} ${unit}` : "N/A";
}

function toPreview(neo: NeoObject): CloseApproachPreview {
  // En el feed cada objeto aparece bajo el día de su aproximación, así que
  // `close_approach_data` trae esa única entrada.
  const approach = neo.close_approach_data[0];

  return {
    id: neo.id,
    title: neo.name,
    date: approach?.close_approach_date ?? "N/A",
    miss_distance: formatMagnitude(approach?.miss_distance.astronomical, "AU"),
    velocity: formatMagnitude(approach?.relative_velocity.kilometers_per_second, "km/s"),
    ...HAZARD_BADGE[neo.is_potentially_hazardous_asteroid ? "true" : "false"],
  };
}

/**
 * Objetos que se acercan a la Tierra en la ventana pedida (NeoWs `/feed`).
 *
 * El feed agrupa por día; el carrusel muestra una sola tira, así que los días
 * se aplanan en una lista. Si la API falla devolvemos vacío: la sección se
 * apaga sola y no tira abajo el home.
 */
export async function getNeoFeed({
  start_date,
  end_date,
}: GetNeoFeedParams): Promise<CloseApproachPreview[]> {
  try {
    const {data} = await http.get<NeoFeedResponse>(`${NASA_ENDPOINTS.neo}/feed`, {
      searchParams: {start_date, end_date, api_key: FRONT_ENV.NEXT_PUBLIC_NASA_API_KEY},
    });

    return Object.values(data.near_earth_objects).flat().map(toPreview);
  } catch (error) {
    console.error("Error fetching NASA NEO Feed:", error);

    return [];
  }
}
