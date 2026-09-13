"use client";

import {Switch as SwitchPrimitive} from "radix-ui";
import * as React from "react";

import {switchThumbVariants, switchVariants} from "@/shared/styles/components/switch";
import {cn} from "@/shared/utils/className-builder";

type SwitchProps = React.ComponentProps<typeof SwitchPrimitive.Root> & {
  /** Clases para el thumb, que no es accesible desde `className`. */
  thumbClassName?: string;
};

function Switch({className, thumbClassName, ...props}: SwitchProps) {
  return (
    <SwitchPrimitive.Root className={cn(switchVariants(), className)} data-slot="switch" {...props}>
      <SwitchPrimitive.Thumb
        className={cn(switchThumbVariants(), thumbClassName)}
        data-slot="switch-thumb"
      />
    </SwitchPrimitive.Root>
  );
}

export {Switch};
