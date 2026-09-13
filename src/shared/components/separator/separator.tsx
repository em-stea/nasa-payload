"use client";

import {Separator as SeparatorPrimitive} from "radix-ui";
import * as React from "react";

import {separatorVariants} from "@/shared/styles/components/separator";
import {cn} from "@/shared/utils/className-builder";

function Separator({
  className,
  orientation = "horizontal",
  decorative = true,
  ...props
}: React.ComponentProps<typeof SeparatorPrimitive.Root>) {
  return (
    <SeparatorPrimitive.Root
      className={cn(separatorVariants(), className)}
      data-slot="separator"
      decorative={decorative}
      orientation={orientation}
      {...props}
    />
  );
}

export {Separator};
