import { http } from '@/shared/services/http'
import { ProjectMediaResponse } from '../types/project-media-types'

export async function getProjectMedia(projectsById: string[]) {
  const results = await Promise.all(
    projectsById.map(async (title, index) => {
      if (!title) return null
      const cleanQuery = title.split(' ').slice(0, 3).join(' ')

      const response = await http.get<ProjectMediaResponse>(
        `https://images-api.nasa.gov/search?q=${encodeURIComponent(cleanQuery)}&media_type=image&page_size=1`,
      )
      const data = response.data
      const item = data.collection?.items?.[0]

      const imageUrl = item?.links?.[2]?.href
      if (!imageUrl) return null

      // return {
      //   id: `mission-${index}`,
      //   query: title,
      //   title: item?.data?.[0]?.title || title,
      //   description: item?.data?.[0]?.description_508 || item?.data?.[0]?.description,
      //   imageUrl,
      // }
      return {
        ...item?.data?.[0],
        id: `mission-${index}`,
        imageUrl,
      }
    }),
  )
  const filteredResults = results.filter((item): item is NonNullable<typeof item> => Boolean(item))
  const slicedResults = filteredResults.slice(0, 3)
  return slicedResults
}
