"use client";

import type {CommentView} from "@/features/comments/types/comment";

import {type CommentArticleRef, CommentCard} from "@/features/comments/components/comment-card";
import {Text} from "@/shared/components/text/text";

type CommentThreadProps = {
  comments: CommentView[];
  article: CommentArticleRef;
  canReply: boolean;
};

export function CommentThread({comments, article, canReply}: CommentThreadProps) {
  if (comments.length === 0) {
    return (
      <div className="w-full border border-dashed border-border bg-card p-6">
        <Text className="text-basic-500 uppercase" variant="meta.3">
          &gt; No transmissions yet. Sé el primero en comentar.
        </Text>
      </div>
    );
  }

  return (
    <ul className="flex w-full list-none flex-col gap-2">
      {comments.map((comment) => (
        <CommentCard article={article} canReply={canReply} comment={comment} key={comment.id} />
      ))}
    </ul>
  );
}
