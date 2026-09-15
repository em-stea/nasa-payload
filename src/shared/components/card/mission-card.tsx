"use client";

import {Card, type CardData} from "@/shared/components/card/card";

type MissionCardProps = {
  data: CardData;
  className?: string;
};

export function MissionCard({data, className}: MissionCardProps) {
  return (
    <Card className={className} data={data} variant="media">
      <Card.Header>
        <Card.Image />
        <Card.Badge />
      </Card.Header>
      <Card.Body className="pb-4">
        <Card.Title />
        <Card.Description />
      </Card.Body>
      <Card.Footer withSeparator variant="stats">
        {data.stats?.map((stat, index) => (
          <Card.Stat index={index} key={stat.label} size="sm" />
        ))}
      </Card.Footer>
    </Card>
  );
}
