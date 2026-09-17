import type {Meta, StoryObj} from "@storybook/nextjs-vite";

import {useState} from "react";

import {Card, type CardData} from "@/shared/components/card/card";
import {type BadgeTone, type BadgeVariant} from "@/shared/styles/components/badge";

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
    image:
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop",
    imageAlt: "Media abstract preview",
    title: "Media Card Title",
    description:
      "Card component demonstrating media variant layout with overlays and hover states.",
    stats: [
      {label: "Active Users", value: "24.8K", highlight: true},
      {label: "Growth", value: "+12%"},
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
      {label: "Total Views", value: "102.4K", highlight: false},
      {label: "Conversion", value: "3.4%"},
    ],
  };

  return (
    <div className="min-h-screen space-y-12 bg-white p-8 font-sans text-gray-900 transition-colors duration-200 dark:bg-[#0C0E16] dark:text-[#E1E2ED]">
      {/* Header Section */}

      <h1 className="mb-2 text-3xl font-bold">Card</h1>
      <p className="mb-6 text-sm text-gray-500 dark:text-[#8D90A0]">
        Cards group related content, actions, and media into flexible visual containers.
      </p>

      {/* Best Practices Section */}
      <div className="mb-8">
        <h2 className="mb-3 text-lg font-bold">Best practices</h2>
        <ul className="list-inside list-disc space-y-1.5 text-sm text-gray-600 dark:text-[#8D90A0]">
          <li>
            Use the <code className="font-semibold">media</code> variant for image-heavy content or
            featured showcases.
          </li>
          <li>
            Use the <code className="font-semibold">plain</code> variant for data-dense dashboards,
            lists, or text-focused items.
          </li>
          <li>
            Keep titles concise and limited to 1–2 lines to avoid breaking vertical alignment in
            grids.
          </li>
          <li>
            Compose optional subcomponents like{" "}
            <code className="font-semibold">&lt;Card.Badge&gt;</code> or{" "}
            <code className="font-semibold">&lt;Card.Footer&gt;</code> only when necessary.
          </li>
        </ul>
      </div>

      {/* Dynamic Code Snippet Box */}
      <div className="overflow-x-auto rounded-lg border border-gray-800 bg-gray-900 p-4 font-mono text-sm text-gray-100">
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
        <h2 className="mb-2 text-2xl font-bold">Interactive Controls</h2>
        <p className="mb-6 text-sm text-gray-500 dark:text-[#8D90A0]">
          Customize the props to update the dynamic code snippet above.
        </p>

        <div className="overflow-hidden rounded-xl border border-gray-200 bg-gray-50/50 dark:border-[#262626] dark:bg-[#12141F]">
          <table className="w-full table-fixed text-left text-sm">
            <thead className="border-b border-gray-200 bg-gray-100/50 text-xs font-semibold text-gray-400 uppercase dark:border-[#262626] dark:bg-[#181826]">
              <tr>
                <th className="w-1/5 px-4 py-3 tracking-1 dark:text-white">Card Variant</th>
                <th className="w-1/5 px-4 py-3 tracking-1 dark:text-white">Badge</th>
                <th className="w-1/5 px-4 py-3 tracking-1 dark:text-white">Dot</th>
                <th className="w-1/5 px-4 py-3 tracking-1 dark:text-white">Badge Variant</th>
                <th className="w-1/5 px-4 py-3 tracking-1 dark:text-white">Badge Tone</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-[#262626]">
              <tr>
                <td className="px-4 py-3 font-semibold">Media</td>
                <td className="px-4 py-3">
                  <input
                    checked={showMediaBadge}
                    className="size-4 cursor-pointer accent-blue-600"
                    type="checkbox"
                    onChange={(e) => setShowMediaBadge(e.target.checked)}
                  />
                </td>
                <td className="px-4 py-3">
                  <input
                    checked={showMediaDot}
                    className="size-4 cursor-pointer accent-blue-600 disabled:opacity-40"
                    disabled={!showMediaBadge}
                    type="checkbox"
                    onChange={(e) => setShowMediaDot(e.target.checked)}
                  />
                </td>
                <td className="px-4 py-3">
                  <select
                    className="rounded border border-gray-300 bg-white px-2 py-1 text-xs focus:outline-none disabled:opacity-40 dark:border-[#262626] dark:bg-[#181826]"
                    disabled={!showMediaBadge}
                    value={mediaVariant}
                    onChange={(e) => setMediaVariant(e.target.value as BadgeVariant)}
                  >
                    <option value="default">default</option>
                    <option value="fulfilled">fulfilled</option>
                    <option value="dark">dark</option>
                  </select>
                </td>
                <td className="px-4 py-3">
                  <select
                    className="rounded border border-gray-300 bg-white px-2 py-1 text-xs focus:outline-none disabled:opacity-40 dark:border-[#262626] dark:bg-[#181826]"
                    disabled={!showMediaBadge}
                    value={mediaTone}
                    onChange={(e) => setMediaTone(e.target.value as BadgeTone)}
                  >
                    <option value="blue">blue</option>
                    <option value="neutral">neutral</option>
                    <option value="red">red</option>
                    <option value="orange">orange</option>
                  </select>
                </td>
              </tr>

              <tr>
                <td className="px-4 py-3 font-semibold">Plain</td>
                <td className="px-4 py-3">
                  <input
                    checked={showPlainBadge}
                    className="size-4 cursor-pointer accent-blue-600"
                    type="checkbox"
                    onChange={(e) => setShowPlainBadge(e.target.checked)}
                  />
                </td>
                <td className="px-4 py-3">
                  <input
                    checked={showPlainDot}
                    className="size-4 cursor-pointer accent-blue-600 disabled:opacity-40"
                    disabled={!showPlainBadge}
                    type="checkbox"
                    onChange={(e) => setShowPlainDot(e.target.checked)}
                  />
                </td>
                <td className="px-4 py-3">
                  <select
                    className="rounded border border-gray-300 bg-white px-2 py-1 text-xs focus:outline-none disabled:opacity-40 dark:border-[#262626] dark:bg-[#181826]"
                    disabled={!showPlainBadge}
                    value={plainVariant}
                    onChange={(e) => setPlainVariant(e.target.value as BadgeVariant)}
                  >
                    <option value="default">default</option>
                    <option value="fulfilled">fulfilled</option>
                    <option value="dark">dark</option>
                  </select>
                </td>
                <td className="px-4 py-3">
                  <select
                    className="rounded border border-gray-300 bg-white px-2 py-1 text-xs focus:outline-none disabled:opacity-40 dark:border-[#262626] dark:bg-[#181826]"
                    disabled={!showPlainBadge}
                    value={plainTone}
                    onChange={(e) => setPlainTone(e.target.value as BadgeTone)}
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
        <h2 className="border-b border-gray-200 pb-2 text-2xl font-bold dark:border-[#202436]">
          Variants
        </h2>

        {/* Media Canvas */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold tracking-wider text-gray-500 uppercase dark:text-white">
            Media Layout
          </h3>
          <div className="flex items-center justify-center rounded-2xl border border-gray-200 bg-gray-50/30 p-8 dark:border-[#202436] dark:bg-[#12141F]">
            <div className="w-80">
              <Card data={mediaCardData} padding="none" variant="media">
                <Card.Header variant="media">
                  <Card.Image />
                  {showMediaBadge && (
                    <Card.Badge
                      className="absolute top-3 left-3 font-mono text-xs"
                      dot={showMediaDot}
                      variant={mediaVariant}
                    />
                  )}
                </Card.Header>
                <Card.Body variant="media">
                  <Card.Title variant="media">{mediaCardData.title}</Card.Title>
                  <Card.Description />
                </Card.Body>
                <Card.Footer className="px-4" variant="stats">
                  <Card.Stat index={0} layout="stacked" />
                  <Card.Stat index={1} layout="stacked" />
                </Card.Footer>
              </Card>
            </div>
          </div>
        </div>

        {/* Plain Canvas */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold tracking-wider text-gray-500 uppercase dark:text-white">
            Plain Layout
          </h3>
          <div className="flex items-center justify-center rounded-2xl border border-gray-200 bg-gray-50/30 p-8 dark:border-[#202436] dark:bg-[#12141F]">
            <div className="w-80">
              <Card data={plainCardData} padding="md" variant="plain">
                <Card.Header className="items-center justify-between" variant="bar">
                  <Card.Title variant="plain" />
                  {showPlainBadge && (
                    <Card.Badge
                      className="font-mono text-xs"
                      dot={showPlainDot}
                      variant={plainVariant}
                    />
                  )}
                </Card.Header>
                <Card.Body variant="plain">
                  <Card.Description />
                </Card.Body>
                <Card.Footer className="p-0 pt-3" variant="meta">
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
