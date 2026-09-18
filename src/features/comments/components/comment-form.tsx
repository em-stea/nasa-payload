"use client";

import {useActionState, useEffect} from "react";

import {createComment} from "@/features/comments/actions/comments";
import {type CommentActionState, INITIAL_COMMENT_STATE} from "@/features/comments/actions/state";
import {Button} from "@/shared/components/button/button";
import {Text} from "@/shared/components/text/text";
import {textVariants} from "@/shared/styles/components/text";
import {cn} from "@/shared/utils/className-builder";

export type CommentFormProps = {
  articleId: string;
  articleTitle: string;
  articleUrl: string;
  parentId?: string;
  label?: string;
  placeholder?: string;
  submitLabel?: string;
  onSubmitted?: () => void;
  autoFocus?: boolean;
};

export function CommentForm({
  articleId,
  articleTitle,
  articleUrl,
  parentId,
  label = "> RESPONSE",
  placeholder = "Leave your comment...",
  submitLabel = "Send",
  onSubmitted,
  autoFocus = false,
}: CommentFormProps) {
  const [state, formAction, pending] = useActionState<CommentActionState, FormData>(
    createComment,
    INITIAL_COMMENT_STATE,
  );

  useEffect(() => {
    if (state.status === "success") onSubmitted?.();
  }, [state, onSubmitted]);

  return (
    <form
      action={formAction}
      className="flex w-full flex-col gap-1 border border-border bg-card p-2.25"
    >
      <input name="articleId" type="hidden" value={articleId} />
      <input name="articleTitle" type="hidden" value={articleTitle} />
      <input name="articleUrl" type="hidden" value={articleUrl} />
      {parentId && <input name="parentId" type="hidden" value={parentId} />}

      <Text className="pl-1 tracking-1.2 text-foreground" variant="body.4">
        {label}
      </Text>

      <textarea
        required
        className={cn(
          textVariants({variant: "meta.3"}),
          "min-h-30 w-full resize-y border border-border bg-background p-4 text-primary-foreground",
          "placeholder:text-placeholder-text focus:border-foreground focus:outline-none",
          state.status === "error" && "border-destructive",
        )}
        aria-invalid={state.status === "error" || undefined}
        aria-label={parentId ? "Tu respuesta" : "Tu comentario"}
        // eslint-disable-next-line jsx-a11y/no-autofocus -- solo es true cuando el usuario abrió el formulario de respuesta.
        autoFocus={autoFocus}
        key={state.formKey}
        name="content"
        placeholder={placeholder}
        rows={4}
      />

      <div className="flex items-center justify-end gap-4 pt-2.5">
        <Text
          aria-live="polite"
          className={cn("me-auto min-w-0", state.status === "error" && "text-destructive")}
          variant="meta.3"
        >
          {state.status === "error" ? state.message : ""}
        </Text>

        <Button
          className="w-40 shrink-0 rounded-lg py-2 font-bold tracking-0.8 uppercase"
          disabled={pending}
          loading={pending}
          size="md"
          type="submit"
        >
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
