import type { Access, FieldAccess } from 'payload'

/** Sólo usuarios logueados en el backoffice. */
export const authenticated: Access = ({ req: { user } }) => Boolean(user)

/** Versión a nivel de campo. */
export const authenticatedField: FieldAccess = ({ req: { user } }) => Boolean(user)

/** Cualquiera puede leer, pero los anónimos sólo ven comentarios aprobados. */
export const authenticatedOrApproved: Access = ({ req: { user } }) => {
  if (user) return true

  return {
    status: {
      equals: 'approved',
    },
  }
}
