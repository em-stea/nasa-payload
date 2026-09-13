"use client";

import {Card, type CardData} from "@/shared/components/card/card";

type CloseApproachCardProps = {
  data: CardData;
  className?: string;
};

export function CloseApproachCard({data, className}: CloseApproachCardProps) {
  return (
    <Card className={className} data={data} padding="md">
      <Card.Header variant="bar">
        <Card.Title size="sm" />
        <Card.Alert />
      </Card.Header>
      <Card.Body variant="plain">
        {data.stats?.map((stat, index) => (
          <Card.Stat index={index} key={stat.label} layout="stacked" size="sm" />
        ))}
      </Card.Body>
    </Card>
  );
}
