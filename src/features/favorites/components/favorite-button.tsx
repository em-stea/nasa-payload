'use client'

import { signIn } from 'next-auth/react'
import { useActionState } from 'react'

import { toggleFavorite, type FavoriteState } from '@/features/favorites/actions/favorites'
import { Heart } from '@/shared/components/icons/other/heart'
import { Text } from '@/shared/components/text/text'
import { cn } from '@/shared/utils/className-builder'

export type FavoriteItem = {
  kind: 'news' | 'apod'
  itemId: string
  title: string
  description?: string
  image?: string
  href?: string
  tag?: string
  tone?: 'blue' | 'red' | 'orange'
}

type FavoriteButtonProps = {
  item: FavoriteItem
  /** Estado en la base al renderizar; lo resuelve el server. */
  saved: boolean
  /** Sin sesión el botón invita a entrar en vez de guardar. */
  canSave: boolean
}

const ICON_CLASSNAME = 'size-5 shrink-0'

/**
 * Guarda la noticia en favoritos.
 *
 * Mientras la acción viaja, el ícono ya muestra el estado al que va: la
 * respuesta del server lo confirma o lo devuelve a donde estaba, que es lo que
 * pasa si la operación falla.
 */
export function FavoriteButton({ item, saved, canSave }: FavoriteButtonProps) {
  const [state, formAction, pending] = useActionState<FavoriteState, FormData>(toggleFavorite, {
    saved,
    status: 'idle',
  })

  const isSaved = pending ? !state.saved : state.saved
  const label = isSaved ? 'Quitar de favoritos' : 'Guardar en favoritos'

  if (!canSave) {
    return (
      <button
        type="button"
        onClick={() => void signIn()}
        aria-label="Iniciá sesión para guardar esta noticia"
        className="flex items-center gap-2 text-basic-500 transition-colors duration-200 hover:cursor-pointer hover:text-foreground"
      >
        <Heart className={ICON_CLASSNAME} aria-hidden="true" />
        <Text variant="meta.3" className="hidden uppercase sm:block">
          Save
        </Text>
      </button>
    )
  }

  return (
    <form action={formAction}>
      <input type="hidden" name="kind" value={item.kind} />
      <input type="hidden" name="itemId" value={item.itemId} />
      <input type="hidden" name="title" value={item.title} />
      {item.description && <input type="hidden" name="description" value={item.description} />}
      {item.image && <input type="hidden" name="image" value={item.image} />}
      {item.href && <input type="hidden" name="href" value={item.href} />}
      {item.tag && <input type="hidden" name="tag" value={item.tag} />}
      {item.tone && <input type="hidden" name="tone" value={item.tone} />}

      <button
        type="submit"
        disabled={pending}
        aria-pressed={isSaved}
        aria-label={label}
        title={state.status === 'error' ? state.message : label}
        className={cn(
          'flex items-center gap-2 transition-colors duration-200 hover:cursor-pointer disabled:cursor-wait',
          isSaved ? 'text-red-300' : 'text-basic-500 hover:text-foreground',
        )}
      >
        <Heart className={ICON_CLASSNAME} aria-hidden="true" />
        <Text variant="meta.3" className="hidden uppercase sm:block">
          {isSaved ? 'Saved' : 'Save'}
        </Text>
      </button>
    </form>
  )
}
