import NextAuth from 'next-auth'
import GitHub from 'next-auth/providers/github'
import Google from 'next-auth/providers/google'

/**
 * Configuración de Auth.js (NextAuth v5).
 *
 * Login sólo por OAuth: Google y GitHub. No hay adapter de base de datos, así
 * que la sesión viaja en un JWT firmado con `AUTH_SECRET` dentro de una cookie
 * httpOnly. Alcanza para saber quién está logueado en el front; si más adelante
 * hay que persistir el usuario en Mongo/Payload, se suma un adapter acá.
 *
 * Las credenciales se infieren de las env vars `AUTH_<PROVIDER>_ID` /
 * `AUTH_<PROVIDER>_SECRET`, por eso los providers se pasan sin argumentos.
 */
export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [Google, GitHub],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    /** Guarda el proveedor usado para poder mostrarlo en el perfil. */
    jwt({ token, account }) {
      if (account) token.provider = account.provider

      return token
    },
    session({ session, token }) {
      if (token.sub) session.user.id = token.sub
      if (typeof token.provider === 'string') session.user.provider = token.provider

      return session
    },
  },
})
