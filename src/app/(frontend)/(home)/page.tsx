import ThreeDEarth from '@/features/home/components/3D-earth/3D-earth'
import APODHero from '@/features/home/components/APOD-hero.tsx/APOD-hero'
import { FeaturedMissions } from '@/features/home/components/featured-missions/featured-missions'

export default async function HomePage() {
  'use cache'

  return (
    <main className="min-h-dvh text-basic-00">
      <APODHero />
      <ThreeDEarth />
      <FeaturedMissions />
    </main>
  )
}
