import {useState} from "react";

import {Github, Google} from "../shared/components/icons";

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
    <div className="min-h-screen bg-white p-8 font-sans text-gray-900 transition-colors duration-200 dark:bg-[#0C0E16] dark:text-[#E1E2ED]">
      <h1 className="mb-2 text-3xl font-bold">Symbols</h1>
      <p className="mb-8 text-sm text-gray-500 dark:text-[#8D90A0]">
        Symbols are a lot stricter, they have pre-set colors and should only have their{" "}
        <code className="rounded bg-gray-100 px-1 py-0.5 text-xs dark:bg-[#181826]">width</code> and{" "}
        <code className="rounded bg-gray-100 px-1 py-0.5 text-xs dark:bg-[#181826]">height</code>{" "}
        set to accommodate the design you're trying to achieve.
      </p>

      {/* Code Snippet Box */}
      <div className="mb-8 flex items-center justify-between overflow-x-auto rounded-lg border border-gray-800 bg-gray-900 p-4 font-mono text-sm text-gray-100">
        <pre className="text-xs sm:text-sm">
          <code>
            {`import { SYMBOL_NAME } from '@/shared/components/symbols';

const MyComponent = () => {
  return <SYMBOL_NAME width={${symbolSize}} height={${symbolSize}} />;
};`}
          </code>
        </pre>
      </div>

      <h2 className="mb-2 text-2xl font-bold">All Symbols</h2>
      <p className="mb-6 text-sm text-gray-500 dark:text-[#8D90A0]">
        Click on a symbol to copy its import statement.
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
              <td className="px-4 py-3 font-semibold">size</td>
              <td className="px-4 py-3">
                <span className="rounded bg-gray-200 px-2 py-0.5 font-mono text-xs text-white dark:bg-[#262626]">
                  number
                </span>
              </td>
              <td className="px-4 py-3 text-gray-400 dark:text-white">32</td>
              <td className="px-4 py-3">
                <input
                  className="w-24 rounded border border-gray-300 bg-white px-3 py-1 text-sm focus:outline-none dark:border-[#262626] dark:bg-[#181826]"
                  type="number"
                  value={symbolSize}
                  onChange={(e) => setSymbolSize(Number(e.target.value))}
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Adding New Symbols Documentation Section */}
      <div className="mb-12">
        <h2 className="mb-3 text-xl font-bold">Adding new symbols</h2>
        <p className="mb-4 text-sm leading-relaxed text-gray-500 dark:text-[#8D90A0]">
          It's important when exporting a symbol that it's designed correctly—contained within a{" "}
          <code className="rounded bg-gray-100 px-1 py-0.5 text-xs dark:bg-[#181826]">24x24px</code>{" "}
          or{" "}
          <code className="rounded bg-gray-100 px-1 py-0.5 text-xs dark:bg-[#181826]">32x32px</code>{" "}
          bounding box with fixed color values. Ensure{" "}
          <code className="rounded bg-gray-100 px-1 py-0.5 text-xs dark:bg-[#181826]">{`{...props}`}</code>{" "}
          are forwarded correctly.
        </p>
      </div>

      {/* Toast Notification */}
      {copiedName && (
        <div className="fixed right-6 bottom-6 z-50 rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white shadow-lg dark:bg-white dark:text-gray-900">
          Copied import for <span className="font-bold">{copiedName}</span>!
        </div>
      )}

      {/* Symbol Grid Container */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8">
        {Object.entries(symbolsList).map(([name, SymbolComponent]) => {
          const componentName = name.charAt(0).toUpperCase() + name.slice(1);

          return (
            <button
              className="group flex cursor-pointer flex-col items-center justify-center rounded-xl border border-gray-200 bg-gray-50/50 p-4 transition-all hover:border-gray-300 hover:bg-gray-100 dark:border-[#181826] dark:bg-[#12141F] dark:hover:border-[#262626] dark:hover:bg-[#181826]"
              key={name}
              onClick={() => handleCopy(componentName)}
            >
              <div className="mb-3 flex min-h-8 items-center justify-center">
                <SymbolComponent height={symbolSize} width={symbolSize} />
              </div>
              <span className="w-full truncate text-center text-xs text-gray-600 group-hover:text-gray-900 dark:text-gray-150 dark:group-hover:text-white">
                {componentName}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
