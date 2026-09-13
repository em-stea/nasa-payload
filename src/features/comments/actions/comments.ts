"use server";

import type {CommentActionState} from "@/features/comments/actions/state";

import {refresh} from "next/cache";
import {z} from "zod";

import {requireSiteUser} from "@/features/account/services/site-user";
import {getPayloadClient} from "@/shared/services/payload";

const MIN_LENGTH = 2;
const MAX_LENGTH = 2000;

const createSchema = z.object({
  articleId: z.string().min(1),
  articleTitle: z.string().optional(),
  articleUrl: z.string().optional(),
  parentId: z.string().optional(),
  content: z
    .string()
    .trim()
    .min(MIN_LENGTH, `El comentario necesita al menos ${MIN_LENGTH} caracteres.`)
    .max(MAX_LENGTH, `El comentario no puede superar los ${MAX_LENGTH} caracteres.`),
});

function readForm(formData: FormData) {
  const value = (name: string) => {
    const raw = formData.get(name);

    return typeof raw === "string" && raw.length > 0 ? raw : undefined;
  };

  return {
    articleId: value("articleId") ?? "",
    articleTitle: value("articleTitle"),
    articleUrl: value("articleUrl"),
    parentId: value("parentId"),
    content: value("content") ?? "",
  };
}

/**
 * Publica un comentario o una respuesta.
 *
 * Las server actions también se alcanzan por POST directo, así que la sesión se
 * resuelve acá adentro y nada de lo que viaja en el form decide quién firma:
 * el autor sale siempre de la cookie.
 *
 * Entra como `approved` porque el lector ya está identificado por OAuth; la
 * moderación del backoffice pasa a ser posterior (rechazar o marcar spam saca
 * el comentario del hilo).
 */
export async function createComment(
  _state: CommentActionState,
  formData: FormData,
): Promise<CommentActionState> {
  const parsed = createSchema.safeParse(readForm(formData));

  if (!parsed.success) {
    return {status: "error", message: parsed.error.issues[0]?.message ?? "Revisá el comentario."};
  }

  let siteUser;

  try {
    siteUser = await requireSiteUser();
  } catch {
    return {status: "error", message: "Necesitás iniciar sesión para comentar."};
  }

  const payload = await getPayloadClient();
  const {articleId, articleTitle, articleUrl, parentId, content} = parsed.data;

  try {
    await payload.create({
      collection: "comments",
      data: {
        articleId,
        articleTitle,
        articleUrl,
        authorName: siteUser.name,
        authorEmail: siteUser.email ?? `${siteUser.authKey}@lector.invalid`,
        author: siteUser.id,
        content,
        parent: parentId,
        status: "approved",
      },
      depth: 0,
    });
  } catch (error) {
    payload.logger.error({err: error, msg: "No se pudo guardar el comentario"});

    return {status: "error", message: "No pudimos guardar tu comentario. Probá de nuevo."};
  }

  refresh();

  return {status: "success", formKey: Date.now()};
}
