import {MissionCard} from "@/shared/components/card/mission-card";
import {HeaderGroup} from "@/shared/components/header-group/header-group";

import {getProjectMedia} from "../../services/get-project-media";
import {getTechPortProjectById} from "../../services/get-techport-project-by-id";
import {getTechPortProjectsIds} from "../../services/get-techport-projects-ids";
import {getNextUpcomingLaunch} from "../../services/get-upcoming-launch";
import {UpcomingLaunchBox} from "./upcoming-launch-box";

export async function FeaturedMissions() {
  const projects = await getTechPortProjectsIds();
  const projectsById = await getTechPortProjectById(projects);
  const projectsMedia = await getProjectMedia(projectsById);

  const nextUpcomingLaunch = await getNextUpcomingLaunch();

  return (
    <div className="py-10">
      <div className="relative">
        <HeaderGroup
          description="Deep space exploration vanguard pushing the boundaries of our solar system and beyond, highlighting technological breakthroughs and active spaceflight initiatives."
          title="Featured Missions"
        />
        <UpcomingLaunchBox nextUpcomingLaunch={nextUpcomingLaunch} />

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {projectsMedia.map((project) => (
            <MissionCard
              data={{
                title: project.title,
                description: project.description,
                image: project.image,
                tone: "blue",
                stats: [
                  {
                    label: "Center",
                    value: project.center,
                  },
                  {
                    label: "Date Created",
                    value:
                      project.date_created &&
                      new Date(project.date_created).toISOString().split("T")[0],
                  },
                ],
              }}
              key={project.id}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
