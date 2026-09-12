'use client'

import { useActionState, useEffect } from 'react'

import { createComment } from '@/features/comments/actions/comments'
import { INITIAL_COMMENT_STATE, type CommentActionState } from '@/features/comments/actions/state'
import { Button } from '@/shared/components/button/button'
import { Text } from '@/shared/components/text/text'
import { textVariants } from '@/shared/styles/components/text'
import { cn } from '@/shared/utils/className-builder'

export type CommentFormProps = {
  articleId: string
  articleTitle: string
  articleUrl: string
  /** Presente sólo cuando el formulario es una respuesta a otro comentario. */
  parentId?: string
  label?: string
  placeholder?: string
  submitLabel?: string
  /** Se llama al publicar; lo usa la respuesta para cerrarse sola. */
  onSubmitted?: () => void
  autoFocus?: boolean
}

/**
 * La "terminal de respuesta" del diseño.
 *
 * El textarea se vacía cambiando su `key` con el `formKey` que devuelve la
 * acción, en vez de manejarlo como input controlado: así el texto que el lector
 * ya escribió sobrevive a un error del server y sólo se pierde cuando el
 * comentario efectivamente se publicó.
 */
export function CommentForm({
  articleId,
  articleTitle,
  articleUrl,
  parentId,
  label = '> RESPONSE',
  placeholder = 'Leave your comment...',
  submitLabel = 'Send',
  onSubmitted,
  autoFocus = false,
}: CommentFormProps) {
  const [state, formAction, pending] = useActionState<CommentActionState, FormData>(
    createComment,
    INITIAL_COMMENT_STATE,
  )

  useEffect(() => {
    if (state.status === 'success') onSubmitted?.()
  }, [state, onSubmitted])

  return (
    <form
      action={formAction}
      className="flex w-full flex-col gap-1 border border-border bg-card p-2.25"
    >
      <input type="hidden" name="articleId" value={articleId} />
      <input type="hidden" name="articleTitle" value={articleTitle} />
      <input type="hidden" name="articleUrl" value={articleUrl} />
      {parentId && <input type="hidden" name="parentId" value={parentId} />}

      <Text variant="body.4" className="pl-1 tracking-1_2 text-foreground">
        {label}
      </Text>

      <textarea
        key={state.formKey}
        name="content"
        required
        rows={4}
        autoFocus={autoFocus}
        placeholder={placeholder}
        aria-label={parentId ? 'Tu respuesta' : 'Tu comentario'}
        aria-invalid={state.status === 'error' || undefined}
        className={cn(
          textVariants({ variant: 'meta.3' }),
          'min-h-30 w-full resize-y border border-border bg-background p-4 text-primary-foreground',
          'placeholder:text-secondary focus:border-foreground focus:outline-none',
          state.status === 'error' && 'border-destructive',
        )}
      />

      {/* El aviso vive siempre en el DOM —aunque esté vacío— para que el
          lector de pantalla anuncie el cambio, y `me-auto` lo deja a la
          izquierda sin mover el botón del borde derecho que pide el diseño. */}
      <div className="flex items-center justify-end gap-4 pt-2.5">
        <Text
          variant="meta.3"
          aria-live="polite"
          className={cn('me-auto min-w-0', state.status === 'error' && 'text-destructive')}
        >
          {state.status === 'error' ? state.message : ''}
        </Text>

        <Button
          type="submit"
          size="md"
          loading={pending}
          disabled={pending}
          className="w-40 shrink-0 rounded-lg py-2 font-bold tracking-0_8 uppercase"
        >
          {submitLabel}
        </Button>
      </div>
    </form>
  )
}
