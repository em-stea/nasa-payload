import type {EpicCapture, EpicImageResponse} from "@/features/home/types/epic";

import {cacheLife, cacheTag} from "next/cache";

import {parseEpicImage} from "@/features/home/utils/parse-epic";
import {NASA_ENDPOINTS} from "@/shared/constants/nasa-endpoints";
import {http} from "@/shared/services/http";

export async function getEPIC3DImages(): Promise<EpicCapture[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("epic-captures");

  const {data} = await http.get<EpicImageResponse[]>(`${NASA_ENDPOINTS.epic}/enhanced`);

  return data.map(parseEpicImage).sort((first, second) => first.date.localeCompare(second.date));
}
