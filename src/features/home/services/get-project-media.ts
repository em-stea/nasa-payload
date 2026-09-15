import {http} from "@/shared/services/http";

import {ProjectMediaResponse} from "../types/project-media-types";
import {TechPortProjectSummary} from "./get-techport-project-by-id";

interface GetProjectMediaProps {
  projects: TechPortProjectSummary[];
  pageSize: number;
}

export async function getProjectMedia({projects, pageSize}: GetProjectMediaProps) {
  const results = await Promise.all(
    projects.map(async ({id, title}) => {
      const cleanQuery = title.split(" ").slice(0, 3).join(" ");

      const response = await http.get<ProjectMediaResponse>(
        `https://images-api.nasa.gov/search?q=${cleanQuery}&media_type=image&page_size=${pageSize}`,
      );
      const newData = response.data;
      const item = newData.collection.items?.[0];
      const nestedItem = item?.data[0];

      const imageUrl = item?.links?.[2]?.href || item?.links?.[0]?.href;

      if (!imageUrl) return null;

      return {
        id: String(id),
        title: nestedItem.title,
        description: nestedItem.description_508 || nestedItem.description,
        image: imageUrl,
        center: nestedItem.center,
        date_created: nestedItem.date_created,
      };
    }),
  );
  const filteredResults = results.filter((item): item is NonNullable<typeof item> => Boolean(item));
  const slicedResults = filteredResults.slice(0, 3);

  return slicedResults;
}
