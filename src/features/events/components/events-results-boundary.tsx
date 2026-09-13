"use client";

import {useSearchParams} from "next/navigation";
import {type ReactNode, Suspense} from "react";

/**
 * Envuelve el grid en un `<Suspense>` cuya key cambia con la URL.
 *
 * Cambiar de filtro no cambia de posición en el árbol: React trata la
 * navegación como una actualización del mismo boundary y, para evitar
 * parpadeos, mantiene el grid anterior montado hasta que el nuevo resuelve en
 * vez de mostrar el skeleton. La key fuerza el remount del boundary.
 */
export function EventsResultsBoundary({
  children,
  fallback,
}: {
  children: ReactNode;
  fallback: ReactNode;
}) {
  const searchParams = useSearchParams();
  const key = `${searchParams.get("category") ?? "all"}-${searchParams.get("page") ?? "1"}`;

  return (
    <Suspense fallback={fallback} key={key}>
      {children}
    </Suspense>
  );
}
