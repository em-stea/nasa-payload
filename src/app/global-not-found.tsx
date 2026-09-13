import type { Metadata } from 'next'

import { NotFoundScreen } from '@/features/not-found/components/not-found-screen'
import { JetBrainsMono, SpaceGrotesk } from '@/shared/styles/foundations/fonts'
import '@styles/globals.css'

/**
 * El 404 de las URLs que no matchean ninguna ruta.
 *
 * El proyecto tiene dos root layouts —el del sitio y el de Payload—, así que no
 * hay un `layout` común donde colgar un `not-found` global: Next resuelve este
 * caso con `global-not-found`, que se saltea el render de layouts y por eso
 * tiene que traerse el documento entero, los estilos y las fuentes.
 *
 * Sin `ThemeProvider`: la escena es un cielo nocturno en cualquier tema, y el
 * provider arrastraría la sesión y el resto del chrome del sitio a una página
 * que no los usa.
 */

export const metadata: Metadata = {
  description: 'Estas coordenadas no existen. La página que buscabas no está acá.',
  title: '404 — Off the star chart',
}

export default function GlobalNotFound() {
  const fonts = `${SpaceGrotesk.variable} ${JetBrainsMono.variable}`

  return (
    <html className={fonts} data-theme="dark" lang="es">
      <body>
        <NotFoundScreen />
      </body>
    </html>
  )
}
