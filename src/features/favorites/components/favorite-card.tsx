'use client'

import Link from 'next/link'
import { useState } from 'react'

import { FavoriteButton } from '@/features/favorites/components/favorite-button'
import type { Favorite } from '@/payload-types'
import { Card } from '@/shared/components/card/card'

/**
 * Card de un guardado.
 *
 * El link no envuelve la card: adentro vive el formulario que quita el
 * favorito, y un `<form>` dentro de un `<a>` no es HTML válido. En su lugar el
 * titular estira su área clickeable sobre toda la card con `after:inset-0`, y
 * el botón de quitar se apoya por encima.
 *
 * La lista viene del server y no se vuelve a pedir al quitar un favorito, así
 * que la card se saca sola apenas el botón pasa a "no guardado" —optimista,
 * sin esperar respuesta del server ni refrescar la ruta.
 */
export function FavoriteCard({ favorite }: { favorite: Favorite }) {
  const [removed, setRemoved] = useState(false)

  if (removed) return null

  return (
    <Card
      className="relative h-full"
      data={{
        tag: favorite.tag ?? undefined,
        tone: favorite.tone ?? 'blue',
        image: favorite.image ?? undefined,
        imageAlt: '',
        title: favorite.title,
        description: favorite.description ?? undefined,
      }}
    >
      <Card.Header>
        <Card.Image />
        <Card.Tag dot />
      </Card.Header>

      <Card.Body className="flex-1 pb-4">
        <div className="relative z-10 flex items-center justify-end">
          <FavoriteButton
            saved
            canSave
            onSavedChange={(saved) => {
              if (!saved) setRemoved(true)
            }}
            item={{
              kind: favorite.kind,
              itemId: favorite.itemId,
              title: favorite.title,
              description: favorite.description ?? undefined,
              image: favorite.image ?? undefined,
              href: favorite.href ?? undefined,
              tag: favorite.tag ?? undefined,
              tone: favorite.tone ?? undefined,
            }}
          />
        </div>

        <Card.Title className="line-clamp-2">
          <Link
            href={favorite.href ?? '/news'}
            className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-200"
          >
            {favorite.title}
          </Link>
        </Card.Title>

        <Card.Description className="line-clamp-3" />
      </Card.Body>
    </Card>
  )
}
