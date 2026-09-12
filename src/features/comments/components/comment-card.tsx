'use client'

import Image from 'next/image'
import { useActionState, useState } from 'react'

import { deleteComment } from '@/features/comments/actions/comments'
import { INITIAL_COMMENT_STATE, type CommentActionState } from '@/features/comments/actions/state'
import { CommentForm } from '@/features/comments/components/comment-form'
import type { CommentTone, CommentView } from '@/features/comments/types/comment'
import { User } from '@/shared/components/icons/other/user'
import { Text } from '@/shared/components/text/text'
import { cn } from '@/shared/utils/className-builder'
import { toMissionDate } from '@/shared/utils/mission-date'

/** Artículo al que pertenece el hilo; viaja con cada respuesta. */
export type CommentArticleRef = {
  id: string
  title: string
  url: string
}

/**
 * A partir de acá las respuestas dejan de indentarse. Con más niveles el texto
 * queda contra el borde derecho en mobile y el hilo se vuelve ilegible.
 */
const MAX_INDENT_DEPTH = 2

/** `foreground` y `destructive` ya cambian de valor entre claro y oscuro. */
const TONE_TEXT: Record<CommentTone, string> = {
  blue: 'text-foreground',
  red: 'text-destructive',
}

const TONE_BORDER: Record<CommentTone, string> = {
  blue: 'border-foreground',
  red: 'border-destructive',
}

function Avatar({ comment }: { comment: CommentView }) {
  return (
    <span
      className={cn(
        'flex size-10 shrink-0 items-center justify-center overflow-hidden border bg-background',
        TONE_BORDER[comment.tone],
      )}
    >
      {comment.authorImage ? (
        <Image
          src={comment.authorImage}
          alt=""
          width={40}
          height={40}
          className="size-full object-cover"
        />
      ) : (
        <User className={cn('size-5', TONE_TEXT[comment.tone])} aria-hidden="true" />
      )}
    </span>
  )
}

/** Borrado en dos pasos: el segundo click confirma. */
function DeleteButton({ commentId }: { commentId: string }) {
  const [confirming, setConfirming] = useState(false)
  const [state, formAction, pending] = useActionState<CommentActionState, FormData>(
    deleteComment,
    INITIAL_COMMENT_STATE,
  )

  return (
    <form action={formAction} className="flex items-center gap-2">
      <input type="hidden" name="commentId" value={commentId} />

      <button
        type={confirming ? 'submit' : 'button'}
        disabled={pending}
        onClick={() => {
          if (!confirming) setConfirming(true)
        }}
        className="text-basic-500 uppercase transition-colors duration-200 hover:cursor-pointer hover:text-destructive disabled:cursor-wait"
      >
        <Text variant="meta.3">{confirming ? 'Confirm delete' : 'Delete'}</Text>
      </button>

      {confirming && !pending && (
        <button
          type="button"
          onClick={() => setConfirming(false)}
          className="text-basic-500 uppercase transition-colors duration-200 hover:cursor-pointer hover:text-foreground"
        >
          <Text variant="meta.3">Cancel</Text>
        </button>
      )}

      {state.status === 'error' && (
        <Text variant="meta.3" className="text-destructive">
          {state.message}
        </Text>
      )}
    </form>
  )
}

type CommentCardProps = {
  comment: CommentView
  article: CommentArticleRef
  /** Sin sesión no se muestra el botón de responder. */
  canReply: boolean
  depth?: number
}

export function CommentCard({ comment, article, canReply, depth = 0 }: CommentCardProps) {
  const [replying, setReplying] = useState(false)

  return (
    <li className="flex w-full flex-col gap-2">
      <article className="flex w-full gap-4 border border-border bg-card p-4">
        <Avatar comment={comment} />

        <div className="flex min-w-0 flex-1 flex-col">
          <div className="flex items-baseline justify-between gap-4 border-b border-border pb-1.25">
            <Text variant="meta.3" className={cn('truncate font-bold', TONE_TEXT[comment.tone])}>
              {comment.handle}
            </Text>

            <Text variant="meta.3" className="shrink-0 text-basic-500">
              <time dateTime={comment.createdAt}>{toMissionDate(comment.createdAt)}</time>
            </Text>
          </div>

          <Text
            variant="body.3"
            className="pt-2 leading-5.25 whitespace-pre-line text-muted-foreground"
          >
            {comment.content}
          </Text>

          {(canReply || comment.isOwn) && (
            <div className="flex items-center gap-4 pt-3">
              {canReply && (
                <button
                  type="button"
                  onClick={() => setReplying((open) => !open)}
                  aria-expanded={replying}
                  className="text-basic-500 uppercase transition-colors duration-200 hover:cursor-pointer hover:text-foreground"
                >
                  <Text variant="meta.3">{replying ? 'Cancel reply' : 'Reply'}</Text>
                </button>
              )}

              {comment.isOwn && <DeleteButton commentId={comment.id} />}
            </div>
          )}
        </div>
      </article>

      {replying && (
        <div className="ps-6 sm:ps-14">
          <CommentForm
            articleId={article.id}
            articleTitle={article.title}
            articleUrl={article.url}
            parentId={comment.id}
            label={`> REPLY TO ${comment.handle}`}
            placeholder="Write your reply..."
            submitLabel="Reply"
            autoFocus
            onSubmitted={() => setReplying(false)}
          />
        </div>
      )}

      {comment.replies.length > 0 && (
        <ul
          className={cn(
            'flex list-none flex-col gap-2',
            depth < MAX_INDENT_DEPTH && 'border-s border-border ps-4 sm:ps-6',
          )}
        >
          {comment.replies.map((reply) => (
            <CommentCard
              key={reply.id}
              comment={reply}
              article={article}
              canReply={canReply}
              depth={depth + 1}
            />
          ))}
        </ul>
      )}
    </li>
  )
}
