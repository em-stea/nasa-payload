import type { Metadata } from 'next'
import { Suspense } from 'react'

import { SignInPanel } from '@/features/account/components/sign-in-panel'
import { getSessionIdentity } from '@/features/account/services/site-user'
import { MarkAllRead } from '@/features/notifications/components/mark-all-read'
import { NotificationLink } from '@/features/notifications/components/notification-link'
import { getNotifications } from '@/features/notifications/services/get-notifications'
import { buildArticleHref } from '@/features/news/utils/parse-post'
import type { Notification } from '@/payload-types'
import { Container } from '@/shared/components/container/container'
import { Heading } from '@/shared/components/heading/heading'
import { Text } from '@/shared/components/text/text'
import { cn } from '@/shared/utils/className-builder'
import { toMissionDate } from '@/shared/utils/mission-date'

export const metadata: Metadata = {
  title: 'Notifications',
  description: 'Quién respondió tus comentarios.',
}

export const instant = true

/**
 * Avisos del lector.
 *
 * Hoy todos son del mismo tipo —alguien respondió un comentario tuyo—, así que
 * la lista se pinta directo sin ramificar por `type`. Cuando aparezca el
 * segundo tipo, la fila es el lugar donde se bifurca.
 */
export default function NotificationsPage() {
  return (
    <main className="flex min-h-dvh w-full flex-col items-center bg-background pt-24 pb-32 text-primary-foreground">
      <Container className="flex flex-col items-start gap-8">
        <header className="flex w-full flex-col gap-1.8 border-b border-border pt-20 pb-6">
          <Text variant="body.4" className="flex flex-wrap items-baseline gap-2">
            <span className="text-foreground">SYS.MSG</span>
            <span className="text-basic-500">INCOMING_TRANSMISSIONS</span>
          </Text>

          <Heading as="h1" variant="title.2" className="text-12 leading-13.2 tracking-n0_96">
            Notifications
          </Heading>

          <Text variant="body.1" className="max-w-2xl text-basic-500">
            Cuando alguien responde uno de tus comentarios, te avisamos acá.
          </Text>
        </header>

        <Suspense fallback={<NotificationsSkeleton />}>
          <NotificationsList />
        </Suspense>
      </Container>
    </main>
  )
}

async function NotificationsList() {
  const identity = await getSessionIdentity()

  if (!identity) {
    return (
      <div className="w-full max-w-[600px]">
        <SignInPanel description="Iniciá sesión para ver tus notificaciones." />
      </div>
    )
  }

  const notifications = await getNotifications()
  const unread = notifications.filter((notification) => !notification.read).length

  if (notifications.length === 0) {
    return (
      <div className="w-full max-w-852 border border-dashed border-border bg-card p-6">
        <Text variant="meta.3" className="text-basic-500 uppercase">
          &gt; No incoming transmissions.
        </Text>
      </div>
    )
  }

  return (
    <div className="flex w-full max-w-852 flex-col gap-4">
      <div className="flex items-center justify-between gap-4">
        <Text variant="meta.3" className="text-basic-500 uppercase">
          {unread === 0 ? 'All read' : `${String(unread).padStart(2, '0')} unread`}
        </Text>

        <MarkAllRead disabled={unread === 0} />
      </div>

      <ul className="flex w-full list-none flex-col gap-2">
        {notifications.map((notification) => (
          <NotificationRow key={notification.id} notification={notification} />
        ))}
      </ul>
    </div>
  )
}

function NotificationRow({ notification }: { notification: Notification }) {
  const read = Boolean(notification.read)

  return (
    <li>
      <NotificationLink
        id={notification.id}
        read={read}
        href={`${buildArticleHref(notification.articleId)}#comments`}
        className={cn(
          'flex w-full flex-col gap-2 border bg-card p-4 transition-colors duration-200 hover:border-foreground',
          read ? 'border-border' : 'border-foreground',
        )}
      >
        <div className="flex items-baseline justify-between gap-4 border-b border-border pb-1.25">
          <Text variant="meta.3" className="truncate font-bold text-foreground">
            {!read && (
              <span
                aria-hidden="true"
                className="me-2 inline-block size-2 shrink-0 rounded-full bg-foreground align-middle"
              />
            )}
            {notification.actorName} respondió tu comentario
          </Text>

          <Text variant="meta.3" className="shrink-0 text-basic-500">
            <time dateTime={notification.createdAt}>{toMissionDate(notification.createdAt)}</time>
          </Text>
        </div>

        {notification.excerpt && (
          <Text variant="body.3" className="line-clamp-2 leading-5.25 text-muted-foreground">
            {notification.excerpt}
          </Text>
        )}

        <Text variant="meta.3" className="truncate text-basic-500 uppercase">
          {notification.articleTitle ?? `Entry #${notification.articleId}`}
        </Text>
      </NotificationLink>
    </li>
  )
}

function NotificationsSkeleton() {
  return (
    <div className="flex w-full max-w-852 flex-col gap-2" aria-hidden="true">
      {Array.from({ length: 3 }, (_, index) => (
        <div key={index} className="h-29.5 w-full animate-pulse border border-border bg-card" />
      ))}
    </div>
  )
}
