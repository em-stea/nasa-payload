'use client'

import { Suspense, type ReactNode } from 'react'

import { useSearchParams } from 'next/navigation'

/**
 * Envuelve el grid en un `<Suspense>` cuya key cambia con la URL.
 *
 * Cambiar de filtro no cambia de posición en el árbol: React trata la
 * navegación como una actualización del mismo boundary y, para evitar
 * parpadeos, mantiene el grid anterior montado hasta que el nuevo resuelve en
 * vez de mostrar el skeleton. La key fuerza el remount del boundary.
 *
 * Se lee del cliente por la misma razón que en `NewsFilterBarLive`: en una
 * navegación entre filtros el router ya tiene los search params, así que
 * `useSearchParams` resuelve sincrónico y la key cambia en el mismo frame del
 * click, antes de que el nuevo grid empiece a resolver.
 */
export function NewsResultsBoundary({
  children,
  fallback,
}: {
  children: ReactNode
  fallback: ReactNode
}) {
  const searchParams = useSearchParams()
  const key = `${searchParams.get('category') ?? 'all'}-${searchParams.get('page') ?? '1'}`

  return (
    <Suspense key={key} fallback={fallback}>
      {children}
    </Suspense>
  )
}
