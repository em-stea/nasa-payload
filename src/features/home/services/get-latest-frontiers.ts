import {Item} from "../types/project-media-types";

interface GetLatestFrontiersProps {
  pageSize: number;
}

export const getLatestFrontiers = async ({pageSize}: GetLatestFrontiersProps) => {
  const currentYear = new Date().getFullYear();

  const response = await fetch(
    `https://images-api.nasa.gov/search?media_type=image&year_start=${currentYear}&page_size=${pageSize}`,
  );
  const data = await response.json();
  const items: Item[] = data.collection.items || [];

  return items.flatMap((item) => {
    const info = item.data?.[0];
    const keywords = info?.keywords;

    if (!keywords || keywords.length === 0) return [];

    const category = keywords[0]?.toUpperCase();

    return [
      {
        id: info.nasa_id,
        tag: category,
        title: info.title,
        description: info.description ? `${info.description.slice(0, 120)}...` : "",
        image: item.links?.[0]?.href,
        date: new Date(info.date_created).toISOString().split("T")[0],
      },
    ];
  });
};
