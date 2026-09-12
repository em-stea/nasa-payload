import type { CollectionConfig } from 'payload'

import { authenticated } from '../access'

/**
 * Usuarios del blog (los que comentan), distintos de `users`.
 *
 * `users` es la colección de auth del backoffice: quien entra ahí modera. Acá
 * viven los lectores, que no tienen password ni acceso al admin: se loguean con
 * OAuth vía Auth.js y el documento se crea la primera vez que hacen algo que
 * necesita identidad (comentar, guardar un favorito).
 *
 * `authKey` es `<provider>:<id del provider>`. Es la única clave estable que
 * devuelve Auth.js sin adapter de base de datos —el email puede cambiar y no
 * viene garantizado en todos los providers—, así que es la que usamos para
 * encontrar al usuario en cada request.
 */
export const SiteUsers: CollectionConfig = {
  slug: 'site-users',
  labels: {
    singular: 'Lector',
    plural: 'Lectores',
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'email', 'provider', 'createdAt'],
    listSearchableFields: ['name', 'email', 'authKey'],
    group: 'Comunidad',
    description: 'Usuarios del blog que comentan. No tienen acceso al backoffice.',
  },
  access: {
    // El front entra por Local API (que saltea access control); esto gobierna
    // el REST público y el admin.
    create: authenticated,
    read: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  fields: [
    {
      name: 'authKey',
      type: 'text',
      label: 'Clave de identidad',
      required: true,
      unique: true,
      index: true,
      admin: {
        readOnly: true,
        description: '<provider>:<id del provider OAuth>. La escribe el front, no se edita.',
      },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'name',
          type: 'text',
          label: 'Nombre',
          required: true,
          admin: { width: '50%' },
        },
        {
          name: 'email',
          type: 'email',
          label: 'Email',
          admin: { width: '50%' },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'provider',
          type: 'select',
          label: 'Proveedor',
          required: true,
          index: true,
          options: [
            { label: 'Google', value: 'google' },
            { label: 'GitHub', value: 'github' },
          ],
          admin: { width: '50%' },
        },
        {
          name: 'image',
          type: 'text',
          label: 'Avatar (URL)',
          admin: { width: '50%' },
        },
      ],
    },
  ],
  timestamps: true,
}
