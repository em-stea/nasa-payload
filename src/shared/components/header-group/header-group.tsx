import Link from "next/link";

import {Badge} from "../badge/badge";
import {Button} from "../button/button";
import {Heading} from "../heading/heading";
import {ArrowRight} from "../icons/directional/arrow-right";
import {Text} from "../text/text";

interface HeaderGroupProps {
  title: string;
  description: string;
  badge?: {
    text: string;
    icon: React.ReactNode;
  };
  link?: {
    text: string;
    href: string;
  };
}

export function HeaderGroup({title, description, badge, link}: HeaderGroupProps) {
  return (
    <div className="flex flex-col items-start justify-between gap-4 pb-6 lg:flex-row lg:items-end lg:gap-0">
      <div className="flex flex-col gap-2">
        {badge && (
          <Badge tone="light-red" variant="full-filled">
            {badge.icon} {badge.text}
          </Badge>
        )}

        <Heading variant="title.2">{title}</Heading>

        <Text className="max-w-2xl" color="basic-300" variant="body.3">
          {description}
        </Text>
      </div>

      {link && (
        <Button asChild size="intrinsic" variant="text-link">
          <Link href={link.href}>
            {link.text}
            <ArrowRight className="size-5" />
          </Link>
        </Button>
      )}
    </div>
  );
}
