import type { Metadata } from 'next'
import React from 'react'

import { SiteFooter } from '@/shared/components/footer/site-footer'
import { SiteNavbar } from '@/shared/components/navbar/site-navbar'
import { Toaster } from '@/shared/components/toast/toaster'
import { SpaceGrotesk, JetBrainsMono } from '@/shared/styles/foundations/fonts'
import '@styles/globals.css'

import { SessionProvider } from 'next-auth/react'
import { ThemeProvider } from 'next-themes'

export const metadata: Metadata = {
  description: 'Blog de noticias espaciales de la NASA. Próximamente.',
  title: 'NASA — Blog',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const fonts = `${SpaceGrotesk.variable} ${JetBrainsMono.variable}`

  return (
    <html className={fonts} lang="es" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="data-theme"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {/* La sesión se resuelve en el cliente contra /api/auth/session: con
              `cacheComponents` activo, leer la cookie acá arriba obligaría a
              envolver todo el layout en Suspense y sacrificaría el shell
              estático de cada ruta. */}
          <SessionProvider>
            <SiteNavbar />
            {children}
            <SiteFooter />
            <Toaster />
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
