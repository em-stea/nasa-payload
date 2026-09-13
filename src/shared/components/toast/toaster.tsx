"use client";

import {useTheme} from "next-themes";
import {Toaster as Sonner, type ToasterProps} from "sonner";

/**
 * Toasts de la app (sonner, el toast de shadcn).
 *
 * Sigue el tema de `next-themes` en vez del `prefers-color-scheme` del browser,
 * que es lo único que mira sonner por defecto: si no, con el tema forzado a
 * claro sobre un SO en oscuro el toast saldría negro contra la página blanca.
 *
 * Los colores salen de los tokens del design system para que no traiga su
 * propia paleta.
 */
export function Toaster(props: ToasterProps) {
  const {resolvedTheme} = useTheme();

  return (
    <Sonner
      toastOptions={{
        classNames: {
          toast:
            "font-jetbrains-mono rounded-lg border border-border bg-card text-primary-foreground",
          description: "text-basic-500",
          error: "border-red-300",
        },
      }}
      position="bottom-right"
      theme={resolvedTheme as ToasterProps["theme"]}
      {...props}
    />
  );
}
