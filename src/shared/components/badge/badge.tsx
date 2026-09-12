import * as React from 'react'
import { type VariantProps } from 'class-variance-authority'
import { Slot } from 'radix-ui'

import { badgeVariants } from '@/shared/styles/components/badge'
import { cn } from '@/shared/utils/className-builder'

function Badge({
  className,
  variant = 'default',
  tone,
  asChild,
  ...props
}: React.ComponentProps<'span'> & VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : 'span'

  return (
    <Comp
      data-slot="badge"
      data-variant={variant}
      data-tone={tone}
      className={cn(badgeVariants({ variant, tone }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
