'use client'

import { CommentCard, type CommentArticleRef } from '@/features/comments/components/comment-card'
import type { CommentView } from '@/features/comments/types/comment'
import { Text } from '@/shared/components/text/text'

type CommentThreadProps = {
  comments: CommentView[]
  article: CommentArticleRef
  canReply: boolean
}

export function CommentThread({ comments, article, canReply }: CommentThreadProps) {
  if (comments.length === 0) {
    return (
      <div className="w-full border border-dashed border-border bg-card p-6">
        <Text variant="meta.3" className="text-basic-500 uppercase">
          &gt; No transmissions yet. Sé el primero en comentar.
        </Text>
      </div>
    )
  }

  return (
    <ul className="flex w-full list-none flex-col gap-2">
      {comments.map((comment) => (
        <CommentCard key={comment.id} comment={comment} article={article} canReply={canReply} />
      ))}
    </ul>
  )
}
