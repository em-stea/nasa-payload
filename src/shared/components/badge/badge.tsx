import {type VariantProps} from "class-variance-authority";
import {Slot} from "radix-ui";

import {badgeDotVariants, badgeVariants} from "@/shared/styles/components/badge";
import {cn} from "@/shared/utils/className-builder";

function Badge({
  className,
  variant = "default",
  tone,
  asChild,
  hasDot = false,
  children,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & {asChild?: boolean} & {hasDot?: boolean}) {
  const Comp = asChild ? Slot.Root : "span";

  return (
    <Comp
      className={cn(badgeVariants({variant, tone}), className)}
      data-slot="badge"
      data-tone={tone}
      data-variant={variant}
      {...props}
    >
      {hasDot && <div className={cn(badgeDotVariants({variant, tone}), className)} />}
      {children}
    </Comp>
  );
}

export {Badge, badgeVariants};
