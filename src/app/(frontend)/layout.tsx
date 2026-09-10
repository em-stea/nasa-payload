import type { Metadata } from 'next'
import React from 'react'

import { SpaceGrotesk, JetBrainsMono } from '@/shared/styles/foundations/fonts'
import '@styles/globals.css'

import './nasa-space.css'
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
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
