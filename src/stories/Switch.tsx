"use client";

import {cva} from "class-variance-authority";
import {Switch as SwitchPrimitive} from "radix-ui";
import {useState} from "react";

import {cn} from "@/shared/utils/className-builder";

export const switchVariants = cva([
  "peer",
  "inline-flex",
  "h-5",
  "w-10",
  "shrink-0",
  "items-center",
  "rounded-full",
  "border",
  "border-transparent",
  "shadow-xs",
  "transition-all",
  "outline-none",
  "focus-visible:border-ring",
  "focus-visible:ring",
  "focus-visible:ring-ring/50",
  "disabled:cursor-not-allowed",
  "disabled:opacity-50",
  "data-[state=checked]:bg-blue-200",
  "data-[state=unchecked]:bg-[#C7C6CE] dark:data-[state=unchecked]:bg-gray-400",
]);

export const switchThumbVariants = cva([
  "pointer-events-none",
  "block",
  "size-3",
  "rounded-full",
  "bg-white",
  "dark:bg-blue-900",
  "ring-0",
  "transition-transform",
  "data-[state=checked]:translate-x-5.5",
  "data-[state=unchecked]:translate-x-1",

  "data-[state=checked]:bg-[#002B75]",
  "data-[state=unchecked]:bg-white",
]);

type SwitchProps = React.ComponentPropsWithoutRef<typeof SwitchPrimitive.Root> & {
  thumbClassName?: string;
};

function Switch({className, thumbClassName, ...props}: SwitchProps) {
  return (
    <SwitchPrimitive.Root className={cn(switchVariants(), className)} data-slot="switch" {...props}>
      <SwitchPrimitive.Thumb
        className={cn(switchThumbVariants(), thumbClassName)}
        data-slot="switch-thumb"
      />
    </SwitchPrimitive.Root>
  );
}

export {Switch};

