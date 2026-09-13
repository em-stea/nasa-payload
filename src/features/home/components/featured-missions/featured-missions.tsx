import { MissionCard } from '@/shared/components/card/mission-card'
import { Container } from '@/shared/components/container/container'
import { HeaderGroup } from '@/shared/components/header-group/header-group'
import { getProjectMedia } from '../../services/get-project-media'
import { getTechPortProjectById } from '../../services/get-techport-project-by-id'
import { getTechPortProjectsIds } from '../../services/get-techport-projects-ids'
import { getNextUpcomingLaunch } from '../../services/get-upcoming-launch'
import { UpcomingLaunchBox } from './upcoming-launch-box'

export async function FeaturedMissions() {
  const projects = await getTechPortProjectsIds()
  const projectsById = await getTechPortProjectById(projects)
  const projectsMedia = await getProjectMedia(projectsById)

  const nextUpcomingLaunch = await getNextUpcomingLaunch()

  return (
    <Container>
      <HeaderGroup
        title="Featured Missions"
        description="Deep space exploration vanguard pushing the boundaries of our solar system and beyond."
      />
      <div className="relative">
        <UpcomingLaunchBox nextUpcomingLaunch={nextUpcomingLaunch} />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-6">
          {projectsMedia.map((project) => (
            <MissionCard
              key={project.id}
              data={{
                title: project.title,
                description: project.description,
                image: project.image,
                tone: 'blue',
                stats: [
                  {
                    label: 'Center',
                    value: project.center,
                  },
                  {
                    label: 'Date Created',
                    value:
                      project.date_created &&
                      new Date(project.date_created).toISOString().split('T')[0],
                  },
                ],
              }}
            />
          ))}
        </div>
      </div>
    </Container>
  )
}
