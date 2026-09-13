import {cva} from "class-variance-authority";

/**
 * Encabezado de sección: título + bajada a la izquierda y una acción opcional
 * alineada a la base del bloque. En mobile la acción baja a una segunda fila.
 */
export const titleSectionVariants = cva([
  "flex",
  "w-full",
  "flex-col",
  "items-start",
  "justify-between",
  "gap-4",
  "md:flex-row",
  "md:items-end",
]);

export const titleSectionHeaderVariants = cva([
  "flex",
  "min-w-0",
  "flex-col",
  "items-start",
  "gap-2",
]);

export const titleSectionTitleVariants = cva(["text-primary-foreground"]);

/** 576px es el ancho máximo de la bajada en el diseño. */
export const titleSectionDescriptionVariants = cva(["max-w-xl", "text-muted-foreground"]);

export const titleSectionActionVariants = cva([
  "shrink-0",
  "gap-2",
  "uppercase",
  // Pisa (via tw-merge) el tracking-1_2 que el Button hereda de button.1.
  "tracking-1_6",
  "transition-colors",
  "duration-200",
]);

/**
 * Caja de 16px: el glifo ocupa ~15.5 de su viewBox de 24, así que se ve a
 * ~10px, el tamaño con el que está dibujada la flecha en el diseño (9.33px).
 */
export const titleSectionActionIconVariants = cva(["size-4", "shrink-0"]);
