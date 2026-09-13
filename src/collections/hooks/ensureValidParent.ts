import type {Comment} from "../../payload-types";
import type {CollectionBeforeValidateHook} from "payload";

import {APIError} from "payload";

import {toId} from "./to-id";

/** Tope de saltos al recorrer la cadena de ancestros, por las dudas. */
const MAX_ANCESTOR_LOOKUPS = 50;

/**
 * Mantiene sana la relación padre/hijo entre comentarios:
 * - un comentario no puede responderse a sí mismo,
 * - la respuesta hereda el artículo del comentario padre,
 * - no se pueden armar ciclos (A responde a B y B a A).
 */
export const ensureValidParent: CollectionBeforeValidateHook<Comment> = async ({
  data,
  originalDoc,
  req,
}) => {
  if (!data) return data;

  const parentId = toId(data.parent);

  if (!parentId) return data;

  const selfId = toId(originalDoc?.id);

  if (selfId && parentId === selfId) {
    throw new APIError("Un comentario no puede ser respuesta de sí mismo.", 400);
  }

  const parent = await req.payload.findByID({
    collection: "comments",
    id: parentId,
    depth: 0,
    req,
  });

  // La respuesta siempre pertenece al mismo artículo que el comentario padre.
  data.articleId = parent.articleId;
  data.articleTitle = parent.articleTitle;
  data.articleUrl = parent.articleUrl;

  if (!selfId) return data;

  let ancestorId = toId(parent.parent);
  let hops = 0;

  while (ancestorId) {
    if (ancestorId === selfId) {
      throw new APIError("Esa respuesta generaría un ciclo entre comentarios.", 400);
    }

    if (++hops > MAX_ANCESTOR_LOOKUPS) {
      throw new APIError("La cadena de respuestas es demasiado profunda.", 400);
    }

    const ancestor = await req.payload.findByID({
      collection: "comments",
      id: ancestorId,
      depth: 0,
      req,
    });

    ancestorId = toId(ancestor.parent);
  }

  return data;
};
