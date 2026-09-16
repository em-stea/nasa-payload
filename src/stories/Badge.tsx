import { useState } from "react";
import { cva, type VariantProps } from "class-variance-authority";

// Mock o import real de textVariants
const textVariants = ({ variant }: { variant: string }) => {
  if (variant === "eyebrow") return "text-xs font-semibold uppercase tracking-wider";
  return "";
};

export type BadgeTone = "blue" | "red" | "light-red" | "neutral" | "orange";
export type BadgeVariant = "full-filled" | "default" | "dark";

const commonClassnames = [
  "inline-flex",
  "w-fit",
  "shrink-0",
  "items-center",
  "justify-center",
  "gap-2",
  "overflow-hidden",
  "rounded-lg",
  "border",
  "border-transparent",
  "px-3",
  "py-1",
  "whitespace-nowrap",
  "transition-colors",
  "[&>svg]:pointer-events-none",
  "[&>svg]:size-3",
];

export const badgeVariants = cva(commonClassnames, {
  variants: {
    variant: {
      "full-filled": textVariants({ variant: "eyebrow" }),
      default: [
        textVariants({ variant: "eyebrow" }),
        "border-basic-00-10",
        "bg-basic-700",
        "text-2.5",
        "leading-3.75",
        "tracking-0.5",
        "uppercase",
      ],
      dark: [
        "border-gray-200",
        "bg-basic-950",
        "px-3",
        "py-2.5",
        textVariants({ variant: "eyebrow" }),
      ],
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
      class: "border-red-200-30 bg-red-700-20 text-destructive",
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
    { variant: ["default", "dark"], tone: "blue", class: "text-blue-200" },
    { variant: ["default", "dark"], tone: "red", class: "text-red-300" },
    { variant: ["default", "dark"], tone: "orange", class: "text-orange-200" },
    { variant: ["default", "dark"], tone: "neutral", class: "text-basic-300" },
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

const Badge = ({ variant, tone, position, showDot, children }: BadgeProps) => (
  <span className={badgeVariants({ variant, tone, position })}>
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
    <div className="min-h-screen p-8 bg-white dark:bg-[#0C0E16] text-gray-900 dark:text-[#E1E2ED] font-sans transition-colors duration-200">
      {/* Header Section */}
      <h1 className="text-3xl font-bold mb-2">Badge</h1>
      <p className="text-gray-500 dark:text-[#8D90A0] mb-6 text-sm">
        Badges are used to give a quick visual indication to the users.
      </p>

      {/* Best Practices Section */}
      <div className="mb-8">
        <h2 className="text-lg font-bold mb-3">Best practices</h2>
        <ul className="list-disc list-inside space-y-1.5 text-sm text-gray-600 dark:text-[#8D90A0]">
        <li>Badge component should be filled with between 1 and 4 words.</li>
          <li>A dot indicator can be added at the beginning of the text.</li>
          <li>Use on the top-left of a card for media variants, or on the top-right for plain variants.</li>
          <li>Can also be used above a title.</li>
        </ul>
      </div>

      {/* Code Snippet Box */}
      <div className="mb-8 p-4 rounded-lg bg-gray-900 text-gray-100 border border-gray-800 font-mono text-sm flex justify-between items-center overflow-x-auto">
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

      <h2 className="text-2xl font-bold mb-2">All Badges</h2>
      <p className="text-gray-500 dark:text-[#8D90A0] mb-6 text-sm">
        Click on a badge card to copy its component JSX snippet.
      </p>

      {/* Controls Table */}
      <div className="mb-12 border border-gray-200 dark:border-[#262626] rounded-xl overflow-hidden bg-gray-50/50 dark:bg-[#12141F]">
        <table className="w-full text-left text-sm table-fixed">
          <thead className="border-b border-gray-200 dark:border-[#262626] text-xs uppercase text-gray-400 font-semibold bg-gray-100/50 dark:bg-[#181826]">
            <tr>
              <th className="py-3 px-4 w-1/5 dark:text-white">Name</th>
              <th className="py-3 px-4 w-1/5 dark:text-white">Description</th>
              <th className="py-3 px-4 w-1/5 dark:text-white">Default</th>
              <th className="py-3 px-4 w-2/5 dark:text-white">Control</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-[#262626]">
            <tr>
              <td className="py-3 px-4 font-semibold">variant</td>
              <td className="py-3 px-4">
                <span className="font-mono text-xs px-2 py-0.5 rounded bg-gray-200 dark:bg-[#262626] text-white">
                  "full-filled" | "default" | "dark"
                </span>
              </td>
              <td className="py-3 px-4 text-gray-400 dark:text-white">full-filled</td>
              <td className="py-3 px-4">
                <select
                  value={selectedVariant}
                  onChange={(e) => setSelectedVariant(e.target.value as BadgeVariant)}
                  className="bg-white dark:bg-[#181826] border border-gray-300 dark:border-[#262626] rounded px-3 py-1 text-sm focus:outline-none max-w-xs"
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
              <td className="py-3 px-4 font-semibold">showDot</td>
              <td className="py-3 px-4">
                <span className="font-mono text-xs px-2 py-0.5 rounded bg-gray-200 dark:bg-[#262626] text-white">
                  boolean
                </span>
              </td>
              <td className="py-3 px-4 text-gray-400 dark:text-white">false</td>
              <td className="py-3 px-4">
                <input
                  type="checkbox"
                  checked={showDot}
                  onChange={(e) => setShowDot(e.target.checked)}
                  className="rounded border-gray-300 dark:border-[#262626] text-indigo-600 focus:ring-indigo-500 h-4 w-4"
                />
              </td>
            </tr>

            <tr>
              <td className="py-3 px-4 font-semibold">text</td>
              <td className="py-3 px-4">
                <span className="font-mono text-xs px-2 py-0.5 rounded bg-gray-200 dark:bg-[#262626] text-white">
                  string
                </span>
              </td>
              <td className="py-3 px-4 text-gray-400 dark:text-white ">Badge</td>
              <td className="py-3 px-4">
                <input
                  type="text"
                  value={badgeText}
                  onChange={(e) => setBadgeText(e.target.value)}
                  className="w-48 bg-white dark:bg-[#181826] border border-gray-300 dark:border-[#262626] rounded px-3 py-1 text-sm focus:outline-none"
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Adding New Badges Documentation Section */}
      <div className="mb-12">
        <h2 className="text-xl font-bold mb-3">Adding new badge styles</h2>
        <p className="text-gray-500 dark:text-[#8D90A0] mb-4 text-sm leading-relaxed">
          Configure <code className="px-1 py-0.5 rounded bg-gray-100 dark:bg-[#181826] text-xs">compoundVariants</code> in <code className="px-1 py-0.5 rounded bg-gray-100 dark:bg-[#181826] text-xs">badgeVariants</code> to pair background fills with specific text tones. The dot component inherits the current text color automatically using <code className="px-1 py-0.5 rounded bg-gray-100 dark:bg-[#181826] text-xs">bg-current</code>.
        </p>
      </div>

      {/* Toast Notification */}
      {copiedName && (
        <div className="fixed bottom-6 right-6 bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-4 py-2 rounded-lg shadow-lg text-sm font-medium z-50">
          Copied snippet for tone <span className="font-bold">{copiedName}</span>!
        </div>
      )}

      {/* Badges Grid */}
      <div>
        <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 dark:text-[#8D90A0] mb-4">
            Tones Grid ({selectedVariant})
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {tonesList.map((toneName) => (
            <button
                key={toneName}
                onClick={() => {
                setSelectedTone(toneName);
                handleCopy(toneName);
                }}
           
                className="relative flex flex-col items-center justify-center p-6 rounded-xl border border-gray-200 dark:border-[#181826] bg-gray-50/50 dark:bg-[#12141F] hover:bg-gray-100 dark:hover:bg-[#181826] hover:border-gray-300 dark:hover:border-[#262626] transition-all cursor-pointer group"
            >
              
                <div className="relative mb-3 flex items-center justify-center min-h-8 w-full">
                <Badge
                    variant={selectedVariant}
                    tone={toneName}
                    showDot={showDot}
                >
                    {badgeText}
                </Badge>
                </div>
                <span className="text-xs font-medium text-gray-600 dark:text-gray-150 group-hover:text-gray-900 dark:group-hover:text-white truncate w-full text-center">
                {toneName}
                </span>
            </button>
            ))}
        </div>
        </div>
    </div>
  );
};