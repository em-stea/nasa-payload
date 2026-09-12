/**
 * Color con el que se pinta el nombre y el avatar de quien comenta.
 *
 * Dos, como en el diseño. No es sólo fidelidad: son los dos únicos acentos que
 * la paleta tiene resueltos en claro y en oscuro, y un tercero quedaría
 * ilegible sobre el fondo blanco.
 */
export type CommentTone = 'blue' | 'red'

/** Un comentario listo para pintar, con sus respuestas colgando. */
export type CommentView = {
  id: string
  /** Nombre en el formato del diseño: `ENG_O'BRIEN`. */
  handle: string
  authorName: string
  authorImage?: string
  tone: CommentTone
  content: string
  /** ISO, para el `dateTime` del <time>. */
  createdAt: string
  /** Lo escribió quien está mirando la página: puede borrarlo. */
  isOwn: boolean
  replies: CommentView[]
}
