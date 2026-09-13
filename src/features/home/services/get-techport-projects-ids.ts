import { FRONT_ENV } from '@/shared/config/front-config'

export async function getTechPortProjectsIds() {
  const response = await fetch(
    `https://api.nasa.gov/techport/api/projects?api_key=${FRONT_ENV.NEXT_PUBLIC_NASA_API_KEY}`,
  )
  const data = await response.json()

  const projectsIds = data.projects
    .slice(0, 45)
    .map((project: { projectId: number }) => project.projectId)

  return projectsIds
}
