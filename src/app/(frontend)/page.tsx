import { type CardData } from '@/shared/components/card/card'
import { LatestNewsCard } from '@/shared/components/card/latest-news-card'

const ARTICLES: CardData[] = [
  {
    tag: 'Discovery',
    tone: 'blue',
    image: '/images/card-discovery.jpg',
    imageAlt: 'Spacecraft flying through a purple nebula',
    title: 'James Webb Detects Water Vapor',
    description:
      'Revolutionary atmospheric analysis of exoplanet K2-18b reveals the presence of carbon-bearing molecules and potential…',
    date: 'T-Minus 12 Hours Ago',
    dateTime: '2024-01-01T12:00:00Z',
  },
  {
    tag: 'Mars',
    tone: 'red',
    image: '/images/card-mars.jpg',
    imageAlt: 'Perseverance rover on the surface of Mars',
    title: 'Perseverance Core Sampling',
    description:
      'The rover successfully extracted its 21st core sample from the Jezero Crater, targeting ancient sedimentary rock…',
    date: 'T-Minus 24 Hours Ago',
    dateTime: '2023-12-31T12:00:00Z',
  },
  {
    tag: 'Iss',
    tone: 'orange',
    image: '/images/card-iss.jpg',
    imageAlt: 'International Space Station orbiting Earth',
    title: 'Expedition 70 Crew Transitions',
    description:
      'Orbital handover complete as the new crew initiates microgravity biology experiments aboard the orbital laboratory.',
    date: 'T-Minus 48 Hours Ago',
    dateTime: '2023-12-30T12:00:00Z',
  },
]

export default function HomePage() {
  return (
    <main className="min-h-dvh bg-basic-960 px-6 py-16 text-basic-00">
      <div className="mx-auto grid max-w-305 grid-cols-1 gap-4 md:grid-cols-3">
        {ARTICLES.map((article) => (
          <LatestNewsCard key={article.title} data={article} />
        ))}
      </div>
    </main>
  )
}
