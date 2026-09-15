import type {ReactNode} from "react";

import {Text} from "@/shared/components/text/text";
import {cn} from "@/shared/utils/className-builder";

type DataPanelProps = {
  title: string;
  /** Instrumento de la esquina de cada panel. */
  icon?: ReactNode;
  children: ReactNode;
  className?: string;
};

/** Panel del detalle: rótulo, icono y una línea que separa el encabezado del contenido. */
export function DataPanel({title, icon, children, className}: DataPanelProps) {
  return (
    <section className={cn("flex w-full flex-col", className)}>
      <header className="flex items-center justify-between gap-2 border-b border-border pb-2">
        <Text className="text-muted-foreground" variant="body.4">
          {title}
        </Text>
        {icon}
      </header>

      <div className="flex w-full flex-col pt-4">{children}</div>
    </section>
  );
}

type InlineFactProps = {
  label: string;
  value: string;
};

/** Fila `rótulo … valor`. */
export function InlineFact({label, value}: InlineFactProps) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-border py-3 last:border-b-0">
      <Text className="shrink-0 text-muted-foreground" variant="meta.1">
        {label}
      </Text>
      <Text className="truncate text-right text-primary-foreground" variant="body.3">
        {value}
      </Text>
    </div>
  );
}
