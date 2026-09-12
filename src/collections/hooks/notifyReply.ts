import type { CollectionAfterChangeHook } from 'payload'

import type { Comment } from '../../payload-types'
import { toId } from './to-id'

/** Cuánto del comentario se guarda en la notificación. */
const EXCERPT_MAX_LENGTH = 200

/**
 * Avisa al autor de un comentario cuando alguien le responde.
 *
 * Sólo dispara en el alta y sólo si la respuesta cuelga de un comentario con
 * autor identificado (los que carga un moderador a mano no tienen a quién
 * avisarle) y ese autor no es quien respondió: contestarse a uno mismo no
 * genera notificación.
 *
 * Si la notificación falla se loguea y se sigue: el comentario ya se guardó y
 * perderlo por no poder avisar sería el peor de los dos resultados.
 */
export const notifyReply: CollectionAfterChangeHook<Comment> = async ({ doc, operation, req }) => {
  if (operation !== 'create') return doc

  const parentId = toId(doc.parent)
  if (!parentId) return doc

  try {
    const parent = await req.payload.findByID({
      collection: 'comments',
      id: parentId,
      depth: 0,
      req,
    })

    const recipientId = toId(parent.author)
    if (!recipientId || recipientId === toId(doc.author)) return doc

    await req.payload.create({
      collection: 'notifications',
      data: {
        user: recipientId,
        type: 'reply',
        read: false,
        actorName: doc.authorName,
        excerpt: doc.content.slice(0, EXCERPT_MAX_LENGTH),
        articleId: doc.articleId,
        articleTitle: doc.articleTitle,
        comment: doc.id,
        parent: parentId,
      },
      req,
    })
  } catch (error) {
    req.payload.logger.error({ err: error, msg: 'No se pudo notificar la respuesta al comentario' })
  }

  return doc
}
