import type {ComponentProps} from "react";

import {VariantProps} from "class-variance-authority";

import {containerVariants} from "@/shared/styles/components/container";
import {cn} from "@/shared/utils/className-builder";

type ContainerProps = ComponentProps<"div"> & VariantProps<typeof containerVariants>;

function Container({className, variant, ...props}: ContainerProps) {
  return (
    <div className={cn(containerVariants({variant}), className)} data-slot="container" {...props} />
  );
}

export {Container};
