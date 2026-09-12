import type { CollectionConfig } from 'payload'

import { authenticated } from '../access'

/**
 * Guardados de un lector.
 *
 * La card se guarda desnormalizada (título, imagen, tag) a propósito: la
 * pantalla de favoritos lista items de fuentes distintas —hoy noticias del WP
 * de nasa.gov, mañana la APOD— y no queremos que pintar la lista dispare N
 * llamadas a APIs externas que además pueden haber movido el artículo.
 *
 * `kind` es lo que deja convivir esas fuentes: la unicidad es por
 * (user, kind, itemId).
 */
export const Favorites: CollectionConfig = {
  slug: 'favorites',
  labels: {
    singular: 'Favorito',
    plural: 'Favoritos',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'kind', 'user', 'createdAt'],
    listSearchableFields: ['title', 'itemId'],
    group: 'Comunidad',
  },
  access: {
    create: authenticated,
    read: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  fields: [
    {
      name: 'user',
      type: 'relationship',
      label: 'Lector',
      relationTo: 'site-users',
      hasMany: false,
      required: true,
      index: true,
    },
    {
      type: 'row',
      fields: [
        {
          name: 'kind',
          type: 'select',
          label: 'Tipo',
          required: true,
          defaultValue: 'news',
          index: true,
          options: [
            { label: 'Noticia', value: 'news' },
            { label: 'APOD', value: 'apod' },
          ],
          admin: { width: '50%' },
        },
        {
          name: 'itemId',
          type: 'text',
          label: 'ID del item',
          required: true,
          index: true,
          admin: { width: '50%' },
        },
      ],
    },
    {
      name: 'title',
      type: 'text',
      label: 'Título',
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Bajada',
      maxLength: 500,
    },
    {
      type: 'row',
      fields: [
        {
          name: 'image',
          type: 'text',
          label: 'Imagen (URL)',
          admin: { width: '50%' },
        },
        {
          name: 'href',
          type: 'text',
          label: 'Link interno',
          admin: { width: '50%' },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'tag',
          type: 'text',
          label: 'Tag',
          admin: { width: '50%' },
        },
        {
          name: 'tone',
          type: 'select',
          label: 'Color del tag',
          defaultValue: 'blue',
          options: [
            { label: 'Blue', value: 'blue' },
            { label: 'Red', value: 'red' },
            { label: 'Orange', value: 'orange' },
          ],
          admin: { width: '50%' },
        },
      ],
    },
  ],
  timestamps: true,
}