export const SwitchPage = () => {
  const [isChecked, setIsChecked] = useState<boolean>(false);
  const [isDisabled, setIsDisabled] = useState<boolean>(false);
  const [label, setLabel] = useState<string>("Dark Mode");

  const [demoChecked1, setDemoChecked1] = useState<boolean>(true);
  const [demoChecked2, setDemoChecked2] = useState<boolean>(false);

  return (
    <div className="min-h-screen bg-white p-8 font-sans text-gray-900 transition-colors duration-200 dark:bg-[#0C0E16] dark:text-[#E1E2ED]">
      {/* Header Section */}
      <h1 className="mb-2 text-3xl font-bold">Switch</h1>
      <p className="mb-6 text-sm text-gray-500 dark:text-[#8D90A0]">
        Switches toggle the state of a single setting on or off with immediate effect.
      </p>

      {/* Best Practices Section */}
      <div className="mb-8">
        <h2 className="mb-3 text-lg font-bold">Best practices</h2>
        <ul className="list-inside list-disc space-y-1.5 text-sm text-gray-600 dark:text-[#8D90A0]">
          <li>
            Use switches for binary settings that take effect immediately without requiring a "Save"
            action.
          </li>
          <li>
            Ensure the associated label clearly describes what happens when the switch is active
            (e.g., "Dark Mode").
          </li>
          <li>
            Avoid using switches in long forms where users expect to submit all choices together;
            use checkboxes instead.
          </li>
          <li>
            Provide visually distinct states for default, checked, focus, and disabled interactions.
          </li>
        </ul>
      </div>

      {/* Code Snippet Box */}
      <div className="mb-8 flex items-center justify-between overflow-x-auto rounded-lg border border-gray-800 bg-gray-900 p-4 font-mono text-sm text-gray-100">
        <pre className="text-xs sm:text-sm">
          <code>
            {`import { Switch } from '@/shared/components/switch';

const MyComponent = () => {
  return (
    <div className="flex items-center gap-3">
      <span>${label}</span>
      <Switch${isChecked ? " checked" : ""}${isDisabled ? " disabled" : ""} />
    </div>
  );
};`}
          </code>
        </pre>
      </div>

      {/* Interactive Controls */}
      <h2 className="mb-2 text-2xl font-bold">Interactive Controls</h2>
      <p className="mb-6 text-sm text-gray-500 dark:text-[#8D90A0]">
        Customize the props to update the dynamic code snippet above and test interactive behavior.
      </p>

      <div className="mb-12 overflow-hidden rounded-xl border border-gray-200 bg-gray-50/50 dark:border-[#262626] dark:bg-[#12141F]">
        <table className="w-full table-fixed text-left text-sm">
          <thead className="border-b border-gray-200 bg-gray-100/50 text-xs font-semibold text-gray-400 uppercase dark:border-[#262626] dark:bg-[#181826]">
            <tr>
              <th className="w-1/5 px-4 py-3 tracking-1 dark:text-white">Name</th>
              <th className="w-1/5 px-4 py-3 tracking-1 dark:text-white">Type</th>
              <th className="w-1/5 px-4 py-3 tracking-1 dark:text-white">Default</th>
              <th className="w-2/5 px-4 py-3 tracking-1 dark:text-white">Control</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-[#262626]">
            <tr>
              <td className="px-4 py-3 font-semibold">checked</td>
              <td className="px-4 py-3">
                <span className="rounded bg-gray-200 px-2 py-0.5 font-mono text-xs text-white dark:bg-[#262626]">
                  boolean
                </span>
              </td>
              <td className="px-4 py-3 text-gray-400 dark:text-white">false</td>
            </tr>

            <tr>
              <td className="px-4 py-3 font-semibold">disabled</td>
              <td className="px-4 py-3">
                <span className="rounded bg-gray-200 px-2 py-0.5 font-mono text-xs text-white dark:bg-[#262626]">
                  boolean
                </span>
              </td>
              <td className="px-4 py-3 text-gray-400 dark:text-white">false</td>
              <td className="px-4 py-3">
                <input
                  checked={isDisabled}
                  className="size-4 cursor-pointer accent-blue-600"
                  type="checkbox"
                  onChange={(e) => setIsDisabled(e.target.checked)}
                />
              </td>
            </tr>

            <tr>
              <td className="px-4 py-3 font-semibold">label</td>
              <td className="px-4 py-3">
                <span className="rounded bg-gray-200 px-2 py-0.5 font-mono text-xs text-white dark:bg-[#262626]">
                  string
                </span>
              </td>
              <td className="px-4 py-3 text-gray-400 dark:text-white">Dark Mode</td>
              <td className="px-4 py-3">
                <input
                  className="w-48 rounded border border-gray-300 bg-white px-3 py-1 text-sm focus:outline-none dark:border-[#262626] dark:bg-[#181826]"
                  type="text"
                  value={label}
                  onChange={(e) => setLabel(e.target.value)}
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* States */}
      <div className="mb-6">
        <h2 className="mb-2 text-2xl font-bold">States</h2>
        <div className="overflow-x-auto rounded-2xl border border-gray-200 p-6 shadow-2xl dark:border-[#202436]">
          <table className="w-full border-separate border-spacing-x-2 border-spacing-y-6 text-left text-xs">
            <thead>
              <tr className="text-[11px] font-semibold tracking-wider text-gray-400 uppercase">
                <th className="px-4 py-2 dark:text-white">Default (Checked)</th>
                <th className="px-4 py-2 dark:text-white">Unchecked</th>
              </tr>
            </thead>
            <tbody>
              <tr className="align-middle">
                <td className="px-4 py-2">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-sm text-gray-150">{label}</span>
                    <Switch
                      checked={demoChecked1}
                      disabled={isDisabled}
                      id="state-checked"
                      onCheckedChange={setDemoChecked1}
                    />
                  </div>
                </td>

                <td className="px-4 py-2">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-sm text-gray-150">{label}</span>
                    <Switch
                      checked={demoChecked2}
                      disabled={isDisabled}
                      id="state-unchecked"
                      onCheckedChange={setDemoChecked2}
                    />
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
