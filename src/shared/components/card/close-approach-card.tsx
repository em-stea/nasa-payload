'use client'

import { Card, type CardData } from '@/shared/components/card/card'

type CloseApproachCardProps = {
  data: CardData
  className?: string
}

export function CloseApproachCard({ data, className }: CloseApproachCardProps) {
  return (
    <Card data={data} padding="md" className={className}>
      <Card.Header variant="bar">
        <Card.Title size="sm" />
        <Card.Alert />
      </Card.Header>
      <Card.Body variant="plain">
        {data.stats?.map((stat, index) => (
          <Card.Stat key={stat.label} index={index} layout="stacked" size="sm" />
        ))}
      </Card.Body>
    </Card>
  )
}
