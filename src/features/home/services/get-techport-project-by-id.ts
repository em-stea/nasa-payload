import { FRONT_ENV } from '@/shared/config/front-config'

export async function getTechPortProjectById(projectIds: number[]) {
  const missionNames = await Promise.all(
    projectIds.map(async (id: number) => {
      const res = await fetch(
        `https://api.nasa.gov/techport/api/projects/${id}?api_key=${FRONT_ENV.NEXT_PUBLIC_NASA_API_KEY}`,
      )
      const data = await res.json()
      return data.project?.title
    }),
  )
  return missionNames
}
