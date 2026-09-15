import type {Metadata} from "next";

import ThreeDEarth from "@/features/home/components/3D-earth/3D-earth";
import APODHero from "@/features/home/components/APOD-hero.tsx/APOD-hero";
import {CelestialNearMisses} from "@/features/home/components/celestial-near/celestial-near-misses";
import {FeaturedMissions} from "@/features/home/components/featured-missions/featured-missions";
import LatestFrontiers from "@/features/home/components/latest-frontiers/latest-frontiers";
import {Container} from "@/shared/components/container/container";

export const metadata: Metadata = {
  title: "NASA — Blog",
  description:
    "La foto astronómica del día, misiones destacadas, las últimas fronteras espaciales y los objetos que más se acercaron a la Tierra.",
};

export default async function HomePage() {
  "use cache";

  return (
    <main className="min-h-dvh">
      <APODHero />

      <ThreeDEarth />
      <Container>
        <FeaturedMissions />
        <LatestFrontiers />
        <CelestialNearMisses />
      </Container>
    </main>
  );
}
