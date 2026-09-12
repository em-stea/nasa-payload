'use client'

import { Card, type CardData } from '@/shared/components/card/card'

type MissionCardProps = {
  data: CardData
  className?: string
}

export function MissionCard({ data, className }: MissionCardProps) {
  return (
    <Card data={data} className={className}>
      <Card.Header>
        <Card.Image />
        <Card.Tag />
      </Card.Header>
      <Card.Body className="pb-4">
        <Card.Title />
        <Card.Description />
      </Card.Body>
      <Card.Footer variant="stats">
        {data.stats?.map((stat, index) => (
          <Card.Stat key={stat.label} index={index} />
        ))}
      </Card.Footer>
    </Card>
  )
}
