import type {ComponentProps, ReactNode} from "react";

import Link from "next/link";

import {Button} from "@/shared/components/button/button";
import {Heading} from "@/shared/components/heading/heading";
import {ArrowRight} from "@/shared/components/icons/directional/arrow-right";
import {Text} from "@/shared/components/text/text";
import {
  titleSectionActionIconVariants,
  titleSectionActionVariants,
  titleSectionDescriptionVariants,
  titleSectionHeaderVariants,
  titleSectionTitleVariants,
  titleSectionVariants,
} from "@/shared/styles/components/title-section";
import {cn} from "@/shared/utils/className-builder";

export type TitleSectionAction = {
  label: string;
  href: ComponentProps<typeof Link>["href"];
};

type TitleSectionProps = Omit<ComponentProps<"div">, "title"> & {
  title: ReactNode;
  description?: ReactNode;
  action?: TitleSectionAction;
  as?: ComponentProps<typeof Heading>["as"];
};

export function TitleSection({
  title,
  description,
  action,
  as = "h2",
  className,
  children,
  ...props
}: TitleSectionProps) {
  return (
    <div className={cn(titleSectionVariants(), className)} {...props}>
      <div className={titleSectionHeaderVariants()}>
        <Heading as={as} className={titleSectionTitleVariants()} variant="title.2">
          {title}
        </Heading>

        {description ? (
          <Text className={titleSectionDescriptionVariants()} variant="body.1">
            {description}
          </Text>
        ) : null}
      </div>

      {children ??
        (action ? (
          <Button
            asChild
            className={titleSectionActionVariants()}
            size="intrinsic"
            variant="text-link"
          >
            <Link href={action.href}>
              {action.label}
              <ArrowRight aria-hidden="true" className={titleSectionActionIconVariants()} />
            </Link>
          </Button>
        ) : null)}
    </div>
  );
}
