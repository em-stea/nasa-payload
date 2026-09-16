import { useState } from "react";
import { Google , Github } from "../shared/components/icons";


// Agregá o importá tus símbolos acá de la misma forma que en IconsType
const symbolsList = {
  google: Google,
  github: Github,
};

export const Symbols = () => {
  const [copiedName, setCopiedName] = useState<string | null>(null);
  const [symbolSize, setSymbolSize] = useState<number>(32);

  const handleCopy = (name: string) => {
    const importText = `import { ${name} } from '@/shared/components/symbols';`;
    navigator.clipboard.writeText(importText);
    setCopiedName(name);
    setTimeout(() => setCopiedName(null), 2000);
  };

  return (
    <div className="min-h-screen p-8 bg-white dark:bg-[#0C0E16] text-gray-900 dark:text-[#E1E2ED] font-sans transition-colors duration-200">
      <h1 className="text-3xl font-bold mb-2">Symbols</h1>
      <p className="text-gray-500 dark:text-[#8D90A0] mb-8 text-sm">
        Symbols are a lot stricter, they have pre-set colors and should only have their{" "}
        <code className="px-1 py-0.5 rounded bg-gray-100 dark:bg-[#181826] text-xs">
          width
        </code>{" "}
        and{" "}
        <code className="px-1 py-0.5 rounded bg-gray-100 dark:bg-[#181826] text-xs">
          height
        </code>{" "}
        set to accommodate the design you're trying to achieve.
      </p>

      {/* Code Snippet Box */}
      <div className="mb-8 p-4 rounded-lg bg-gray-900 text-gray-100 border border-gray-800 font-mono text-sm flex justify-between items-center overflow-x-auto">
        <pre className="text-xs sm:text-sm">
          <code>
            {`import { SYMBOL_NAME } from '@/shared/components/symbols';

const MyComponent = () => {
  return <SYMBOL_NAME width={${symbolSize}} height={${symbolSize}} />;
};`}
          </code>
        </pre>
      </div>

      <h2 className="text-2xl font-bold mb-2">All Symbols</h2>
      <p className="text-gray-500 dark:text-[#8D90A0] mb-6 text-sm">
        Click on a symbol to copy its import statement.
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
              <td className="py-3 px-4 font-semibold">size</td>
              <td className="py-3 px-4">
                <span className="font-mono text-xs px-2 py-0.5 rounded bg-gray-200 dark:bg-[#262626] text-white">
                  number
                </span>
              </td>
              <td className="py-3 px-4 text-gray-400 dark:text-white">32</td>
              <td className="py-3 px-4">
                <input
                  type="number"
                  value={symbolSize}
                  onChange={(e) => setSymbolSize(Number(e.target.value))}
                  className="w-24 bg-white dark:bg-[#181826] border border-gray-300 dark:border-[#262626] rounded px-3 py-1 text-sm focus:outline-none"
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Adding New Symbols Documentation Section */}
      <div className="mb-12">
        <h2 className="text-xl font-bold mb-3">Adding new symbols</h2>
        <p className="text-gray-500 dark:text-[#8D90A0] mb-4 text-sm leading-relaxed">
          It's important when exporting a symbol that it's designed correctly—contained within a <code className="px-1 py-0.5 rounded bg-gray-100 dark:bg-[#181826] text-xs">24x24px</code> or <code className="px-1 py-0.5 rounded bg-gray-100 dark:bg-[#181826] text-xs">32x32px</code> bounding box with fixed color values. Ensure <code className="px-1 py-0.5 rounded bg-gray-100 dark:bg-[#181826] text-xs">{`{...props}`}</code> are forwarded correctly.
        </p>
      </div>

      {/* Toast Notification */}
      {copiedName && (
        <div className="fixed bottom-6 right-6 bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-4 py-2 rounded-lg shadow-lg text-sm font-medium z-50">
          Copied import for <span className="font-bold">{copiedName}</span>!
        </div>
      )}

      {/* Symbol Grid Container */}
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
        {Object.entries(symbolsList).map(([name, SymbolComponent]) => {
          const componentName =
            name.charAt(0).toUpperCase() + name.slice(1);
          return (
            <button
              key={name}
              onClick={() => handleCopy(componentName)}
              className="flex flex-col items-center justify-center p-4 rounded-xl border border-gray-200 dark:border-[#181826] bg-gray-50/50 dark:bg-[#12141F] hover:bg-gray-100 dark:hover:bg-[#181826] hover:border-gray-300 dark:hover:border-[#262626] transition-all cursor-pointer group"
            >
              <div className="mb-3 flex items-center justify-center min-h-8">
                <SymbolComponent width={symbolSize} height={symbolSize} />
              </div>
              <span className="text-xs font-medium text-gray-600 dark:text-gray-150 group-hover:text-gray-900 dark:group-hover:text-white truncate w-full text-center">
                {componentName}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};