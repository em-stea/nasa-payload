'use client'

import Link from 'next/link'
import type { ReactNode } from 'react'
import { useTransition } from 'react'

import { markNotificationRead } from '@/features/notifications/actions/notifications'

type NotificationLinkProps = {
  id: string
  href: string
  read: boolean
  className?: string
  children: ReactNode
}

/**
 * Link al comentario que originó el aviso.
 *
 * Marca el aviso como leído en el camino: la navegación no espera a que la
 * escritura termine, así que abrir el hilo se siente igual de rápido que
 * cualquier otro link del sitio.
 */
export function NotificationLink({ id, href, read, className, children }: NotificationLinkProps) {
  const [, startTransition] = useTransition()

  return (
    <Link
      href={href}
      className={className}
      onClick={() => {
        if (!read) startTransition(() => markNotificationRead(id))
      }}
    >
      {children}
    </Link>
  )
}
