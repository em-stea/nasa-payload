import {FRONT_ENV} from "@/shared/config/front-config";

export type TechPortProjectSummary = {
  id: number;
  title: string;
};

export async function getTechPortProjectById(
  projectIds: number[],
): Promise<TechPortProjectSummary[]> {
  const projects = await Promise.all(
    projectIds.map(async (id: number) => {
      const res = await fetch(
        `https://api.nasa.gov/techport/api/projects/${id}?api_key=${FRONT_ENV.NEXT_PUBLIC_NASA_API_KEY}`,
      );
      const data = await res.json();

      return {id, title: data.project?.title as string | undefined};
    }),
  );

  return projects.filter((project): project is TechPortProjectSummary => Boolean(project.title));
}
