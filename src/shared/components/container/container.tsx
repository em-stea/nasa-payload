import type { ComponentProps } from 'react'

import { containerVariants } from '@/shared/styles/components/container'
import { cn } from '@/shared/utils/className-builder'

/** Centra el contenido de una página en un ancho máximo de 1400px, en mobile y desktop. */
function Container({ className, ...props }: ComponentProps<'div'>) {
  return <div data-slot="container" className={cn(containerVariants(), className)} {...props} />
}

export { Container }
