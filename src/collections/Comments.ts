import type {CollectionConfig, Where} from "payload";

import {authenticated, authenticatedField, authenticatedOrApproved} from "../access";
import {deleteCommentNotifications} from "./hooks/deleteCommentNotifications";
import {deleteReplies} from "./hooks/deleteReplies";
import {ensureValidParent} from "./hooks/ensureValidParent";
import {notifyReply} from "./hooks/notifyReply";

export const Comments: CollectionConfig = {
  slug: "comments",
  labels: {
    singular: "Comment",
    plural: "Comments",
  },
  admin: {
    useAsTitle: "authorName",
    defaultColumns: ["authorName", "content", "status", "articleTitle", "createdAt"],
    listSearchableFields: ["authorName", "authorEmail", "content", "articleId"],
    group: "Moderación",
  },
  access: {
    create: () => true,
    read: authenticatedOrApproved,
    update: authenticated,
    delete: authenticated,
  },
  hooks: {
    beforeValidate: [ensureValidParent],
    afterChange: [notifyReply],
    afterDelete: [deleteReplies, deleteCommentNotifications],
  },
  fields: [
    {
      type: "row",
      fields: [
        {
          name: "articleId",
          type: "text",
          label: "ID del artículo",
          required: true,
          index: true,
          admin: {
            description: "Identificador de la noticia de la NASA a la que pertenece el comentario.",
            width: "50%",
          },
        },
        {
          name: "articleUrl",
          type: "text",
          label: "URL del artículo",
          admin: {
            description: "Opcional, para poder abrir la noticia desde el backoffice.",
            width: "50%",
          },
        },
      ],
    },
    {
      name: "articleTitle",
      type: "text",
      label: "Título del artículo",
      admin: {
        description: "Copia del titular al momento de comentar, para leer la lista sin salir.",
      },
    },
    {
      type: "row",
      fields: [
        {
          name: "authorName",
          type: "text",
          label: "Nombre",
          required: true,
          admin: {width: "50%"},
        },
        {
          name: "authorEmail",
          type: "email",
          label: "Email",
          required: true,
          access: {
            // El email nunca sale en la API pública.
            read: authenticatedField,
          },
          admin: {width: "50%"},
        },
      ],
    },
    {
      name: "author",
      type: "relationship",
      label: "Lector",
      relationTo: "site-users",
      hasMany: false,
      index: true,
      admin: {
        description: "Vacío en los comentarios cargados a mano desde el backoffice.",
        position: "sidebar",
      },
    },
    {
      name: "content",
      type: "textarea",
      label: "Comentario",
      required: true,
      maxLength: 5000,
    },
    {
      name: "parent",
      type: "relationship",
      label: "Respuesta a",
      relationTo: "comments",
      hasMany: false,
      index: true,
      filterOptions: ({data, id}): Where => {
        const and: Where[] = [{articleId: {equals: data?.articleId}}];

        if (id) and.push({id: {not_equals: id}});

        return {and};
      },
      admin: {
        description: "Dejalo vacío si es un comentario de primer nivel.",
        position: "sidebar",
      },
    },
    {
      name: "replies",
      type: "join",
      label: "Respuestas",
      collection: "comments",
      on: "parent",
      admin: {
        defaultColumns: ["authorName", "content", "status", "createdAt"],
      },
    },
    {
      name: "status",
      type: "select",
      label: "Estado",
      required: true,
      defaultValue: "pending",
      index: true,
      options: [
        {label: "Pendiente", value: "pending"},
        {label: "Aprobado", value: "approved"},
        {label: "Rechazado", value: "rejected"},
        {label: "Spam", value: "spam"},
      ],
      access: {
        create: authenticatedField,
        update: authenticatedField,
      },
      admin: {
        position: "sidebar",
      },
    },
  ],
  timestamps: true,
};
