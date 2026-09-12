import { SignInPanel } from '@/features/account/components/sign-in-panel'
import { getSessionIdentity } from '@/features/account/services/site-user'
import { CommentForm } from '@/features/comments/components/comment-form'
import { CommentThread } from '@/features/comments/components/comment-thread'
import {
  countComments,
  getArticleComments,
} from '@/features/comments/services/get-article-comments'
import { SectionHeading } from '@/features/news/components/section-heading'
import type { NewsArticleDetail } from '@/features/news/types/news'
import { Text } from '@/shared/components/text/text'

/** El bloque de comentarios va más angosto que el artículo, como en el diseño. */
const WIDTH_CLASSNAME = 'mx-auto flex w-full max-w-852 flex-col gap-4'

/**
 * Hilo del artículo.
 *
 * Lee la base en cada request —los comentarios son lo más vivo de la página— y
 * por eso la `page` lo monta dentro de su propio `<Suspense>`: el resto del
 * detalle sale del shell estático sin esperar a Mongo.
 */
export async function CommentsSection({ article }: { article: NewsArticleDetail }) {
  const [comments, identity] = await Promise.all([
    getArticleComments(String(article.id)),
    getSessionIdentity(),
  ])

  const total = countComments(comments)

  return (
    <section aria-labelledby="comments" className={WIDTH_CLASSNAME}>
      <div className="flex w-full flex-wrap items-baseline justify-between gap-2">
        <SectionHeading className="w-auto">
          <span id="comments">Comments</span>
        </SectionHeading>

        <Text variant="meta.3" className="text-basic-500 uppercase">
          {total === 1 ? '01 entry' : `${String(total).padStart(2, '0')} entries`}
        </Text>
      </div>

      <CommentThread
        comments={comments}
        canReply={Boolean(identity)}
        article={{ id: String(article.id), title: article.title, url: article.sourceUrl }}
      />

      <div className="w-full pt-4">
        {identity ? (
          <CommentForm
            articleId={String(article.id)}
            articleTitle={article.title}
            articleUrl={article.sourceUrl}
          />
        ) : (
          <SignInPanel description="Iniciá sesión para dejar un comentario y enterarte cuando te respondan." />
        )}
      </div>
    </section>
  )
}

/** Reserva el alto del hilo mientras resuelve, para que el footer no salte. */
export function CommentsSectionSkeleton() {
  return (
    <div className={WIDTH_CLASSNAME} aria-hidden="true">
      <div className="h-8 w-48 animate-pulse bg-card" />
      <div className="h-26.5 w-full animate-pulse border border-border bg-card" />
      <div className="h-26.5 w-full animate-pulse border border-border bg-card" />
      <div className="mt-4 h-52.5 w-full animate-pulse border border-border bg-card" />
    </div>
  )
}
