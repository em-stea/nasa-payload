"use client";

import {VariantProps} from "class-variance-authority";

import {Card, type CardData} from "@/shared/components/card/card";

import {badgeVariants} from "../badge/badge";

type CloseApproachCardProps = {
  data: CardData;
  className?: string;
};

export function CloseApproachCard({data, className}: CloseApproachCardProps) {
  type HighAlertTone = Extract<VariantProps<typeof badgeVariants>["tone"], "red">;
  const ALERT_TONE: HighAlertTone = "red";

  return (
    <Card className={className} data={data} padding="md">
      <Card.Header variant="bar">
        <Card.Title size="sm" />
        <Card.Badge dot={data.tone === ALERT_TONE} />
      </Card.Header>
      <Card.Body variant="plain">
        {data.stats?.map((stat, index) => (
          <Card.Stat index={index} key={stat.label} layout="stacked" size="sm" />
        ))}
      </Card.Body>
    </Card>
  );
}
