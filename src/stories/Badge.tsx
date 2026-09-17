/* eslint-disable react/no-unescaped-entities */
import {cva, type VariantProps} from "class-variance-authority";
import {useState} from "react";

export type BadgeTone = "blue" | "red" | "light-red" | "neutral" | "orange";

export type BadgeVariant = "full-filled" | "default" | "dark";

const commonClassnames = [
  "text-xs",
  "uppercase",
  "tracking-wider",
  "inline-flex",
  "w-fit",
  "shrink-0",
  "items-center",
  "justify-center",
  "gap-2",
  "overflow-hidden",
  "rounded-lg",
  "border",
  "px-3",
  "py-1",
  "whitespace-nowrap",
  "transition-colors",
  "[&>svg]:pointer-events-none",
  "[&>svg]:size-3",
  "font-mono",
  "font-normal",
];

export const badgeVariants = cva(commonClassnames, {
  variants: {
    variant: {
      "full-filled": [],
      default: [
        "border-basic-00-10",
        "bg-basic-700",
        "text-2.5",
        "leading-3.75",
        "tracking-0.5",
        "uppercase",
      ],
      dark: ["border-gray-200", "bg-basic-950", "px-3", "py-2.5"],
    },
    tone: {
      blue: "",
      red: "",
      "light-red": "",
      neutral: "",
      orange: "",
      default: "",
    },
    position: {
      "top-left": "absolute top-4 left-4",
      relative: "",
    },
  },
  compoundVariants: [
    {
      variant: "full-filled",
      tone: "blue",
      class: "border-blue-200-30 bg-blue-700-20 text-foreground",
    },
    {
      variant: "full-filled",
      tone: "red",
      class: "border border-destructive bg-red-700-20 text-destructive dark:border-destructive",
    },
    {
      variant: "full-filled",
      tone: "light-red",
      class: "border-destructive/30 bg-destructive text-destructive-foreground",
    },
    {
      variant: "full-filled",
      tone: "neutral",
      class: "border-basic-00-10 bg-basic-700 text-basic-300",
    },
    {
      variant: "full-filled",
      tone: "orange",
      class: "border-orange-200/30 bg-orange-200/20 text-orange-200",
    },
    {
      variant: "default",
      tone: "default",
      class: "border-basic-00-10 bg-tag-default text-basic-300",
    },
    {variant: ["default", "dark"], tone: "blue", class: "text-blue-200"},
    {variant: ["default", "dark"], tone: "red", class: "text-red-300"},
    {variant: ["default", "dark"], tone: "orange", class: "text-orange-200"},
    {variant: ["default", "dark"], tone: "neutral", class: "text-basic-300"},
  ],
  defaultVariants: {
    variant: "full-filled",
    tone: "blue",
  },
});

export const badgeDotVariants = cva("size-2 shrink-0 rounded-full bg-current");

interface BadgeProps extends VariantProps<typeof badgeVariants> {
  children: React.ReactNode;
  showDot?: boolean;
}

const Badge = ({variant, tone, position, showDot, children}: BadgeProps) => (
  <span className={badgeVariants({variant, tone, position})}>
    {showDot && <span className={badgeDotVariants()} />}
    {children}
  </span>
);

