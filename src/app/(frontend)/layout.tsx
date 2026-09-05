import type { Metadata } from 'next'
import React from 'react'

import './globals.css'

export const metadata: Metadata = {
  description: 'Blog de noticias espaciales de la NASA. Próximamente.',
  title: 'NASA — Blog',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className="min-h-dvh bg-[#04060f] antialiased">{children}</body>
    </html>
  )
}
