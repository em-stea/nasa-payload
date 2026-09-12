'use client'

import * as React from 'react'
import { Switch as SwitchPrimitive } from 'radix-ui'

import { switchThumbVariants, switchVariants } from '@/shared/styles/components/switch'
import { cn } from '@/shared/utils/className-builder'

type SwitchProps = React.ComponentProps<typeof SwitchPrimitive.Root> & {
  /** Clases para el thumb, que no es accesible desde `className`. */
  thumbClassName?: string
}

function Switch({ className, thumbClassName, ...props }: SwitchProps) {
  return (
    <SwitchPrimitive.Root data-slot="switch" className={cn(switchVariants(), className)} {...props}>
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(switchThumbVariants(), thumbClassName)}
      />
    </SwitchPrimitive.Root>
  )
}

export { Switch }
