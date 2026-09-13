import { cacheLife, cacheTag } from 'next/cache'

import type { EpicCapture, EpicImageResponse } from '@/features/home/types/epic'
import { parseEpicImage } from '@/features/home/utils/parse-epic'
import { NASA_ENDPOINTS } from '@/shared/constants/nasa-endpoints'
import { http } from '@/shared/services/http'

/**
 * Las tomas del último día disponible del EPIC, en orden cronológico.
 *
 * `enhanced` es la versión con el color corregido —la que se ve como uno
 * espera que se vea la Tierra—, y sin fecha en el path devuelve siempre el
 * último día publicado. Ese día tarda entre 12 y 36 horas en aparecer, así que
 * cachear por horas no atrasa nada y evita repetir el fetch en cada visita.
 */
export async function getEPIC3DImages(): Promise<EpicCapture[]> {
  'use cache'
  cacheLife('hours')
  cacheTag('epic-captures')

  const { data } = await http.get<EpicImageResponse[]>(`${NASA_ENDPOINTS.epic}/enhanced`)

  return data.map(parseEpicImage).sort((first, second) => first.date.localeCompare(second.date))
}
