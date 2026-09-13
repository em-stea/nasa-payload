import type {ReactNode} from "react";

import {Text} from "@/shared/components/text/text";
import {cn} from "@/shared/utils/className-builder";

type DataPanelProps = {
  title: string;
  /** Instrumento de la esquina: cada panel del diseño tiene el suyo. */
  icon?: ReactNode;
  /** `raised` es el panel con fondo propio, como NEXT CLOSEST APPROACH. */
  variant?: "plain" | "raised";
  children: ReactNode;
  className?: string;
};

/**
 * Panel del detalle: rótulo, icono y una línea que separa el encabezado del
 * contenido.
 *
 * El diseño usa dos tratamientos. Los de arriba se apoyan sobre el fondo de la
 * página y sólo llevan la línea; el de la próxima aproximación va sobre una
 * caja con fondo propio, que es lo que lo destaca del resto.
 */
export function DataPanel({title, icon, variant = "plain", children, className}: DataPanelProps) {
  const raised = variant === "raised";

  return (
    <section
      className={cn(
        "flex w-full flex-col",
        raised && "overflow-hidden rounded-lg border border-border bg-card",
        className,
      )}
    >
      <header
        className={cn(
          "flex items-center justify-between gap-2 border-b border-border pb-2",
          raised && "px-4 pt-4",
        )}
      >
        <Text className="text-muted-foreground" variant="body.4">
          {title}
        </Text>
        {icon}
      </header>

      <div className={cn("flex w-full flex-col", raised ? "px-4 pb-2" : "pt-4")}>{children}</div>
    </section>
  );
}

type StackedFactProps = {
  label: string;
  children: ReactNode;
};

/** Dato con el rótulo arriba y el valor abajo, como en HAZARD ANALYSIS. */
export function StackedFact({label, children}: StackedFactProps) {
  return (
    <div className="flex min-w-0 flex-col gap-0.5 border-b border-border py-2 last:border-b-0">
      <Text className="text-muted-foreground" variant="meta.1">
        {label}
      </Text>
      {children}
    </div>
  );
}

type InlineFactProps = {
  label: string;
  value: string;
  highlight?: boolean;
};

/** Fila `rótulo … valor`, como en NEXT CLOSEST APPROACH. */
export function InlineFact({label, value, highlight = false}: InlineFactProps) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-border py-3 last:border-b-0">
      <Text className="shrink-0 text-muted-foreground" variant="meta.1">
        {label}
      </Text>
      <Text
        className={cn(
          "truncate text-right",
          highlight ? "text-foreground" : "text-primary-foreground",
        )}
        variant="body.3"
      >
        {value}
      </Text>
    </div>
  );
}
