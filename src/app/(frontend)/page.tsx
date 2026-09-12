import APODHero from '@/features/home/components/APOD-hero.tsx/APOD-hero'
import { GlobeEarth } from '@/features/home/components/wrapper-earth'

export default async function HomePage() {
  'use cache'

  return (
    <main className="min-h-dvh bg-basic-960  text-basic-00">
      <APODHero />
      {/* <GlobeEarth /> */}
    </main>
  )
}
