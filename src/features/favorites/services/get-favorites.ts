import { getSessionSiteUser } from '@/features/account/services/site-user'
import type { Favorite } from '@/payload-types'
import { getPayloadClient } from '@/shared/services/payload'

/** Tope de guardados que se listan de una. */
const MAX_FAVORITES = 100

export type FavoriteKind = Favorite['kind']

/** Guardados del lector del request, del más nuevo al más viejo. */
export async function getFavorites(): Promise<Favorite[]> {
  const siteUser = await getSessionSiteUser()
  if (!siteUser) return []

  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'favorites',
    where: { user: { equals: siteUser.id } },
    sort: '-createdAt',
    limit: MAX_FAVORITES,
    depth: 0,
  })

  return docs
}

/** Si el lector del request ya guardó este item. */
export async function isFavorite(kind: FavoriteKind, itemId: string): Promise<boolean> {
  const siteUser = await getSessionSiteUser()
  if (!siteUser) return false

  const payload = await getPayloadClient()
  const { totalDocs } = await payload.count({
    collection: 'favorites',
    where: {
      and: [
        { user: { equals: siteUser.id } },
        { kind: { equals: kind } },
        { itemId: { equals: itemId } },
      ],
    },
  })

  return totalDocs > 0
}
