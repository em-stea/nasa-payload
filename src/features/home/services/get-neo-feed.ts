import {FRONT_ENV} from "@/shared/config/front-config";

interface NeoFeedProps {
  start_date: string;
  end_date: string;
}

export const getNeoFeed = async ({start_date, end_date}: NeoFeedProps) => {
  const response = await fetch(
    `https://api.nasa.gov/neo/rest/v1/feed?start_date=${start_date}&end_date=${end_date}&api_key=${FRONT_ENV.NEXT_PUBLIC_NASA_API_KEY}`,
  );

  const data = await response.json();

  if (!response.ok || !data.near_earth_objects) {
    console.error("Error fetching NASA NEO Feed:", data);

    return [];
  }

  const nearEarthObjects = Object.values(data.near_earth_objects).flat();

  return nearEarthObjects.map((neo: any) => {
    const missDistanceRaw = neo.close_approach_data[0]?.miss_distance.astronomical;
    const missDistance = missDistanceRaw ? `${Number(missDistanceRaw).toFixed(2)} AU` : "N/A";

    const velocityRaw = neo.close_approach_data[0]?.relative_velocity.kilometers_per_second;
    const velocity = velocityRaw ? `${Number(velocityRaw).toFixed(2)} km/s` : "N/A";

    const isHazardous = neo.is_potentially_hazardous_asteroid;

    const tagAndTone = {
      true: {
        tag: "HIGH ALERT",
        tone: "red",
        tagVariant: "full-filled",
      },
      false: {
        tag: "MONITORED",
        tone: "default",
        tagVariant: "default",
      },
    } as const;

    const statusTagAndTone = tagAndTone[isHazardous as keyof typeof tagAndTone];

    return {
      id: neo.id,
      title: neo.name,
      date: neo.close_approach_data[0]?.close_approach_date,
      miss_distance: missDistance,
      velocity: velocity,
      ...statusTagAndTone,
    };
  });
};
