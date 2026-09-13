"use client";

import {useSearchParams} from "next/navigation";
import {type ReactNode, Suspense} from "react";

/**
 * Envuelve el grid en un `<Suspense>` cuya key cambia con la página.
 *
 * Sin la key, cambiar de página no cambia de posición en el árbol: React trata
 * la navegación como una actualización del mismo boundary y, para evitar
 * parpadeos, mantiene el grid anterior montado hasta que el nuevo resuelve en
 * vez de mostrar el skeleton.
 *
 * Se lee del cliente porque en una navegación entre páginas el router ya tiene
 * los search params, así que `useSearchParams` resuelve sincrónico y la key
 * cambia en el mismo frame del click.
 */
export function AsteroidResultsBoundary({
  children,
  fallback,
}: {
  children: ReactNode;
  fallback: ReactNode;
}) {
  const page = useSearchParams().get("page") ?? "1";

  return (
    <Suspense fallback={fallback} key={page}>
      {children}
    </Suspense>
  );
}
