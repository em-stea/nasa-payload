import config from '@payload-config'
import Link from 'next/link'
import { getPayload } from 'payload'
import React from 'react'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const payload = await getPayload({ config })

  const { totalDocs: pending } = await payload.count({
    collection: 'comments',
    where: { status: { equals: 'pending' } },
  })

  return (
    <div className="home">
      <h1>NASA Backoffice</h1>
      <p>Moderación de comentarios del blog.</p>
      <p>
        {pending} comentario{pending === 1 ? '' : 's'} pendiente{pending === 1 ? '' : 's'}.
      </p>
      <Link href="/admin">Ir al panel</Link>
    </div>
  )
}
