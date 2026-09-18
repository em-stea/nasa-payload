import {cva, type VariantProps} from "class-variance-authority";
import {useState} from "react";

const commonClassnames = [
  "inline-flex",
  "items-center",
  "justify-center",
  "rounded-lg",
  "hover:cursor-pointer",
];

export const buttonVariants = cva(commonClassnames, {
  variants: {
    variant: {
      primary:
        "loading:cursor-wait bg-blue-700 font-mono tracking-1.2 text-basic-00 hover:bg-blue-900 hover:outline hover:outline-blue-200-30 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-150 disabled:outline-none dark:disabled:bg-gray-700 dark:disabled:text-gray-200",
      "text-link":
        "flex items-center gap-2 font-mono tracking-1.6 text-foreground hover:text-highlight disabled:cursor-not-allowed disabled:text-gray-400 disabled:no-underline dark:disabled:text-gray-600",
      secondary:
        "flex size-10 items-center justify-center border border-muted-foreground bg-muted p-0 font-mono focus-within:border-blue-200 hover:border-blue-200 focus:border-blue-200 disabled:cursor-not-allowed disabled:border-gray-300 disabled:bg-gray-100 disabled:text-gray-400 dark:disabled:border-gray-700 dark:disabled:bg-gray-800/50 dark:disabled:text-gray-600",
      ghost:
        "flex size-10 items-center justify-center bg-transparent p-0 font-mono hover:border-blue-200 disabled:cursor-not-allowed disabled:border-transparent disabled:bg-transparent disabled:text-gray-400 dark:disabled:text-gray-600",
      "ghost-outline":
        "group flex items-center justify-center rounded-full border border-gray-800 p-1 font-mono text-gray-800 transition-colors hover:border-blue-600 hover:text-blue-600 active:border-blue-600 active:text-blue-600 disabled:cursor-not-allowed disabled:border-gray-300 disabled:opacity-40 dark:border-basic-00 dark:text-basic-00 dark:hover:border-blue-200 dark:hover:text-blue-200 dark:active:border-blue-200 dark:active:text-blue-200 dark:disabled:border-gray-150 dark:disabled:text-gray-150",
    },
    size: {
      md: "w-auto max-w-fit px-6 py-3",
      fullWidth: "w-full px-6 py-3",
      icon: "size-10 p-0",
    },
    loading: {
      true: "cursor-wait opacity-80",
    },
    active: {
      true: "",
      false: "",
    },
  },

  defaultVariants: {
    variant: "primary",
    size: "md",
    loading: false,
    active: false,
  },
});

export type ButtonVariant = "primary" | "secondary" | "text-link" | "ghost" | "ghost-outline";

export type ButtonSize = "md" | "fullWidth";

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  children: React.ReactNode;
}

const SpinnerIcon = () => (
  <svg
    className="size-4 shrink-0 animate-spin"
    fill="none"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path
      className="opacity-75"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      fill="currentColor"
    />
  </svg>
);

const Button = ({variant, size, loading, active, className, children, ...props}: ButtonProps) => (
  <button
    className={buttonVariants({variant, size, loading, active, className})}
    disabled={loading || props.disabled}
    {...props}
  >
    <span className="inline-grid place-items-center">
      <span
        className={`col-start-1 row-start-1 inline-flex items-center gap-2 ${loading ? "invisible" : "visible"}`}
      >
        {children}
      </span>

      {loading && (
        <span className="col-start-1 row-start-1 flex items-center justify-center">
          <SpinnerIcon />
        </span>
      )}
    </span>
  </button>
);

