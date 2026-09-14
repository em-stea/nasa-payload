import {type VariantProps} from "class-variance-authority";

import {badgeDotVariants, badgeVariants} from "@/shared/styles/components/badge";
import {cn} from "@/shared/utils/className-builder";

function Badge({
  className,
  variant = "default",
  tone,
  hasDot = false,
  children,
  ...props
}: React.ComponentProps<"span"> & VariantProps<typeof badgeVariants> & {hasDot?: boolean}) {
  return (
    <span className={cn(badgeVariants({variant, tone}), className)} data-slot="badge" {...props}>
      {hasDot && <span aria-hidden="true" className={badgeDotVariants()} data-slot="badge-dot" />}
      {children}
    </span>
  );
}

export {Badge, badgeVariants};
