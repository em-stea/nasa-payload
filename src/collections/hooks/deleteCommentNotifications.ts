import type {Comment} from "../../payload-types";
import type {CollectionAfterDeleteHook} from "payload";

/**
 * Limpia las notificaciones que apuntan a un comentario borrado, sea porque
 * era la respuesta o porque era el comentario respondido. Sin esto la lista de
 * notificaciones queda linkeando a hilos que ya no existen.
 */
export const deleteCommentNotifications: CollectionAfterDeleteHook<Comment> = async ({id, req}) => {
  await req.payload.delete({
    collection: "notifications",
    where: {
      or: [{comment: {equals: id}}, {parent: {equals: id}}],
    },
    depth: 0,
    req,
  });
};
