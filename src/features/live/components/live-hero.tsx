import { getNasaLiveStatus } from '@/features/live/services/get-nasa-live-status'
import { Badge } from '@/shared/components/badge/badge'
import { Container } from '@/shared/components/container/container'
import { Heading } from '@/shared/components/heading/heading'
import { Live } from '@/shared/components/icons/other/live'
import { Text } from '@/shared/components/text/text'
import { LivePlayer } from './live-player'

const LIVE_STREAM_TITLE = 'NASA TV Live Stream'

/**
 * Chequea si NASA está transmitiendo en vivo en YouTube y arma el player.
 *
 * El botón "ON AIR"/"OFFLINE" depende enteramente de `getNasaLiveStatus`: no
 * hay estado de carga en el cliente, la página ya se sirve resuelta.
 */
export default async function LiveHero() {
  const { isLive, videoId } = await getNasaLiveStatus()

  return (
    <section className="w-full border-b border-border bg-basic-960 py-8 sm:py-12">
      <Container className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <Badge
            variant={isLive ? 'destructive' : undefined}
            className={isLive ? '' : 'border-transparent bg-muted text-muted-foreground'}
          >
            <Live className="size-5" /> {isLive ? 'ON AIR' : 'OFFLINE'}
          </Badge>

          <Heading variant="title.1" color="basic-00">
            {LIVE_STREAM_TITLE}
          </Heading>

          <Text variant="body.1" color="basic-300">
            {isLive
              ? 'NASA is broadcasting live right now — tune in for real-time mission coverage.'
              : 'NASA TV is offline right now. Check back soon for the next live broadcast.'}
          </Text>
        </div>

        <div className="w-full overflow-hidden rounded-2xl border border-basic-00-10 bg-basic-950 shadow-card">
          {isLive && videoId ? (
            <LivePlayer videoId={videoId} title={LIVE_STREAM_TITLE} />
          ) : (
            <div className="flex aspect-video w-full flex-col items-center justify-center gap-2 text-center">
              <Live className="size-8 text-basic-500" />
              <Text variant="body.2" color="basic-500">
                No live broadcast right now
              </Text>
            </div>
          )}
        </div>
      </Container>
    </section>
  )
}
