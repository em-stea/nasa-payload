import {useState} from "react";

import {
  Account,
  ArrowRight,
  Bell,
  ChartLine,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Comments,
  Cross,
  Cube,
  Eye,
  EyeClosed,
  Heart,
  Live,
  Login,
  Logout,
  Menu,
  Moon,
  Settings,
  Share,
  Target,
  User,
  WarningTriangle,
} from "../shared/components/icons/index";
import {colorData} from "./Colors";

const IconsType = {
  directional: {
    arrowRight: ArrowRight,
    chevronLeft: ChevronLeft,
    chevronRight: ChevronRight,
  },
  other: {
    user: User,
    logout: Logout,
    login: Login,
    eyeClosed: EyeClosed,
    eye: Eye,
    moon: Moon,
    heart: Heart,
    comments: Comments,
    bell: Bell,
    settings: Settings,
    account: Account,
    menu: Menu,
    share: Share,
    live: Live,
    chartLine: ChartLine,
    cube: Cube,
    target: Target,
  },
  feedback: {
    cross: Cross,
    checkCircle: CheckCircle,
    warningTriangle: WarningTriangle,
  },
};

const getColorValue = (hex: string, opacity?: string) => {
  if (!opacity) return hex;
  const alpha = parseFloat(opacity) / 100;

  const cleanHex = hex.replace("#", "");
  const r = parseInt(cleanHex.substring(0, 2), 16);
  const g = parseInt(cleanHex.substring(2, 4), 16);
  const b = parseInt(cleanHex.substring(4, 6), 16);

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

export const Icons = () => {
  const [copiedName, setCopiedName] = useState<string | null>(null);
  const [iconSize, setIconSize] = useState<number>(24);
  const [iconColor, setIconColor] = useState<string>("currentColor");

  const handleCopy = (name: string) => {
    const importText = `import { ${name} } from '@/shared/components/icons';`;

    navigator.clipboard.writeText(importText);
    setCopiedName(name);
    setTimeout(() => setCopiedName(null), 2000);
  };

  return (
    <div className="min-h-screen bg-white p-8 font-sans text-gray-900 transition-colors duration-200 dark:bg-[#0C0E16] dark:text-[#E1E2ED]">
      {/* Code Snippet Box */}
      <div className="mb-8 flex items-center justify-between overflow-x-auto rounded-lg border border-gray-800 bg-gray-900 p-4 font-mono text-sm text-gray-100">
        <pre className="text-xs sm:text-sm">
          <code>
            {`import { ICON_NAME } from '@/shared/components/icons';

const MyComponent = () => {
  return <ICON_NAME width={${iconSize}} height={${iconSize}} color="${iconColor}" />;
};`}
          </code>
        </pre>
      </div>

      <p className="mb-8 text-sm text-gray-500 dark:text-[#8D90A0]">
        All icon components accept standard SVG props alongside custom{" "}
        <code className="rounded bg-gray-100 px-1 py-0.5 text-xs dark:bg-[#181826]">size</code> and{" "}
        <code className="rounded bg-gray-100 px-1 py-0.5 text-xs dark:bg-[#181826]">color</code>{" "}
        parameters.
      </p>

      <h2 className="mb-2 text-2xl font-bold">All Icons</h2>
      <p className="mb-6 text-sm text-gray-500 dark:text-[#8D90A0]">
        Click on an icon to copy its import statement.
      </p>

      {/* Controls Table */}
      <div className="mb-12 overflow-hidden rounded-xl border border-gray-200 bg-gray-50/50 dark:border-[#262626] dark:bg-[#12141F]">
        <table className="w-full table-fixed text-left text-sm">
          <thead className="border-b border-gray-200 bg-gray-100/50 text-xs font-semibold text-gray-400 uppercase dark:border-[#262626] dark:bg-[#181826]">
            <tr>
              <th className="px-4 py-3 tracking-1 dark:text-white">Name</th>
              <th className="px-4 py-3 tracking-1 dark:text-white">Description</th>
              <th className="px-4 py-3 tracking-1 dark:text-white">Default</th>
              <th className="px-4 py-3 tracking-1 dark:text-white">Control</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-[#262626]">
            <tr>
              <td className="px-4 py-3 font-semibold">color</td>
              <td className="px-4 py-3">
                <span className="rounded bg-gray-200 px-2 py-0.5 font-mono text-xs text-white dark:bg-[#262626]">
                  string
                </span>
              </td>
              <td className="px-4 py-3 text-gray-400 dark:text-white">currentColor</td>
              <td className="px-4 py-3">
                <select
                  className="max-w-xs rounded border border-gray-300 bg-white px-3 py-1 text-sm focus:outline-none dark:border-[#262626] dark:bg-[#181826]"
                  value={iconColor}
                  onChange={(e) => setIconColor(e.target.value)}
                >
                  <option value="currentColor">currentColor (Default)</option>
                  {colorData.map((group) => (
                    <optgroup key={group.category} label={group.category}>
                      {group.colors.map((color) => {
                        const colorValue = getColorValue(color.hex, color.opacity);
                        const label = `${color.classBg} (${color.hex}${color.opacity ? ` ${color.opacity}` : ""})`;

                        return (
                          <option
                            key={`${color.variable}-${color.opacity || "100"}`}
                            value={colorValue}
                          >
                            {label}
                          </option>
                        );
                      })}
                    </optgroup>
                  ))}
                </select>
              </td>
            </tr>
            <tr>
              <td className="px-4 py-3 font-semibold">size</td>
              <td className="px-4 py-3">
                <span className="rounded bg-gray-200 px-2 py-0.5 font-mono text-xs text-white dark:bg-[#262626]">
                  number
                </span>
              </td>
              <td className="px-4 py-3 text-gray-400 dark:text-white">24</td>
              <td className="px-4 py-3">
                <input
                  className="w-24 rounded border border-gray-300 bg-white px-3 py-1 text-sm focus:outline-none dark:border-[#262626] dark:bg-[#181826]"
                  type="number"
                  value={iconSize}
                  onChange={(e) => setIconSize(Number(e.target.value))}
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Adding New Icons Documentation Section */}
      <div className="mb-12">
        <h2 className="mb-3 text-xl font-bold">Adding new icons</h2>
        <p className="mb-4 text-sm leading-relaxed text-gray-500 dark:text-[#8D90A0]">
          It's important when exporting an icon that it's designed correctly—contained within a{" "}
          <code className="rounded bg-gray-100 px-1 py-0.5 text-xs dark:bg-[#181826]">24x24px</code>{" "}
          or{" "}
          <code className="rounded bg-gray-100 px-1 py-0.5 text-xs dark:bg-[#181826]">32x32px</code>{" "}
          bounding box. Ensure{" "}
          <code className="rounded bg-gray-100 px-1 py-0.5 text-xs dark:bg-[#181826]">{`{...props}`}</code>{" "}
          are forwarded and{" "}
          <code className="rounded bg-gray-100 px-1 py-0.5 text-xs dark:bg-[#181826]">
            fill="currentColor"
          </code>{" "}
          is used for paths:
        </p>
      </div>

      {/* Toast Notification */}
      {copiedName && (
        <div className="fixed right-6 bottom-6 z-50 rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white shadow-lg dark:bg-white dark:text-gray-900">
          Copied import for <span className="font-bold">{copiedName}</span>!
        </div>
      )}

      {/* Icon Grid Groups */}
      <div className="flex flex-col gap-10">
        {Object.entries(IconsType).map(([category, icons]) => (
          <div key={category}>
            <h3 className="mb-4 text-sm font-bold tracking-wider text-gray-400 uppercase dark:text-[#8D90A0]">
              {category}
            </h3>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8">
              {Object.entries(icons).map(([name, IconComponent]) => {
                const componentName = name.charAt(0).toUpperCase() + name.slice(1);

                return (
                  <button
                    className="group flex cursor-pointer flex-col items-center justify-center rounded-xl border border-gray-200 bg-gray-50/50 p-4 transition-all hover:border-gray-300 hover:bg-gray-100 dark:border-[#181826] dark:bg-[#12141F] dark:hover:border-[#262626] dark:hover:bg-[#181826]"
                    key={name}
                    onClick={() => handleCopy(componentName)}
                  >
                    <div
                      className="mb-3 flex min-h-8 items-center justify-center"
                      style={{color: iconColor}}
                    >
                      <IconComponent color={iconColor} height={iconSize} width={iconSize} />
                    </div>
                    <span className="w-full truncate text-center text-xs text-gray-600 group-hover:text-gray-900 dark:text-gray-150 dark:group-hover:text-white">
                      {componentName}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
