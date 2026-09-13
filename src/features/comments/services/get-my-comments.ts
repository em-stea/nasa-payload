import type {MyCommentView} from "@/features/comments/types/comment";

import {getSessionSiteUser} from "@/features/account/services/site-user";
import {getPayloadClient} from "@/shared/services/payload";

const PAGE_SIZE = 20;

export type MyCommentsPage = {
  comments: MyCommentView[];
  page: number;
  totalPages: number;
  totalDocs: number;
};

const EMPTY_PAGE: MyCommentsPage = {comments: [], page: 1, totalPages: 1, totalDocs: 0};

/**
 * Comentarios propios del lector del request, paginados de a 20.
 *
 * Entra por la Local API, que saltea el access control de la colección, así
 * que el filtro por estado se pone acá de forma explícita: lo que un moderador
 * marcó como rechazado o spam no sale de "My Comments".
 */
export async function getMyComments(page: number): Promise<MyCommentsPage> {
  const siteUser = await getSessionSiteUser();

  if (!siteUser) return EMPTY_PAGE;

  const payload = await getPayloadClient();

  const result = await payload.find({
    collection: "comments",
    where: {
      and: [{author: {equals: siteUser.id}}, {status: {equals: "approved"}}],
    },
    sort: "-createdAt",
    page,
    limit: PAGE_SIZE,
    depth: 0,
  });

  return {
    comments: result.docs.map((comment) => ({
      id: comment.id,
      content: comment.content,
      createdAt: comment.createdAt,
      articleId: comment.articleId,
      articleTitle: comment.articleTitle ?? null,
    })),
    page: result.page ?? 1,
    totalPages: result.totalPages,
    totalDocs: result.totalDocs,
  };
}
