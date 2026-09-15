"use client";

import {VariantProps} from "class-variance-authority";

import {Card, type CardData} from "@/shared/components/card/card";

import {badgeVariants} from "../badge/badge";

type CloseApproachCardProps = {
  data: CardData;
  className?: string;
  tagVariant?: VariantProps<typeof badgeVariants>["variant"];
};

export function CloseApproachCard({data, className, tagVariant}: CloseApproachCardProps) {
  return (
    <Card className={className} data={data} padding="md" variant="plain">
      <Card.Header variant="bar">
        <Card.Title size="sm" />
        <Card.Badge dot variant={tagVariant} />
      </Card.Header>
      <Card.Body variant="plain">
        {data.stats?.map((stat, index) => (
          <Card.Stat index={index} key={stat.label} layout="stacked" size="sm" />
        ))}
      </Card.Body>
    </Card>
  );
}
