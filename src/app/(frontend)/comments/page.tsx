import type { Metadata } from 'next'
import Link from 'next/link'
import { Suspense } from 'react'

import { SignInPanel } from '@/features/account/components/sign-in-panel'
import { getSessionIdentity } from '@/features/account/services/site-user'
import { getMyComments } from '@/features/comments/services/get-my-comments'
import type { MyCommentView } from '@/features/comments/types/comment'
import { NewsResultsBoundary } from '@/features/news/components/news-results-boundary'
import { buildArticleHref } from '@/features/news/utils/parse-post'
import { Heading } from '@/shared/components/heading/heading'
import { Pagination } from '@/shared/components/pagination/pagination'
import { Text } from '@/shared/components/text/text'
import { toMissionDate } from '@/shared/utils/mission-date'

export const metadata: Metadata = {
  title: 'My Comments',
  description: 'Todo lo que comentaste, en un solo lugar.',
}

export const instant = true

type CommentsSearchParams = {
  page?: string | string[]
}

function readPage(value: string | string[] | undefined) {
  const raw = Array.isArray(value) ? value[0] : value
  const page = Number.parseInt(raw ?? '1', 10)

  return Number.isFinite(page) && page > 0 ? page : 1
}

/** `/comments`, `/comments?page=2`. Omite el default para no duplicar la cache. */
function buildCommentsHref(page: number) {
  return page > 1 ? `/comments?page=${page}` : '/comments'
}

/**
 * Lo que el lector escribió, en todos los artículos.
 *
 * El encabezado viaja en el shell estático de la ruta y la lista, que depende
 * de la sesión y de la página pedida, entra por streaming dentro de su propio
 * boundary: cambiar de página muestra el skeleton al toque en vez de quedarse
 * con la lista vieja pegada en pantalla.
 */
export default function MyCommentsPage({
  searchParams,
}: {
  searchParams: Promise<CommentsSearchParams>
}) {
  return (
    <main className="flex min-h-dvh w-full flex-col items-start gap-8 bg-background px-6 pt-24 pb-32 text-primary-foreground">
      <header className="flex w-full flex-col gap-1.8 border-b border-border pt-20 pb-6">
        <Text variant="body.4" className="flex flex-wrap items-baseline gap-2">
          <span className="text-foreground">SYS.MSG</span>
          <span className="text-basic-500">TRANSMISSION_LOG</span>
        </Text>

        <Heading as="h1" variant="title.2" className="text-12 leading-13.2 tracking-n0_96">
          My Comments
        </Heading>

        <Text variant="body.1" className="max-w-2xl text-basic-500">
          Todo lo que comentaste en las noticias, ordenado del más nuevo al más viejo.
        </Text>
      </header>

      <Suspense fallback={<MyCommentsSkeleton />}>
        <NewsResultsBoundary fallback={<MyCommentsSkeleton />}>
          <MyCommentsList searchParams={searchParams} />
        </NewsResultsBoundary>
      </Suspense>
    </main>
  )
}

async function MyCommentsList({
  searchParams,
}: {
  searchParams: Promise<CommentsSearchParams>
}) {
  const identity = await getSessionIdentity()

  if (!identity) {
    return (
      <div className="w-full max-w-[600px]">
        <SignInPanel description="Iniciá sesión para ver tus comentarios." />
      </div>
    )
  }

  const params = await searchParams
  const { comments, page, totalPages, totalDocs } = await getMyComments(readPage(params.page))

  if (comments.length === 0) {
    return (
      <div className="w-full max-w-852 border border-dashed border-border bg-card p-6">
        <Text variant="meta.3" className="text-basic-500 uppercase">
          &gt; No transmissions logged. Dejá un comentario desde el detalle de una noticia.
        </Text>
      </div>
    )
  }

  return (
    <div className="flex w-full max-w-852 flex-col gap-4">
      <Text variant="meta.3" className="text-basic-500 uppercase">
        {totalDocs === 1 ? '01 entry' : `${String(totalDocs).padStart(2, '0')} entries`}
      </Text>

      <ul className="flex w-full list-none flex-col gap-2">
        {comments.map((comment) => (
          <MyCommentRow key={comment.id} comment={comment} />
        ))}
      </ul>

      {totalPages > 1 && (
        <Pagination page={page} totalPages={totalPages} buildHref={buildCommentsHref} prefetch />
      )}
    </div>
  )
}

function MyCommentRow({ comment }: { comment: MyCommentView }) {
  return (
    <li>
      <Link
        href={`${buildArticleHref(comment.articleId)}#comment-${comment.id}`}
        className="flex w-full flex-col gap-2 border border-border bg-card p-4 transition-colors duration-200 hover:border-foreground"
      >
        <div className="flex items-baseline justify-between gap-4 border-b border-border pb-1.25">
          <Text variant="meta.3" className="truncate text-basic-500 uppercase">
            {comment.articleTitle ?? `Entry #${comment.articleId}`}
          </Text>

          <Text variant="meta.3" className="shrink-0 text-basic-500">
            <time dateTime={comment.createdAt}>{toMissionDate(comment.createdAt)}</time>
          </Text>
        </div>

        <Text
          variant="body.3"
          className="line-clamp-3 leading-5.25 whitespace-pre-line text-muted-foreground"
        >
          {comment.content}
        </Text>
      </Link>
    </li>
  )
}

function MyCommentsSkeleton() {
  return (
    <div className="flex w-full max-w-852 flex-col gap-2" aria-hidden="true">
      {Array.from({ length: 3 }, (_, index) => (
        <div key={index} className="h-29.5 w-full animate-pulse border border-border bg-card" />
      ))}
    </div>
  )
}
