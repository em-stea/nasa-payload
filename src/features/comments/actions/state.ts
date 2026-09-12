/**
 * Estado que devuelven las acciones del hilo a `useActionState`.
 *
 * Vive fuera de `comments.ts` porque ese archivo es `'use server'` y desde ahí
 * sólo se pueden exportar funciones async: cualquier constante convierte el
 * módulo en un error de build.
 */
export type CommentActionState = {
  status: 'idle' | 'error' | 'success'
  message?: string
  /**
   * Cambia en cada alta exitosa. El formulario lo usa como `key` del textarea
   * para vaciarlo sin tener que manejar el valor por estado.
   */
  formKey?: number
}

export const INITIAL_COMMENT_STATE: CommentActionState = { status: 'idle' }
