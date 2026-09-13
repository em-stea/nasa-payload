import { type VariantProps } from 'class-variance-authority'
import { Slot } from 'radix-ui'

import { badgeDotVariants, badgeVariants } from '@/shared/styles/components/badge'
import { cn } from '@/shared/utils/className-builder'

function Badge({
  className,
  variant = 'default',
  tone,
  asChild,
  hasDot = false,
  children,
  ...props
}: React.ComponentProps<'span'> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean } & { hasDot?: boolean }) {
  const Comp = asChild ? Slot.Root : 'span'

  return (
    <Comp
      data-slot="badge"
      data-variant={variant}
      data-tone={tone}
      className={cn(badgeVariants({ variant, tone }), className)}
      {...props}
    >
      {hasDot && <div className={cn(badgeDotVariants({ variant, tone }), className)} />}
      {children}
    </Comp>
  )
}

export { Badge, badgeVariants }
