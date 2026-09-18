import {getNasaLiveStatus} from "@/features/live/services/get-nasa-live-status";
import {Container} from "@/shared/components/container/container";
import {Live} from "@/shared/components/icons/other/live";
import {TextHero} from "@/shared/components/text-hero/text-hero";
import {Text} from "@/shared/components/text/text";

import {LivePlayer} from "./live-player";

const LIVE_STREAM_TITLE = "NASA TV Live Stream";

export default async function LiveHero() {
  const {isLive, videoId} = await getNasaLiveStatus();

  return (
    <section className="w-full border-b border-border bg-basic-960 py-8 sm:py-12">
      <Container className="flex flex-col gap-6">
        <TextHero
          badge={{
            icon: <Live className="size-5" />,
            label: isLive ? "ON AIR" : "OFFLINE",
            isLive,
          }}

          description={
            isLive
              ? "NASA is broadcasting live right now — tune in for real-time mission coverage."
              : "NASA TV is offline right now. Check back soon for the next live broadcast."
          }
          title={`${LIVE_STREAM_TITLE}`}
        />

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
