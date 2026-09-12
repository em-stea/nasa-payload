'use client'

import * as React from 'react'
import { Separator as SeparatorPrimitive } from 'radix-ui'

import { separatorVariants } from '@/shared/styles/components/separator'
import { cn } from '@/shared/utils/className-builder'

function Separator({
  className,
  orientation = 'horizontal',
  decorative = true,
  ...props
}: React.ComponentProps<typeof SeparatorPrimitive.Root>) {
  return (
    <SeparatorPrimitive.Root
      data-slot="separator"
      decorative={decorative}
      orientation={orientation}
      className={cn(separatorVariants(), className)}
      {...props}
    />
  )
}

export { Separator }
