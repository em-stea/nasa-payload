"use client";

import type {CommentTone, CommentView} from "@/features/comments/types/comment";

import Image from "next/image";
import {useState} from "react";

import {CommentForm} from "@/features/comments/components/comment-form";
import {User} from "@/shared/components/icons/other/user";
import {Text} from "@/shared/components/text/text";
import {cn} from "@/shared/utils/className-builder";
import {toMissionDate} from "@/shared/utils/mission-date";

/** Artículo al que pertenece el hilo; viaja con cada respuesta. */
export type CommentArticleRef = {
  id: string;
  title: string;
  url: string;
};

/**
 * A partir de acá las respuestas dejan de indentarse. Con más niveles el texto
 * queda contra el borde derecho en mobile y el hilo se vuelve ilegible.
 */
const MAX_INDENT_DEPTH = 2;

/** `foreground` y `destructive` ya cambian de valor entre claro y oscuro. */
const TONE_TEXT: Record<CommentTone, string> = {
  blue: "text-foreground",
  red: "text-destructive",
};

const TONE_BORDER: Record<CommentTone, string> = {
  blue: "border-foreground",
  red: "border-destructive",
};

function Avatar({comment}: {comment: CommentView}) {
  return (
    <span
      className={cn(
        "flex size-10 shrink-0 items-center justify-center overflow-hidden border bg-background",
        TONE_BORDER[comment.tone],
      )}
    >
      {comment.authorImage ? (
        <Image
          alt=""
          className="size-full object-cover"
          height={40}
          src={comment.authorImage}
          width={40}
        />
      ) : (
        <User aria-hidden="true" className={cn("size-5", TONE_TEXT[comment.tone])} />
      )}
    </span>
  );
}

type CommentCardProps = {
  comment: CommentView;
  article: CommentArticleRef;
  /** Sin sesión no se muestra el botón de responder. */
  canReply: boolean;
  depth?: number;
};

export function CommentCard({comment, article, canReply, depth = 0}: CommentCardProps) {
  const [replying, setReplying] = useState(false);

  return (
    <li className="flex w-full scroll-mt-24 flex-col gap-2" id={`comment-${comment.id}`}>
      <article className="flex w-full gap-4 border border-border bg-card p-4">
        <Avatar comment={comment} />

        <div className="flex min-w-0 flex-1 flex-col">
          <div className="flex items-baseline justify-between gap-4 border-b border-border pb-1.25">
            <Text className={cn("truncate font-bold", TONE_TEXT[comment.tone])} variant="meta.3">
              {comment.handle}
            </Text>

            <Text className="shrink-0 text-basic-500" variant="meta.3">
              <time dateTime={comment.createdAt}>{toMissionDate(comment.createdAt)}</time>
            </Text>
          </div>

          <Text
            className="pt-2 leading-5.25 whitespace-pre-line text-muted-foreground"
            variant="body.3"
          >
            {comment.content}
          </Text>

          {canReply && (
            <div className="flex items-center gap-4 pt-3">
              <button
                aria-expanded={replying}
                className="text-basic-500 uppercase transition-colors duration-200 hover:cursor-pointer hover:text-foreground"
                type="button"
                onClick={() => setReplying((open) => !open)}
              >
                <Text variant="meta.3">{replying ? "Cancel reply" : "Reply"}</Text>
              </button>
            </div>
          )}
        </div>
      </article>

      {replying && (
        <div className="ps-6 sm:ps-14">
          <CommentForm
            // eslint-disable-next-line jsx-a11y/no-autofocus -- el foco se mueve tras el click en "Reply", no al cargar la página.
            autoFocus
            articleId={article.id}
            articleTitle={article.title}
            articleUrl={article.url}
            label={`> REPLY TO ${comment.handle}`}
            parentId={comment.id}
            placeholder="Write your reply..."
            submitLabel="Reply"
            onSubmitted={() => setReplying(false)}
          />
        </div>
      )}

      {comment.replies.length > 0 && (
        <ul
          className={cn(
            "flex list-none flex-col gap-2",
            depth < MAX_INDENT_DEPTH && "border-s border-border ps-4 sm:ps-6",
          )}
        >
          {comment.replies.map((reply) => (
            <CommentCard
              article={article}
              canReply={canReply}
              comment={reply}
              depth={depth + 1}
              key={reply.id}
            />
          ))}
        </ul>
      )}
    </li>
  );
}
