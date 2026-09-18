import { useState } from "react";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  User,
  Logout,
  Login,
  EyeClosed,
  Eye,
  Moon,
  Heart,
  Comments,
  Bell,
  Settings,
  Account,
  Menu,
  Share,
  Live,
  ChartLine,
  Cube,
  Target,
  Cross,
  CheckCircle,
  WarningTriangle,
  Github,
} from "../shared/components/icons/index";
import { colorData } from "./Colors";

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
  }
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
    <div className="min-h-screen p-8 bg-white dark:bg-[#0C0E16] text-gray-900 dark:text-[#E1E2ED] font-space-grotesk transition-colors duration-200">
      {/* Code Snippet Box */}
      <div className="mb-8 p-4 rounded-lg bg-gray-900 text-gray-100 border border-gray-800 font-jetbrains-mono text-sm flex justify-between items-center overflow-x-auto">
        <pre className="text-xs sm:text-sm">
          <code>
            {`import { ICON_NAME } from '@/shared/components/icons';

const MyComponent = () => {
  return <ICON_NAME width={${iconSize}} height={${iconSize}} color="${iconColor}" />;
};`}
          </code>
        </pre>
      </div>

      <p className="text-gray-500 dark:text-[#8D90A0] mb-8 text-sm">
        All icon components accept standard SVG props alongside custom <code className="px-1 py-0.5 rounded bg-gray-100 dark:bg-[#181826] text-xs">size</code> and <code className="px-1 py-0.5 rounded bg-gray-100 dark:bg-[#181826] text-xs">color</code> parameters.
      </p>

      <h2 className="text-2xl font-bold mb-2">All Icons</h2>
      <p className="text-gray-500 dark:text-[#8D90A0] mb-6 text-sm">
        Click on an icon to copy its import statement.
      </p>

      {/* Controls Table */}
      <div className="mb-12 border border-gray-200 dark:border-[#262626] rounded-xl overflow-hidden bg-gray-50/50 dark:bg-[#12141F]">
        <table className="w-full text-left text-sm table-fixed">
          <thead className="border-b border-gray-200 dark:border-[#262626] text-xs uppercase text-gray-400 font-semibold bg-gray-100/50 dark:bg-[#181826]">
            <tr>
              <th className="py-3 px-4 dark:text-white">Name</th>
              <th className="py-3 px-4 dark:text-white">Description</th>
              <th className="py-3 px-4 dark:text-white">Default</th>
              <th className="py-3 px-4 dark:text-white">Control</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-[#262626]">
            <tr>
              <td className="py-3 px-4 font-semibold">color</td>
              <td className="py-3 px-4">
                <span className="font-jetbrains-mono text-xs px-2 py-0.5 rounded bg-gray-200 dark:bg-[#262626] text-white">string</span>
              </td>
              <td className="py-3 px-4 text-gray-400 dark:text-white">currentColor</td>
              <td className="py-3 px-4">
                <select
                  value={iconColor}
                  onChange={(e) => setIconColor(e.target.value)}
                  className="bg-white dark:bg-[#181826] border border-gray-300 dark:border-[#262626] rounded px-3 py-1 text-sm focus:outline-none max-w-xs"
                >
                  <option value="currentColor">currentColor (Default)</option>
                  {colorData.map((group) => (
                    <optgroup key={group.category} label={group.category}>
                      {group.colors.map((color) => {
                        const colorValue = getColorValue(color.hex, color.opacity);
                        const label = `${color.classBg} (${color.hex}${color.opacity ? ` ${color.opacity}` : ''})`;
                        
                        return (
                          <option key={`${color.variable}-${color.opacity || '100'}`} value={colorValue}>
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
              <td className="py-3 px-4 font-semibold">size</td>
              <td className="py-3 px-4">
                <span className="font-jetbrains-mono text-xs px-2 py-0.5 rounded bg-gray-200 dark:bg-[#262626] text-white">number</span>
              </td>
              <td className="py-3 px-4 text-gray-400 dark:text-white">24</td>
              <td className="py-3 px-4">
                <input
                  type="number"
                  value={iconSize}
                  onChange={(e) => setIconSize(Number(e.target.value))}
                  className="w-24 bg-white dark:bg-[#181826] border border-gray-300 dark:border-[#262626] rounded px-3 py-1 text-sm focus:outline-none"
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Adding New Icons Documentation Section */}
      <div className="mb-12">
        <h2 className="text-xl font-bold mb-3">Adding new icons</h2>
        <p className="text-gray-500 dark:text-[#8D90A0] mb-4 text-sm leading-relaxed">
          It's important when exporting an icon that it's designed correctly—contained within a <code className="px-1 py-0.5 rounded bg-gray-100 dark:bg-[#181826] text-xs">24x24px</code> or <code className="px-1 py-0.5 rounded bg-gray-100 dark:bg-[#181826] text-xs">32x32px</code> bounding box. Ensure <code className="px-1 py-0.5 rounded bg-gray-100 dark:bg-[#181826] text-xs">{`{...props}`}</code> are forwarded and <code className="px-1 py-0.5 rounded bg-gray-100 dark:bg-[#181826] text-xs">fill="currentColor"</code> is used for paths:
        </p>
      </div>

      {/* Toast Notification */}
      {copiedName && (
        <div className="fixed bottom-6 right-6 bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-4 py-2 rounded-lg shadow-lg text-sm font-medium z-50">
          Copied import for <span className="font-bold">{copiedName}</span>!
        </div>
      )}

      {/* Icon Grid Groups */}
      <div className="flex flex-col gap-10">
        {Object.entries(IconsType).map(([category, icons]) => (
          <div key={category}>
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 dark:text-[#8D90A0] mb-4">
              {category}
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
              {Object.entries(icons).map(([name, IconComponent]) => {
                const componentName = name.charAt(0).toUpperCase() + name.slice(1);
                return (
                  <button
                    key={name}
                    onClick={() => handleCopy(componentName)}
                    className="flex flex-col items-center justify-center p-4 rounded-xl border border-gray-200 dark:border-[#181826] bg-gray-50/50 dark:bg-[#12141F] hover:bg-gray-100 dark:hover:bg-[#181826] hover:border-gray-300 dark:hover:border-[#262626] transition-all cursor-pointer group"
                  >
                    <div className="mb-3 flex items-center justify-center min-h-8" style={{ color: iconColor }}>
                      <IconComponent width={iconSize} height={iconSize} color={iconColor} />
                    </div>
                    <span className="text-xs font-medium text-gray-600 dark:text-gray-150 group-hover:text-gray-900 dark:group-hover:text-white truncate w-full text-center">
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