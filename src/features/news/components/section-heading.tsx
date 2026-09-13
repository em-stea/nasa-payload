import type {ReactNode} from "react";

import {Heading} from "@/shared/components/heading/heading";
import {cn} from "@/shared/utils/className-builder";

type SectionHeadingProps = {
  children: ReactNode;
  /** La sección de comentarios va sin la línea de abajo. */
  bordered?: boolean;
  className?: string;
};

/**
 * Encabezado de las secciones del detalle ("RELATED ARTICLES", "COMMENTS").
 *
 * No usa `TitleSection` porque ese trae bajada y acción, y acá el diseño es
 * sólo el rótulo: Space Grotesk 24px, espaciado ancho y en mayúsculas.
 */
export function SectionHeading({children, bordered = false, className}: SectionHeadingProps) {
  return (
    <Heading
      className={cn(
        "leading-7.8 w-full text-6 font-medium tracking-2_4 text-primary-foreground uppercase",
        bordered && "border-b border-border pb-2.25",
        className,
      )}
      as="h2"
      variant="title.3"
    >
      {children}
    </Heading>
  );
}
