import {getNasaLiveStatus} from "@/features/live/services/get-nasa-live-status";
import {Badge} from "@/shared/components/badge/badge";
import {Container} from "@/shared/components/container/container";
import {Heading} from "@/shared/components/heading/heading";
import {Live} from "@/shared/components/icons/other/live";
import {Text} from "@/shared/components/text/text";

import {LivePlayer} from "./live-player";

const LIVE_STREAM_TITLE = "NASA TV Live Stream";

/**
 * Chequea si NASA está transmitiendo en vivo en YouTube y arma el player.
 *
 * El botón "ON AIR"/"OFFLINE" depende enteramente de `getNasaLiveStatus`: no
 * hay estado de carga en el cliente, la página ya se sirve resuelta.
 */
export default async function LiveHero() {
  const {isLive, videoId} = await getNasaLiveStatus();

  return (
    <section className="w-full border-b border-border bg-basic-960 py-8 sm:py-12">
      <Container className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          {/* Al aire es el rojo invertido del diseño; fuera de aire, el gris. */}
          <Badge tone={isLive ? "light-red" : "neutral"} variant="full-filled">
            <Live className="size-5" /> {isLive ? "ON AIR" : "OFFLINE"}
          </Badge>

          <Heading color="basic-00" variant="title.1">
            {LIVE_STREAM_TITLE}
          </Heading>

          <Text color="basic-300" variant="body.1">
            {isLive
              ? "NASA is broadcasting live right now — tune in for real-time mission coverage."
              : "NASA TV is offline right now. Check back soon for the next live broadcast."}
          </Text>
        </div>

        <div className="w-full overflow-hidden rounded-2xl border border-basic-00-10 bg-basic-950 shadow-card">
          {isLive && videoId ? (
            <LivePlayer title={LIVE_STREAM_TITLE} videoId={videoId} />
          ) : (
            <div className="flex aspect-video w-full flex-col items-center justify-center gap-2 text-center">
              <Live className="size-8 text-basic-500" />
              <Text color="basic-500" variant="body.2">
                No live broadcast right now
              </Text>
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}
