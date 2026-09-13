import type {Comment} from "../../payload-types";
import type {CollectionAfterDeleteHook} from "payload";

/**
 * Al borrar un comentario borra también sus respuestas.
 * Como el hook se dispara por cada documento eliminado, el borrado baja
 * recursivamente por todo el hilo y no quedan comentarios huérfanos.
 */
export const deleteReplies: CollectionAfterDeleteHook<Comment> = async ({id, req}) => {
  await req.payload.delete({
    collection: "comments",
    where: {
      parent: {
        equals: id,
      },
    },
    depth: 0,
    req,
  });
};
