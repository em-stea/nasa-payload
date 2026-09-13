import type { ReactNode } from 'react'

import { Heading } from '@/shared/components/heading/heading'
import { Text } from '@/shared/components/text/text'
import { cn } from '@/shared/utils/className-builder'

type TelemetrySectionProps = {
  title: string
  /** Rótulo chico de la derecha: `[360° SWEEP ACTIVE]`. */
  readout?: string
  children: ReactNode
  className?: string
}

/**
 * Bloque de la pantalla: rótulo a la izquierda, lectura del instrumento a la
 * derecha y el panel debajo.
 *
 * No usa `SectionHeading` de noticias porque ese es sólo el título; acá el
 * encabezado es una fila de dos columnas y se repite en las tres secciones.
 */
export function TelemetrySection({ title, readout, children, className }: TelemetrySectionProps) {
  return (
    <section className={cn('flex w-full flex-col gap-4', className)}>
      <div className="flex w-full flex-wrap items-baseline justify-between gap-2">
        <Heading
          as="h2"
          variant="title.3"
          className="text-6 leading-7.8 font-medium tracking-2_4 text-primary-foreground uppercase"
        >
          {title}
        </Heading>

        {readout && (
          <Text variant="meta.1" className="text-muted-foreground">
            {readout}
          </Text>
        )}
      </div>

      {children}
    </section>
  )
}
