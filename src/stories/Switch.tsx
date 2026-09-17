"use client";

import { useState } from "react";
import { cva } from "class-variance-authority";
import { Switch as SwitchPrimitive } from "radix-ui";
import { cn } from "@/shared/utils/className-builder";

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

function Switch({ className, thumbClassName, ...props }: SwitchProps) {
  return (
    <SwitchPrimitive.Root className={cn(switchVariants(), className)} data-slot="switch" {...props}>
      <SwitchPrimitive.Thumb
        className={cn(switchThumbVariants(), thumbClassName)}
        data-slot="switch-thumb"
      />
    </SwitchPrimitive.Root>
  );
}

export { Switch };

export const SwitchPage = () => {
  const [isChecked, setIsChecked] = useState<boolean>(false);
  const [isDisabled, setIsDisabled] = useState<boolean>(false);
  const [label, setLabel] = useState<string>("Dark Mode");

  const [demoChecked1, setDemoChecked1] = useState<boolean>(true);
  const [demoChecked2, setDemoChecked2] = useState<boolean>(false);

  return (
    <div className="min-h-screen p-8 bg-white dark:bg-[#0C0E16] text-gray-900 dark:text-[#E1E2ED] font-sans transition-colors duration-200">
      {/* Header Section */}
      <h1 className="text-3xl font-bold mb-2">Switch</h1>
      <p className="text-gray-500 dark:text-[#8D90A0] mb-6 text-sm">
        Switches toggle the state of a single setting on or off with immediate effect.
      </p>

      {/* Best Practices Section */}
      <div className="mb-8">
        <h2 className="text-lg font-bold mb-3">Best practices</h2>
        <ul className="list-disc list-inside space-y-1.5 text-sm text-gray-600 dark:text-[#8D90A0]">
          <li>Use switches for binary settings that take effect immediately without requiring a "Save" action.</li>
          <li>Ensure the associated label clearly describes what happens when the switch is active (e.g., "Dark Mode").</li>
          <li>Avoid using switches in long forms where users expect to submit all choices together; use checkboxes instead.</li>
          <li>Provide visually distinct states for default, checked, focus, and disabled interactions.</li>
        </ul>
      </div>

      {/* Code Snippet Box */}
      <div className="mb-8 p-4 rounded-lg bg-gray-900 text-gray-100 border border-gray-800 font-mono text-sm flex justify-between items-center overflow-x-auto">
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
      <h2 className="text-2xl font-bold mb-2">Interactive Controls</h2>
      <p className="text-gray-500 dark:text-[#8D90A0] mb-6 text-sm">
        Customize the props to update the dynamic code snippet above and test interactive behavior.
      </p>

      <div className="mb-12 border border-gray-200 dark:border-[#262626] rounded-xl overflow-hidden bg-gray-50/50 dark:bg-[#12141F]">
        <table className="w-full text-left text-sm table-fixed">
          <thead className="border-b border-gray-200 dark:border-[#262626] text-xs uppercase text-gray-400 font-semibold bg-gray-100/50 dark:bg-[#181826]">
            <tr>
              <th className="py-3 px-4 w-1/5 dark:text-white">Name</th>
              <th className="py-3 px-4 w-1/5 dark:text-white">Type</th>
              <th className="py-3 px-4 w-1/5 dark:text-white">Default</th>
              <th className="py-3 px-4 w-2/5 dark:text-white">Control</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-[#262626]">
            <tr>
              <td className="py-3 px-4 font-semibold">checked</td>
              <td className="py-3 px-4">
                <span className="font-mono text-xs px-2 py-0.5 rounded bg-gray-200 dark:bg-[#262626] text-white">
                  boolean
                </span>
              </td>
              <td className="py-3 px-4 text-gray-400 dark:text-white">false</td>
             
            </tr>

            <tr>
              <td className="py-3 px-4 font-semibold">disabled</td>
              <td className="py-3 px-4">
                <span className="font-mono text-xs px-2 py-0.5 rounded bg-gray-200 dark:bg-[#262626] text-white">
                  boolean
                </span>
              </td>
              <td className="py-3 px-4 text-gray-400 dark:text-white">false</td>
              <td className="py-3 px-4">
                <input
                  type="checkbox"
                  checked={isDisabled}
                  onChange={(e) => setIsDisabled(e.target.checked)}
                  className="size-4 accent-blue-600 cursor-pointer"
                />
              </td>
            </tr>

            <tr>
              <td className="py-3 px-4 font-semibold">label</td>
              <td className="py-3 px-4">
                <span className="font-mono text-xs px-2 py-0.5 rounded bg-gray-200 dark:bg-[#262626] text-white">
                  string
                </span>
              </td>
              <td className="py-3 px-4 text-gray-400 dark:text-white">Dark Mode</td>
              <td className="py-3 px-4">
                <input
                  type="text"
                  value={label}
                  onChange={(e) => setLabel(e.target.value)}
                  className="w-48 bg-white dark:bg-[#181826] border border-gray-300 dark:border-[#262626] rounded px-3 py-1 text-sm focus:outline-none"
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* States */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">States</h2>
        <div className="border border-gray-200 dark:border-[#202436] rounded-2xl p-6 overflow-x-auto shadow-2xl">
          <table className="w-full text-left text-xs border-separate border-spacing-y-6 border-spacing-x-2">
            <thead>
              <tr className="text-gray-400 uppercase tracking-wider font-semibold text-[11px]">
                <th className="py-2 px-4 dark:text-white">Default (Checked)</th>
                <th className="py-2 px-4 dark:text-white">Unchecked</th>
              </tr>
            </thead>
            <tbody>
              <tr className="align-middle">
                <td className="py-2 px-4">
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-150">{label}</span>
                    <Switch
                      id="state-checked"
                      checked={demoChecked1}
                      onCheckedChange={setDemoChecked1}
                      disabled={isDisabled}
                    />
                  </div>
                </td>

                <td className="py-2 px-4">
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-150">{label}</span>
                    <Switch
                      id="state-unchecked"
                      checked={demoChecked2}
                      onCheckedChange={setDemoChecked2}
                      disabled={isDisabled}
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