export const ButtonsPage = () => {
  const [selectedVariant, setSelectedVariant] = useState<ButtonVariant>("primary");
  const [selectedSize, setSelectedSize] = useState<ButtonSize>("md");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [isDisabled, setIsDisabled] = useState<boolean>(false);
  const [buttonText, setButtonText] = useState<string>("Explore");

  const variantsList: ButtonVariant[] = [
    "primary",
    "secondary",
    "text-link",
    "ghost",
    "ghost-outline",
  ];
  const sizesList: ButtonSize[] = ["md", "fullWidth"];

  return (
    <div className="min-h-screen bg-white p-8 font-sans text-gray-900 transition-colors duration-200 dark:bg-[#0C0E16] dark:text-[#E1E2ED]">
      {/* Header Section */}
      <h1 className="mb-2 text-3xl font-bold">Button</h1>
      <p className="mb-6 text-sm text-gray-500 dark:text-[#8D90A0]">
        Buttons trigger actions or events when clicked, providing essential interactive feedback.
      </p>

      {/* Best Practices Section */}
      <div className="mb-8">
        <h2 className="mb-3 text-lg font-bold">Best practices</h2>
        <ul className="list-inside list-disc space-y-1.5 text-sm text-gray-600 dark:text-[#8D90A0]">
          <li>Use primary buttons for the main focal action on a page or modal.</li>
          <li>Limit the text inside buttons to concise, action-oriented verbs (1 to 3 words).</li>
          <li>Use secondary or ghost variants to lower visual priority for secondary actions.</li>
          <li>Ensure loading states disable user interaction to prevent duplicate submissions.</li>
        </ul>
      </div>

      {/* Code Snippet Box */}
      <div className="mb-8 flex items-center justify-between overflow-x-auto rounded-lg border border-gray-800 bg-gray-900 p-4 font-mono text-sm text-gray-100">
        <pre className="text-xs sm:text-sm">
          <code>
            {`import { Button } from '@/shared/components/button';
  
  const MyComponent = () => {
    return (
      <Button variant="${selectedVariant}" size="${selectedSize}"${
        isLoading ? " loading" : ""
      }${isActive ? " active" : ""}${isDisabled ? " disabled" : ""}>
        ${buttonText}
      </Button>
    );
  };`}
          </code>
        </pre>
      </div>

      {/* Controls Table */}
      <h2 className="mb-2 text-2xl font-bold">Interactive Controls</h2>
      <p className="mb-6 text-sm text-gray-500 dark:text-[#8D90A0]">
        Customize the props to update the dynamic code snippet above.
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
              <td className="px-4 py-3 font-semibold">variant</td>
              <td className="px-4 py-3">
                <span className="rounded bg-gray-200 px-2 py-0.5 font-mono text-xs text-white dark:bg-[#262626]">
                  "primary" | "secondary" | "text-link" | "ghost" | "ghost-outline"
                </span>
              </td>
              <td className="px-4 py-3 text-gray-400 dark:text-white">primary</td>
            </tr>

            <tr>
              <td className="px-4 py-3 font-semibold">size</td>
              <td className="px-4 py-3">
                <span className="rounded bg-gray-200 px-2 py-0.5 font-mono text-xs text-white dark:bg-[#262626]">
                  "md" | "fullWidth"
                </span>
              </td>
              <td className="px-4 py-3 text-gray-400 dark:text-white">md</td>
            </tr>

            <tr>
              <td className="px-4 py-3 font-semibold">loading</td>
              <td className="px-4 py-3">
                <span className="rounded bg-gray-200 px-2 py-0.5 font-mono text-xs text-white dark:bg-[#262626]">
                  boolean
                </span>
              </td>
              <td className="px-4 py-3 text-gray-400 dark:text-white">false</td>
            </tr>

            <tr>
              <td className="px-4 py-3 font-semibold">active</td>
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
            </tr>

            <tr>
              <td className="px-4 py-3 font-semibold">text</td>
              <td className="px-4 py-3">
                <span className="rounded bg-gray-200 px-2 py-0.5 font-mono text-xs text-white dark:bg-[#262626]">
                  string
                </span>
              </td>
              <td className="px-4 py-3 text-gray-400 dark:text-white">Submit</td>
              <td className="px-4 py-3">
                <input
                  className="w-48 rounded border border-gray-300 bg-white px-3 py-1 text-sm focus:outline-none dark:border-[#262626] dark:bg-[#181826]"
                  type="text"
                  value={buttonText}
                  onChange={(e) => setButtonText(e.target.value)}
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Strapi Style Variants Matrix */}
      <div className="mb-6">
        <h2 className="mb-2 text-2xl font-bold">Variants</h2>
        <div className="[scrollbar-color:#C9CAD_transparent] overflow-x-auto rounded-2xl border border-gray-200 p-6 shadow-2xl dark:[scrollbar-color:#C9CAD4_transparent] dark:border-[#202436]">
          <table className="w-full border-separate border-spacing-x-2 border-spacing-y-6 text-left text-xs">
            <thead>
              <tr className="text-[11px] font-semibold tracking-wider text-gray-400 uppercase">
                <th className="px-4 py-2 tracking-1 dark:text-white">Variant</th>
                <th className="px-4 py-2 tracking-1 dark:text-white">Default</th>
                <th className="px-4 py-2 tracking-1 dark:text-white">Disabled</th>
                <th className="px-4 py-2 tracking-1 dark:text-white">Loading</th>
                <th className="px-4 py-2 tracking-1 dark:text-white">Size MD</th>
                <th className="px-4 py-2 tracking-1 dark:text-white">Size FULL WIDTH</th>
              </tr>
            </thead>
            <tbody>
              {variantsList.map((variantName) => (
                <tr className="align-middle" key={variantName}>
                  <td className="px-4 py-2 font-medium whitespace-nowrap text-gray-200 dark:text-gray-150">
                    {variantName}
                  </td>

                  <td className="px-4 py-2">
                    <button className="cursor-pointer transition-transform active:scale-95">
                      <Button className="uppercase" size="md" variant={variantName}>
                        {buttonText}
                      </Button>
                    </button>
                  </td>

                  <td className="px-4 py-2">
                    <button className="cursor-pointer transition-transform active:scale-95">
                      <Button disabled className="uppercase" size="md" variant={variantName}>
                        {buttonText}
                      </Button>
                    </button>
                  </td>

                  <td className="px-4 py-2">
                    <button className="cursor-pointer transition-transform active:scale-95">
                      <Button loading className="uppercase" size="md" variant={variantName}>
                        {buttonText}
                      </Button>
                    </button>
                  </td>

                  <td className="px-4 py-2">
                    <button className="cursor-pointer transition-transform active:scale-95">
                      <Button className="uppercase" size="md" variant={variantName}>
                        {buttonText}
                      </Button>
                    </button>
                  </td>

                  <td className="min-w-50 px-4 py-2">
                    <button className="w-full cursor-pointer transition-transform active:scale-95">
                      <Button className="uppercase" size="fullWidth" variant={variantName}>
                        {buttonText}
                      </Button>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
