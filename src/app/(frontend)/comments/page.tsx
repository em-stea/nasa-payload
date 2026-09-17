import type {MyCommentView} from "@/features/comments/types/comment";
import type {Metadata} from "next";

import Link from "next/link";
import {Suspense} from "react";

import {SignInPanel} from "@/features/account/components/sign-in-panel";
import {getSessionIdentity} from "@/features/account/services/site-user";
import {getMyComments} from "@/features/comments/services/get-my-comments";
import {NewsResultsBoundary} from "@/features/news/components/news-results-boundary";
import {buildArticleHref} from "@/features/news/utils/parse-post";
import {Container} from "@/shared/components/container/container";
import {Heading} from "@/shared/components/heading/heading";
import {Pagination} from "@/shared/components/pagination/pagination";
import {Text} from "@/shared/components/text/text";
import {toMissionDate} from "@/shared/utils/mission-date";

export const metadata: Metadata = {
  title: "My Comments",
  description: "Todo lo que comentaste, en un solo lugar.",
};

export const instant = true;

type CommentsSearchParams = {
  page?: string | string[];
};

function readPage(value: string | string[] | undefined) {
  const raw = Array.isArray(value) ? value[0] : value;
  const page = Number.parseInt(raw ?? "1", 10);

  return Number.isFinite(page) && page > 0 ? page : 1;
}

function buildCommentsHref(page: number) {
  return page > 1 ? `/comments?page=${page}` : "/comments";
}

export default function MyCommentsPage({
  searchParams,
}: {
  searchParams: Promise<CommentsSearchParams>;
}) {
  return (
    <main className="flex min-h-dvh w-full flex-col items-center bg-background pt-24 pb-32 text-primary-foreground">
      <Container className="flex flex-col items-start gap-8">
        <header className="gap-1.8 flex w-full flex-col border-b border-border pt-20 pb-6">
          <Text className="flex flex-wrap items-baseline gap-2" variant="body.4">
            <span className="text-foreground">SYS.MSG</span>
            <span className="text-basic-500">TRANSMISSION_LOG</span>
          </Text>

          <Heading as="h1" className="leading-13.2 text-12 tracking-n0.96" variant="title.1-bold">
            My Comments
          </Heading>

          <Text className="max-w-2xl text-basic-500" variant="body.1">
            Everything you commented on news posts, ordered from newest to oldest.
          </Text>
        </header>

        <Suspense fallback={<MyCommentsSkeleton />}>
          <NewsResultsBoundary fallback={<MyCommentsSkeleton />}>
            <MyCommentsList searchParams={searchParams} />
          </NewsResultsBoundary>
        </Suspense>
      </Container>
    </main>
  );
}

async function MyCommentsList({searchParams}: {searchParams: Promise<CommentsSearchParams>}) {
  const identity = await getSessionIdentity();

  if (!identity) {
    return (
      <div className="w-full max-w-[600px]">
        <SignInPanel description="Iniciá sesión para ver tus comentarios." />
      </div>
    );
  }

  const params = await searchParams;
  const {comments, page, totalPages, totalDocs} = await getMyComments(readPage(params.page));

  if (comments.length === 0) {
    return (
      <div className="w-full max-w-852 border border-dashed border-border bg-card p-6">
        <Text className="text-basic-500 uppercase" variant="meta.3">
          &gt; No transmissions logged. Dejá un comentario desde el detalle de una noticia.
        </Text>
      </div>
    );
  }

  return (
    <div className="flex w-full max-w-852 flex-col gap-4">
      <Text className="text-basic-500 uppercase" variant="meta.3">
        {totalDocs === 1 ? "01 entry" : `${String(totalDocs).padStart(2, "0")} entries`}
      </Text>

      <ul className="flex w-full list-none flex-col gap-2">
        {comments.map((comment) => (
          <MyCommentRow comment={comment} key={comment.id} />
        ))}
      </ul>

      {totalPages > 1 && (
        <Pagination prefetch buildHref={buildCommentsHref} page={page} totalPages={totalPages} />
      )}
    </div>
  );
}

function MyCommentRow({comment}: {comment: MyCommentView}) {
  return (
    <li>
      <Link
        className="flex w-full flex-col gap-2 border border-border bg-card p-4 transition-colors duration-200 hover:border-foreground"
        href={`${buildArticleHref(comment.articleId)}#comment-${comment.id}`}
      >
        <div className="flex items-baseline justify-between gap-4 border-b border-border pb-1.25">
          <Text className="truncate text-basic-500 uppercase" variant="meta.3">
            {comment.articleTitle ?? `Entry #${comment.articleId}`}
          </Text>

          <Text className="shrink-0 text-basic-500" variant="meta.3">
            <time dateTime={comment.createdAt}>{toMissionDate(comment.createdAt)}</time>
          </Text>
        </div>

        <Text
          className="line-clamp-3 leading-5.25 whitespace-pre-line text-muted-foreground"
          variant="body.3"
        >
          {comment.content}
        </Text>
      </Link>
    </li>
  );
}

function MyCommentsSkeleton() {
  return (
    <div aria-hidden="true" className="flex w-full max-w-852 flex-col gap-2">
      {Array.from({length: 3}, (_, index) => (
        <div className="h-29.5 w-full animate-pulse border border-border bg-card" key={index} />
      ))}
    </div>
  );
}
