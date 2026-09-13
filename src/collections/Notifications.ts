import type {CollectionConfig} from "payload";

import {authenticated} from "../access";

/**
 * Avisos para el lector. Hoy hay un solo disparador —alguien respondió tu
 * comentario—, pero el `type` deja lugar a los que vengan.
 *
 * Todo lo que la lista necesita para pintarse (quién, qué dijo, en qué nota)
 * queda copiado en el documento en vez de resolverse por relación: una
 * notificación es el registro de algo que pasó, y tiene que seguir leyéndose
 * igual aunque después borren el comentario que la originó.
 */
export const Notifications: CollectionConfig = {
  slug: "notifications",
  labels: {
    singular: "Notificación",
    plural: "Notificaciones",
  },
  admin: {
    useAsTitle: "actorName",
    defaultColumns: ["actorName", "type", "user", "read", "createdAt"],
    group: "Comunidad",
  },
  access: {
    create: authenticated,
    read: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  fields: [
    {
      name: "user",
      type: "relationship",
      label: "Destinatario",
      relationTo: "site-users",
      hasMany: false,
      required: true,
      index: true,
    },
    {
      type: "row",
      fields: [
        {
          name: "type",
          type: "select",
          label: "Tipo",
          required: true,
          defaultValue: "reply",
          options: [{label: "Respuesta a un comentario", value: "reply"}],
          admin: {width: "50%"},
        },
        {
          name: "read",
          type: "checkbox",
          label: "Leída",
          defaultValue: false,
          index: true,
          admin: {width: "50%"},
        },
      ],
    },
    {
      name: "actorName",
      type: "text",
      label: "Quién la disparó",
      required: true,
    },
    {
      name: "excerpt",
      type: "textarea",
      label: "Fragmento",
      maxLength: 300,
    },
    {
      type: "row",
      fields: [
        {
          name: "articleId",
          type: "text",
          label: "ID del artículo",
          required: true,
          admin: {width: "50%"},
        },
        {
          name: "articleTitle",
          type: "text",
          label: "Título del artículo",
          admin: {width: "50%"},
        },
      ],
    },
    {
      name: "comment",
      type: "relationship",
      label: "Respuesta",
      relationTo: "comments",
      hasMany: false,
      admin: {position: "sidebar"},
    },
    {
      name: "parent",
      type: "relationship",
      label: "Comentario respondido",
      relationTo: "comments",
      hasMany: false,
      admin: {position: "sidebar"},
    },
  ],
  timestamps: true,
};
