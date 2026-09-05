import React from 'react'
import './styles.css'

export const metadata = {
  description: 'Backoffice de comentarios del blog de noticias de la NASA.',
  title: 'NASA Backoffice',
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html lang="es">
      <body>
        <main>{children}</main>
      </body>
    </html>
  )
}