export const Badges = () => {
  const [copiedName, setCopiedName] = useState<string | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<BadgeVariant>("full-filled");
  const [selectedTone, setSelectedTone] = useState<BadgeTone>("blue");
  const [selectedPosition, setSelectedPosition] = useState<"relative" | "top-left">("relative");
  const [badgeText, setBadgeText] = useState<string>("Badge");
  const [showDot, setShowDot] = useState<boolean>(false);

  const tonesList: BadgeTone[] = ["blue", "red", "light-red", "neutral", "orange"];
  const variantsList: BadgeVariant[] = ["full-filled", "default", "dark"];

  const handleCopy = (tone: string) => {
    const importText = `<Badge variant="${selectedVariant}" tone="${tone}"${
      showDot ? " showDot" : ""
    }>${badgeText}</Badge>`;

    navigator.clipboard.writeText(importText);
    setCopiedName(tone);
    setTimeout(() => setCopiedName(null), 2000);
  };

  return (
    <div className="min-h-screen bg-white p-8 font-sans text-gray-900 transition-colors duration-200 dark:bg-[#0C0E16] dark:text-[#E1E2ED]">
      {/* Header Section */}
      <h1 className="mb-2 text-3xl font-bold">Badge</h1>
      <p className="mb-6 text-sm text-gray-500 dark:text-[#8D90A0]">
        Badges are used to give a quick visual indication to the users.
      </p>

      {/* Best Practices Section */}
      <div className="mb-8">
        <h2 className="mb-3 text-lg font-bold">Best practices</h2>
        <ul className="list-inside list-disc space-y-1.5 text-sm text-gray-600 dark:text-[#8D90A0]">
          <li>Badge component should be filled with between 1 and 4 words.</li>
          <li>A dot indicator can be added at the beginning of the text.</li>
          <li>
            Use on the top-left of a card for media variants, or on the top-right for plain
            variants.
          </li>
          <li>Can also be used above a title.</li>
        </ul>
      </div>

      {/* Code Snippet Box */}
      <div className="mb-8 flex items-center justify-between overflow-x-auto rounded-lg border border-gray-800 bg-gray-900 p-4 font-mono text-sm text-gray-100">
        <pre className="text-xs sm:text-sm">
          <code>
            {`import { Badge } from '@/shared/components/badge';

const MyComponent = () => {
  return (
    <Badge variant="${selectedVariant}" tone="${selectedTone}" position="${selectedPosition}"${showDot ? " showDot" : ""}>
      ${badgeText}
    </Badge>
  );
};`}
          </code>
        </pre>
      </div>

      <h2 className="mb-2 text-2xl font-bold">All Badges</h2>
      <p className="mb-6 text-sm text-gray-500 dark:text-[#8D90A0]">
        Click on a badge card to copy its component JSX snippet.
      </p>

      {/* Controls Table */}
      <div className="mb-12 overflow-hidden rounded-xl border border-gray-200 bg-gray-50/50 dark:border-[#262626] dark:bg-[#12141F]">
        <table className="w-full table-fixed text-left text-sm">
          <thead className="border-b border-gray-200 bg-gray-100/50 text-xs font-semibold text-gray-400 uppercase dark:border-[#262626] dark:bg-[#181826]">
            <tr>
              <th className="w-1/5 px-4 py-3 tracking-1 dark:text-white">Name</th>
              <th className="w-1/5 px-4 py-3 tracking-1 dark:text-white">Description</th>
              <th className="w-1/5 px-4 py-3 tracking-1 dark:text-white">Default</th>
              <th className="w-2/5 px-4 py-3 tracking-1 dark:text-white">Control</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-[#262626]">
            <tr>
              <td className="px-4 py-3 font-semibold">variant</td>
              <td className="px-4 py-3">
                <span className="rounded bg-gray-200 px-2 py-0.5 font-mono text-xs text-white dark:bg-[#262626]">
                  "full-filled" | "default" | "dark"
                </span>
              </td>
              <td className="px-4 py-3 text-gray-400 dark:text-white">full-filled</td>
              <td className="px-4 py-3">
                <select
                  className="max-w-xs rounded border border-gray-300 bg-white px-3 py-1 text-sm focus:outline-none dark:border-[#262626] dark:bg-[#181826]"
                  value={selectedVariant}
                  onChange={(e) => setSelectedVariant(e.target.value as BadgeVariant)}
                >
                  {variantsList.map((v) => (
                    <option key={v} value={v}>
                      {v}
                    </option>
                  ))}
                </select>
              </td>
            </tr>

            <tr>
              <td className="px-4 py-3 font-semibold">showDot</td>
              <td className="px-4 py-3">
                <span className="rounded bg-gray-200 px-2 py-0.5 font-mono text-xs text-white dark:bg-[#262626]">
                  boolean
                </span>
              </td>
              <td className="px-4 py-3 text-gray-400 dark:text-white">false</td>
              <td className="px-4 py-3">
                <input
                  checked={showDot}
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 dark:border-[#262626]"
                  type="checkbox"
                  onChange={(e) => setShowDot(e.target.checked)}
                />
              </td>
            </tr>

            <tr>
              <td className="px-4 py-3 font-semibold">text</td>
              <td className="px-4 py-3">
                <span className="rounded bg-gray-200 px-2 py-0.5 font-mono text-xs text-white dark:bg-[#262626]">
                  string
                </span>
              </td>
              <td className="px-4 py-3 text-gray-400 dark:text-white">Badge</td>
              <td className="px-4 py-3">
                <input
                  className="w-48 rounded border border-gray-300 bg-white px-3 py-1 text-sm focus:outline-none dark:border-[#262626] dark:bg-[#181826]"
                  type="text"
                  value={badgeText}
                  onChange={(e) => setBadgeText(e.target.value)}
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Adding New Badges Documentation Section */}
      <div className="mb-12">
        <h2 className="mb-3 text-xl font-bold">Adding new badge styles</h2>
        <p className="mb-4 text-sm leading-relaxed text-gray-500 dark:text-[#8D90A0]">
          Configure{" "}
          <code className="rounded bg-gray-100 px-1 py-0.5 text-xs dark:bg-[#181826]">
            compoundVariants
          </code>{" "}
          in{" "}
          <code className="rounded bg-gray-100 px-1 py-0.5 text-xs dark:bg-[#181826]">
            badgeVariants
          </code>{" "}
          to pair background fills with specific text tones. The dot component inherits the current
          text color automatically using{" "}
          <code className="rounded bg-gray-100 px-1 py-0.5 text-xs dark:bg-[#181826]">
            bg-current
          </code>
          .
        </p>
      </div>

      {/* Toast Notification */}
      {copiedName && (
        <div className="fixed right-6 bottom-6 z-50 rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white shadow-lg dark:bg-white dark:text-gray-900">
          Copied snippet for tone <span className="font-bold">{copiedName}</span>!
        </div>
      )}

      {/* Badges Grid */}
      <div>
        <h3 className="mb-4 text-sm font-bold tracking-wider text-gray-400 uppercase dark:text-[#8D90A0]">
          Tones Grid ({selectedVariant})
        </h3>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {tonesList.map((toneName) => (
            <button
              className="group relative flex cursor-pointer flex-col items-center justify-center rounded-xl border border-gray-200 bg-gray-50/50 p-6 transition-all hover:border-gray-300 hover:bg-gray-100 dark:border-[#181826] dark:bg-[#12141F] dark:hover:border-[#262626] dark:hover:bg-[#181826]"
              key={toneName}

              onClick={() => {
                setSelectedTone(toneName);
                handleCopy(toneName);
              }}
            >
              <div className="relative mb-3 flex min-h-8 w-full items-center justify-center">
                <Badge showDot={showDot} tone={toneName} variant={selectedVariant}>
                  {badgeText}
                </Badge>
              </div>
              <span className="w-full truncate text-center text-xs font-medium text-gray-600 group-hover:text-gray-900 dark:text-gray-150 dark:group-hover:text-white">
                {toneName}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
