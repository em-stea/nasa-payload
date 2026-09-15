import type {Metadata} from "next";

import LiveHero from "@/features/live/components/live-hero";

export const metadata: Metadata = {
  title: "NASA TV Live",
  description: "Mirá la transmisión en vivo de NASA TV y enterate si está al aire ahora mismo.",
};

export default async function LivePage() {
  "use cache";

  return (
    <main className="min-h-dvh text-basic-00">
      <LiveHero />
    </main>
  );
}
