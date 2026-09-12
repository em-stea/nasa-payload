import type { CommentView } from '@/features/comments/types/comment'
import { toCommentHandle, toCommentTone } from '@/features/comments/utils/comment-view'
import type { Comment, SiteUser } from '@/payload-types'
import { getPayloadClient } from '@/shared/services/payload'

/**
 * Tope de comentarios que se traen de un artículo. Con más que esto el hilo
 * necesita paginación propia, que hoy no está en el diseño.
 */
const MAX_COMMENTS = 200

function toId(value: unknown): string | undefined {
  if (!value) return undefined
  if (typeof value === 'object') return String((value as { id: unknown }).id)

  return String(value)
}

function toAuthor(comment: Comment): SiteUser | null {
  return typeof comment.author === 'object' && comment.author !== null ? comment.author : null
}

function toView(comment: Comment): CommentView {
  const author = toAuthor(comment)
  const authorId = author?.id ?? toId(comment.author)

  return {
    id: comment.id,
    handle: toCommentHandle(comment.authorName),
    authorName: comment.authorName,
    authorImage: author?.image ?? undefined,
    // Los comentarios cargados a mano desde el backoffice no tienen lector
    // asociado; para esos el color sale del nombre.
    tone: toCommentTone(authorId ?? comment.authorName),
    content: comment.content,
    createdAt: comment.createdAt,
    replies: [],
  }
}

/**
 * Arma el hilo a partir de la lista plana.
 *
 * Payload devuelve los comentarios de un artículo sin jerarquía y con `parent`
 * apuntando al de arriba. Una sola pasada alcanza porque los ordenamos por
 * fecha: un padre siempre se creó antes que su respuesta, así que ya está en el
 * índice cuando llega la hija.
 */
function buildThread(comments: Comment[]): CommentView[] {
  const byId = new Map<string, CommentView>()
  const roots: CommentView[] = []

  for (const comment of comments) {
    byId.set(comment.id, toView(comment))
  }

  for (const comment of comments) {
    const view = byId.get(comment.id)
    if (!view) continue

    const parent = byId.get(toId(comment.parent) ?? '')

    if (parent) parent.replies.push(view)
    else roots.push(view)
  }

  return roots
}

/**
 * Comentarios aprobados de un artículo, ya armados como hilo.
 *
 * Entra por la Local API, que saltea el access control de la colección, así
 * que el filtro por estado se pone acá de forma explícita: lo que un moderador
 * marcó como rechazado o spam no sale del backoffice.
 */
export async function getArticleComments(articleId: string): Promise<CommentView[]> {
  const payload = await getPayloadClient()

  const { docs } = await payload.find({
    collection: 'comments',
    where: {
      and: [{ articleId: { equals: articleId } }, { status: { equals: 'approved' } }],
    },
    sort: 'createdAt',
    limit: MAX_COMMENTS,
    // Profundidad 1 para traer el lector de cada comentario (avatar y color) y
    // no una cadena de relaciones que no usamos.
    depth: 1,
  })

  return buildThread(docs)
}

/** Cuántos comentarios tiene el artículo, contando respuestas. */
export function countComments(comments: CommentView[]): number {
  return comments.reduce((total, comment) => total + 1 + countComments(comment.replies), 0)
}
