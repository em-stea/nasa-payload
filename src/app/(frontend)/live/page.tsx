import LiveHero from "@/features/live/components/live-hero";

export default async function LivePage() {
  "use cache";

  return (
    <main className="min-h-dvh text-basic-00">
      <LiveHero />
    </main>
  );
}
