import type { ComponentProps } from 'react'

import { containerVariants } from '@/shared/styles/components/container'
import { cn } from '@/shared/utils/className-builder'
import { VariantProps } from 'class-variance-authority'

type ContainerProps = ComponentProps<'div'> & VariantProps<typeof containerVariants>

function Container({ className, variant, ...props }: ContainerProps) {
  return (
    <div
      data-slot="container"
      className={cn(containerVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Container }
