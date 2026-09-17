import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";

import { Card, type CardData } from "@/shared/components/card/card";
import { type BadgeTone, type BadgeVariant } from "@/shared/styles/components/badge";

export const CardsPage = () => {
  // Controles MEDIA
  const [showMediaBadge, setShowMediaBadge] = useState<boolean>(true);
  const [showMediaDot, setShowMediaDot] = useState<boolean>(true);
  const [mediaTone, setMediaTone] = useState<BadgeTone>("blue");
  const [mediaVariant, setMediaVariant] = useState<BadgeVariant>("default");

  // Controles PLAIN
  const [showPlainBadge, setShowPlainBadge] = useState<boolean>(true);
  const [showPlainDot, setShowPlainDot] = useState<boolean>(true);
  const [plainTone, setPlainTone] = useState<BadgeTone>("red");
  const [plainVariant, setPlainVariant] = useState<BadgeVariant>("default");

  // Datos Media
  const mediaCardData: CardData = {
    tag: showMediaBadge ? "HIGH ALERT" : undefined,
    tone: mediaTone,
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop",
    imageAlt: "Media abstract preview",
    title: "Media Card Title",
    description: "Card component demonstrating media variant layout with overlays and hover states.",
    stats: [
      { label: "Active Users", value: "24.8K", highlight: true },
      { label: "Growth", value: "+12%" },
    ],
  };

  // Datos Plain
  const plainCardData: CardData = {
    tag: showPlainBadge ? "FEATURED" : undefined,
    tone: plainTone,
    title: "Plain Card Title",
    description: "Plain layout variant focusing on typography, stats, and metadata structure.",
    date: "Sept 16, 2026",
    dateTime: "2026-09-16",
    stats: [
      { label: "Total Views", value: "102.4K", highlight: false },
      { label: "Conversion", value: "3.4%" },
    ],
  };

  return (
    <div className="min-h-screen p-8 bg-white dark:bg-[#0C0E16] text-gray-900 dark:text-[#E1E2ED] font-sans space-y-12 transition-colors duration-200">
      <div>
        <h1 className="text-3xl font-bold mb-2">Card System Showcase</h1>
        <p className="text-gray-500 dark:text-[#8D90A0] text-sm">
          Interactive showcase demonstrating Media and Plain Card variants.
        </p>
        <p className="text-xs text-gray-400 dark:text-[#6C6F80] mt-1 italic">
            Note: Subcomponents like <code className="not-italic font-semibold">&lt;Card.Badge&gt;</code> and <code className="not-italic font-semibold">&lt;Card.Footer&gt;</code> are optional.
        </p>
      </div>

      {/* Plain Card Code Snippet */}
      <div className="mb-8 p-4 rounded-lg bg-gray-900 text-gray-100 border border-gray-800 font-mono text-sm flex justify-between items-center overflow-x-auto">
      <pre className="text-xs sm:text-sm">
    <code>
{`<Card data={plainCardData} variant="plain" padding="md">
  <Card.Header variant="bar" className="items-center justify-between">
    <Card.Title variant="plain" />
    ${showPlainBadge ? `<Card.Badge dot={${showPlainDot}} variant="${plainVariant}" tone="${plainTone}" />` : ""}
  </Card.Header>
  <Card.Body variant="plain">
    <Card.Description />
  </Card.Body>
  <Card.Footer variant="meta" className="p-0 pt-3">
    <Card.Date />
  </Card.Footer>
</Card>`}
    </code>
  </pre>
    </div>

      {/* ================= SECCIÓN 1: MEDIA ================= */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white border-b border-gray-200 dark:border-[#202436] pb-2">
          Media Variant
        </h2>

        {/* Row de controles Media */}
        <div className="flex flex-wrap items-center gap-6 p-4 rounded-xl border border-gray-200 dark:border-[#262626] bg-gray-50/50 dark:bg-[#12141F]">
          <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold uppercase text-gray-500 dark:text-white">
            <input
              type="checkbox"
              checked={showMediaBadge}
              onChange={(e) => setShowMediaBadge(e.target.checked)}
              className="rounded border-gray-300 dark:border-[#262626] text-indigo-600 focus:ring-indigo-500 h-4 w-4"
            />
            Show Badge (Top-Left)
          </label>

          <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold uppercase text-gray-500 dark:text-white">
            <input
              type="checkbox"
              checked={showMediaDot}
              disabled={!showMediaBadge}
              onChange={(e) => setShowMediaDot(e.target.checked)}
              className="rounded border-gray-300 dark:border-[#262626] text-indigo-600 focus:ring-indigo-500 h-4 w-4 disabled:opacity-40"
            />
            Show Dot
          </label>

          <div className="flex items-center gap-2">
            <label className="text-xs font-semibold uppercase text-gray-500 dark:text-white">Variant:</label>
            <select
              value={mediaVariant}
              disabled={!showMediaBadge}
              onChange={(e) => setMediaVariant(e.target.value as BadgeVariant)}
              className="bg-white dark:bg-[#181826] border border-gray-300 dark:border-[#262626] rounded px-3 py-1 text-xs focus:outline-none disabled:opacity-40"
            >
              <option value="default">default</option>
              <option value="fulfilled">fulfilled</option>
              <option value="dark">dark</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-xs font-semibold uppercase text-gray-500 dark:text-white">Tone:</label>
            <select
              value={mediaTone}
              disabled={!showMediaBadge}
              onChange={(e) => setMediaTone(e.target.value as BadgeTone)}
              className="bg-white dark:bg-[#181826] border border-gray-300 dark:border-[#262626] rounded px-3 py-1 text-xs focus:outline-none disabled:opacity-40"
            >
              <option value="blue">blue</option>
              <option value="neutral">neutral</option>
              <option value="red">red</option>
              <option value="orange">orange</option>
            </select>
          </div>
        </div>

        {/* Canvas Media */}
        <div className="border border-gray-200 dark:border-[#202436] rounded-2xl p-8 flex justify-center items-center bg-gray-50/30 dark:bg-[#12141F]">
          <div className="w-80">
            <Card data={mediaCardData} variant="media" padding="none">
              <Card.Header variant="media">
                <Card.Image />
                {showMediaBadge && (
                    <Card.Badge
                    dot={showMediaDot}
                    variant={mediaVariant}
                    className="absolute top-3 left-3"
                    />
                )}
              </Card.Header>
              <Card.Body variant="media">
                <Card.Title variant="media">{mediaCardData.title}</Card.Title>
                <Card.Description />
              </Card.Body>
              <Card.Footer variant="stats" className="px-4">
                <Card.Stat index={0} layout="stacked" />
                <Card.Stat index={1} layout="stacked" />
              </Card.Footer>
            </Card>
          </div>
        </div>
      </section>

      {/* ================= SECCIÓN 2: PLAIN ================= */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white border-b border-gray-200 dark:border-[#202436] pb-2">
          Plain Variant
        </h2>

        {/* Row de controles Plain */}
        <div className="flex flex-wrap items-center gap-6 p-4 rounded-xl border border-gray-200 dark:border-[#262626] bg-gray-50/50 dark:bg-[#12141F]">
          <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold uppercase text-gray-500 dark:text-white">
            <input
              type="checkbox"
              checked={showPlainBadge}
              onChange={(e) => setShowPlainBadge(e.target.checked)}
              className="rounded border-gray-300 dark:border-[#262626] text-indigo-600 focus:ring-indigo-500 h-4 w-4"
            />
            Show Badge (Top-Right)
          </label>

          <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold uppercase text-gray-500 dark:text-white">
            <input
              type="checkbox"
              checked={showPlainDot}
              disabled={!showPlainBadge}
              onChange={(e) => setShowPlainDot(e.target.checked)}
              className="rounded border-gray-300 dark:border-[#262626] text-indigo-600 focus:ring-indigo-500 h-4 w-4 disabled:opacity-40"
            />
            Show Dot
          </label>

          <div className="flex items-center gap-2">
            <label className="text-xs font-semibold uppercase text-gray-500 dark:text-white">Variant:</label>
            <select
              value={plainVariant}
              disabled={!showPlainBadge}
              onChange={(e) => setPlainVariant(e.target.value as BadgeVariant)}
              className="bg-white dark:bg-[#181826] border border-gray-300 dark:border-[#262626] rounded px-3 py-1 text-xs focus:outline-none disabled:opacity-40"
            >
              <option value="default">default</option>
              <option value="fulfilled">fulfilled</option>
              <option value="dark">dark</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-xs font-semibold uppercase text-gray-500 dark:text-white">Tone:</label>
            <select
              value={plainTone}
              disabled={!showPlainBadge}
              onChange={(e) => setPlainTone(e.target.value as BadgeTone)}
              className="bg-white dark:bg-[#181826] border border-gray-300 dark:border-[#262626] rounded px-3 py-1 text-xs focus:outline-none disabled:opacity-40"
            >
              <option value="neutral">neutral</option>
              <option value="blue">blue</option>
              <option value="red">red</option>
              <option value="orange">orange</option>
            </select>
          </div>
        </div>

        {/* Canvas Plain */}
        <div className="border border-gray-200 dark:border-[#202436] rounded-2xl p-8 flex justify-center items-center bg-gray-50/30 dark:bg-[#12141F]">
          <div className="w-80">
            <Card data={plainCardData} variant="plain" padding="md">
              <Card.Header variant="bar" className="items-center justify-between">
                <Card.Title variant="plain" />
                {showPlainBadge && (
                  <Card.Badge
                    dot={showPlainDot}
                    variant={plainVariant}
                  />
                )}
              </Card.Header>
              <Card.Body variant="plain">
                <Card.Description />
              </Card.Body>
              <Card.Footer variant="meta" className="p-0 pt-3">
                <Card.Date />
              </Card.Footer>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

const meta: Meta<typeof CardsPage> = {
  title: "Foundations/Card",
  component: CardsPage,
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;

type Story = StoryObj<typeof CardsPage>;
export const Default: Story = {};