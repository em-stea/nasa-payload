"use client";

import {Card, type CardData} from "@/shared/components/card/card";

type LatestNewsCardProps = {
  data: CardData;
  className?: string;
};

export function LatestNewsCard({data, className}: LatestNewsCardProps) {
  return (
    <Card className={className} data={data}>
      <Card.Header>
        <Card.Image />
        <Card.Badge variant='media'/>
      </Card.Header>
      <Card.Body>
        <Card.Title />
        <Card.Description />
      </Card.Body>
      <Card.Footer>
        <Card.Date />
      </Card.Footer>
    </Card>
  );
}
