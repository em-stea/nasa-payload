'use server'

import type { Where } from 'payload'
import { z } from 'zod'

import { requireSiteUser } from '@/features/account/services/site-user'
import { getPayloadClient } from '@/shared/services/payload'

export type FavoriteState = {
  saved: boolean
  status: 'idle' | 'error'
  message?: string
}

const toneSchema = z.enum(['blue', 'red', 'orange'])

const favoriteSchema = z.object({
  kind: z.enum(['news', 'apod']),
  itemId: z.string().min(1),
  title: z.string().min(1),
  description: z.string().optional(),
  image: z.string().optional(),
  href: z.string().optional(),
  tag: z.string().optional(),
  tone: toneSchema.optional(),
})

/**
 * Guarda o saca un item de favoritos según cómo esté ahora.
 *
 * El estado real lo decide la base, no el cliente: el botón manda siempre el
 * item completo y la acción resuelve qué corresponde hacer. Así dos pestañas
 * abiertas sobre la misma noticia no terminan creando duplicados.
 *
 * No revalida ni refresca la ruta a propósito. Acá no hay nada cacheado
 * (`getFavorites`/`isFavorite` son dinámicas), y cualquier re-render del árbol
 * del server al resolver la acción hace que React corra una view transition
 * sobre el `<ViewTransition>` del hero: eso es el salto de pantalla que se veía
 * al guardar. El botón se pinta solo, con su propio estado.
 */
export async function toggleFavorite(item: unknown): Promise<FavoriteState> {
  const parsed = favoriteSchema.safeParse(item)

  if (!parsed.success) {
    return { saved: false, status: 'error', message: 'No pudimos identificar el item.' }
  }

  let siteUser

  try {
    siteUser = await requireSiteUser()
  } catch {
    return { saved: false, status: 'error', message: 'Necesitás iniciar sesión.' }
  }

  const payload = await getPayloadClient()
  const { kind, itemId, ...card } = parsed.data

  const where: Where = {
    and: [
      { user: { equals: siteUser.id } },
      { kind: { equals: kind } },
      { itemId: { equals: itemId } },
    ],
  }

  try {
    const { docs } = await payload.find({ collection: 'favorites', where, limit: 1, depth: 0 })
    const existing = docs[0]

    if (existing) {
      await payload.delete({ collection: 'favorites', id: existing.id, depth: 0 })

      return { saved: false, status: 'idle' }
    }

    await payload.create({
      collection: 'favorites',
      data: { user: siteUser.id, kind, itemId, ...card },
      depth: 0,
    })

    return { saved: true, status: 'idle' }
  } catch (error) {
    payload.logger.error({ err: error, msg: 'No se pudo actualizar el favorito' })

    return { saved: false, status: 'error', message: 'No pudimos guardar el cambio.' }
  }
}
