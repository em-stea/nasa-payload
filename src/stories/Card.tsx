import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";

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
      {/* Header Section */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Card</h1>
        <p className="text-gray-500 dark:text-[#8D90A0] text-sm mb-6">
          Cards group related content, actions, and media into flexible visual containers.
        </p>

      {/* Best Practices Section */}
      <div>
        <h2 className="text-lg font-bold mb-3">Best practices</h2>
        <ul className="list-disc list-inside space-y-1.5 text-sm text-gray-600 dark:text-[#8D90A0]">
          <li>Use the <code className="font-semibold">media</code> variant for image-heavy content or featured showcases.</li>
          <li>Use the <code className="font-semibold">plain</code> variant for data-dense dashboards, lists, or text-focused items.</li>
          <li>Keep titles concise and limited to 1–2 lines to avoid breaking vertical alignment in grids.</li>
          <li>Compose optional subcomponents like <code className="font-semibold">&lt;Card.Badge&gt;</code> or <code className="font-semibold">&lt;Card.Footer&gt;</code> only when necessary.</li>
        </ul>
      </div>
      </div>


      {/* Dynamic Code Snippet Box */}
      <div className="p-4 rounded-lg bg-gray-900 text-gray-100 border border-gray-800 font-mono text-sm overflow-x-auto">
        <pre className="text-xs sm:text-sm">
          <code>
            {`import { Card } from '@/shared/components/card';

const MyComponent = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    
      {/* Media Card Variant */}
      <Card data={mediaCardData} variant="media" padding="none">
        <Card.Header variant="media">
          <Card.Image />
          ${showMediaBadge ? `<Card.Badge dot={${showMediaDot}} variant="${mediaVariant}" tone="${mediaTone}" className="absolute top-3 left-3" />` : "/* No badge */"}
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

      {/* Plain Card Variant */}
      <Card data={plainCardData} variant="plain" padding="md">
        <Card.Header variant="bar" className="items-center justify-between">
          <Card.Title variant="plain" />
          ${showPlainBadge ? `<Card.Badge dot={${showPlainDot}} variant="${plainVariant}" tone="${plainTone}" />` : "/* No badge */"}
        </Card.Header>
        <Card.Body variant="plain">
          <Card.Description />
        </Card.Body>
        <Card.Footer variant="meta" className="p-0 pt-3">
          <Card.Date />
        </Card.Footer>
      </Card>
    </div>
  );
};`}
          </code>
        </pre>
      </div>

      {/* Interactive Controls */}
      <div>
        <h2 className="text-2xl font-bold mb-2">Interactive Controls</h2>
        <p className="text-gray-500 dark:text-[#8D90A0] mb-6 text-sm">
          Customize the props to update the dynamic code snippet above.
        </p>

        <div className="border border-gray-200 dark:border-[#262626] rounded-xl overflow-hidden bg-gray-50/50 dark:bg-[#12141F]">
          <table className="w-full text-left text-sm table-fixed">
            <thead className="border-b border-gray-200 dark:border-[#262626] text-xs uppercase text-gray-400 font-semibold bg-gray-100/50 dark:bg-[#181826]">
              <tr>
                <th className="py-3 px-4 w-1/5 dark:text-white">Card Variant</th>
                <th className="py-3 px-4 w-1/5 dark:text-white">Badge</th>
                <th className="py-3 px-4 w-1/5 dark:text-white">Dot</th>
                <th className="py-3 px-4 w-1/5 dark:text-white">Badge Variant</th>
                <th className="py-3 px-4 w-1/5 dark:text-white">Badge Tone</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-[#262626]">
              <tr>
                <td className="py-3 px-4 font-semibold">Media</td>
                <td className="py-3 px-4">
                  <input
                    type="checkbox"
                    checked={showMediaBadge}
                    onChange={(e) => setShowMediaBadge(e.target.checked)}
                    className="size-4 accent-blue-600 cursor-pointer"
                  />
                </td>
                <td className="py-3 px-4">
                  <input
                    type="checkbox"
                    checked={showMediaDot}
                    disabled={!showMediaBadge}
                    onChange={(e) => setShowMediaDot(e.target.checked)}
                    className="size-4 accent-blue-600 cursor-pointer disabled:opacity-40"
                  />
                </td>
                <td className="py-3 px-4">
                  <select
                    value={mediaVariant}
                    disabled={!showMediaBadge}
                    onChange={(e) => setMediaVariant(e.target.value as BadgeVariant)}
                    className="bg-white dark:bg-[#181826] border border-gray-300 dark:border-[#262626] rounded px-2 py-1 text-xs focus:outline-none disabled:opacity-40"
                  >
                    <option value="default">default</option>
                    <option value="fulfilled">fulfilled</option>
                    <option value="dark">dark</option>
                  </select>
                </td>
                <td className="py-3 px-4">
                  <select
                    value={mediaTone}
                    disabled={!showMediaBadge}
                    onChange={(e) => setMediaTone(e.target.value as BadgeTone)}
                    className="bg-white dark:bg-[#181826] border border-gray-300 dark:border-[#262626] rounded px-2 py-1 text-xs focus:outline-none disabled:opacity-40"
                  >
                    <option value="blue">blue</option>
                    <option value="neutral">neutral</option>
                    <option value="red">red</option>
                    <option value="orange">orange</option>
                  </select>
                </td>
              </tr>

              <tr>
                <td className="py-3 px-4 font-semibold">Plain</td>
                <td className="py-3 px-4">
                  <input
                    type="checkbox"
                    checked={showPlainBadge}
                    onChange={(e) => setShowPlainBadge(e.target.checked)}
                    className="size-4 accent-blue-600 cursor-pointer"
                  />
                </td>
                <td className="py-3 px-4">
                  <input
                    type="checkbox"
                    checked={showPlainDot}
                    disabled={!showPlainBadge}
                    onChange={(e) => setShowPlainDot(e.target.checked)}
                    className="size-4 accent-blue-600 cursor-pointer disabled:opacity-40"
                  />
                </td>
                <td className="py-3 px-4">
                  <select
                    value={plainVariant}
                    disabled={!showPlainBadge}
                    onChange={(e) => setPlainVariant(e.target.value as BadgeVariant)}
                    className="bg-white dark:bg-[#181826] border border-gray-300 dark:border-[#262626] rounded px-2 py-1 text-xs focus:outline-none disabled:opacity-40"
                  >
                    <option value="default">default</option>
                    <option value="fulfilled">fulfilled</option>
                    <option value="dark">dark</option>
                  </select>
                </td>
                <td className="py-3 px-4">
                  <select
                    value={plainTone}
                    disabled={!showPlainBadge}
                    onChange={(e) => setPlainTone(e.target.value as BadgeTone)}
                    className="bg-white dark:bg-[#181826] border border-gray-300 dark:border-[#262626] rounded px-2 py-1 text-xs focus:outline-none disabled:opacity-40"
                  >
                    <option value="neutral">neutral</option>
                    <option value="blue">blue</option>
                    <option value="red">red</option>
                    <option value="orange">orange</option>
                  </select>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Variants Showcase Section */}
      <div className="space-y-8">
        <h2 className="text-2xl font-bold border-b border-gray-200 dark:border-[#202436] pb-2">
          Variants
        </h2>

        {/* Media Canvas */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
            Media Layout
          </h3>
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
        </div>

        {/* Plain Canvas */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
            Plain Layout
          </h3>
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
        </div>
      </div>
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