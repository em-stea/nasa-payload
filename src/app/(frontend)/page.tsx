import config from '@payload-config'
import { MessageSquare, ShieldAlert, ThumbsUp } from 'lucide-react'
import Link from 'next/link'
import { getPayload } from 'payload'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

export const dynamic = 'force-dynamic'

const countBy = async (status?: 'approved' | 'pending' | 'rejected' | 'spam') => {
  const payload = await getPayload({ config })

  const { totalDocs } = await payload.count({
    collection: 'comments',
    ...(status ? { where: { status: { equals: status } } } : {}),
  })

  return totalDocs
}

export default async function HomePage() {
  const [total, pending, approved, spam] = await Promise.all([
    countBy(),
    countBy('pending'),
    countBy('approved'),
    countBy('spam'),
  ])

  const stats = [
    { icon: MessageSquare, label: 'Comentarios', value: total },
    { icon: ShieldAlert, label: 'Pendientes', value: pending },
    { icon: ThumbsUp, label: 'Aprobados', value: approved },
    { icon: ShieldAlert, label: 'Spam', value: spam },
  ]

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-3xl flex-col justify-center gap-8 px-6 py-16">
      <header className="flex flex-col gap-2">
        <Badge variant="secondary" className="w-fit">
          Payload + Next
        </Badge>
        <h1 className="text-4xl font-semibold tracking-tight">NASA Backoffice</h1>
        <p className="text-muted-foreground">
          Moderación de los comentarios del blog de noticias de la NASA.
        </p>
      </header>

      <Separator />

      <section className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {stats.map(({ icon: Icon, label, value }) => (
          <Card key={label}>
            <CardHeader className="gap-1">
              <CardDescription className="flex items-center gap-1.5">
                <Icon className="size-3.5" aria-hidden />
                {label}
              </CardDescription>
              <CardTitle className="text-3xl tabular-nums">{value}</CardTitle>
            </CardHeader>
          </Card>
        ))}
      </section>

      <Card>
        <CardHeader>
          <CardTitle>Panel de moderación</CardTitle>
          <CardDescription>
            Aprobá, rechazá o marcá como spam desde el admin de Payload.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Button asChild>
            <Link href="/admin/collections/comments">Ver comentarios</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/admin">Ir al admin</Link>
          </Button>
        </CardContent>
      </Card>
    </main>
  )
}
