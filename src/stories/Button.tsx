import { useState } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { textVariants } from "@/shared/styles/components/text";

// // Mock de textVariants según tus imports
// const textVariants = ({ variant }: { variant: string }) => {
//   if (variant === "button.1") return "text-sm font-semibold leading-none";
//   return "";
// };

const commonClassnames = [
  "inline-flex",
  "items-center",
  "justify-center",
  "rounded-lg",
  "hover:cursor-pointer",
  // textVariants({ variant: "button.1" }),
];

export const buttonVariants = cva(commonClassnames, {
  variants: {
    variant: {
      primary:
        "loading:cursor-wait bg-blue-700 text-basic-00 hover:bg-blue-900 hover:outline hover:outline-blue-200-30 disabled:cursor-not-allowed disabled:bg-gray-300 dark:disabled:bg-gray-700 disabled:text-gray-150 dark:disabled:text-gray-200 disabled:outline-none",
      "text-link":
        "flex items-center gap-2 tracking-1.6 text-foreground hover:text-highlight disabled:cursor-not-allowed disabled:text-gray-400 dark:disabled:text-gray-600 disabled:no-underline",
      secondary:
        "flex size-10 items-center justify-center border border-muted-foreground bg-muted p-0 focus-within:border-blue-200 hover:border-blue-200 focus:border-blue-200 disabled:cursor-not-allowed disabled:border-gray-300 dark:disabled:border-gray-700 disabled:bg-gray-100 dark:disabled:bg-gray-800/50 disabled:text-gray-400 dark:disabled:text-gray-600",
      ghost:
        "flex size-10 items-center justify-center bg-transparent p-0 hover:border-blue-200 disabled:cursor-not-allowed disabled:bg-transparent disabled:text-gray-400 dark:disabled:text-gray-600 disabled:border-transparent",
      "ghost-outline":
        "group flex items-center justify-center rounded-full border border-gray-800 text-gray-800 hover:border-blue-600 hover:text-blue-600 active:border-blue-600 active:text-blue-600 dark:border-basic-00 dark:text-basic-00 dark:hover:border-blue-200 dark:hover:text-blue-200 dark:active:border-blue-200 dark:active:text-blue-200 p-1 transition-colors disabled:cursor-not-allowed disabled:border-gray-300 dark:disabled:border-gray-150 dark:disabled:text-gray-150 disabled:opacity-40",
    },
    size: {
        md: "w-auto max-w-fit px-6 py-3",
        fullWidth: "w-full px-6 py-3",
        icon: "size-10 p-0",
    },
    loading: {
        true: "cursor-wait opacity-80 ",
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
export type ButtonSize =  "md" | "fullWidth";

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  children: React.ReactNode;
}

const SpinnerIcon = () => (
  <svg
    className="animate-spin size-4 shrink-0"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    ></circle>
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    ></path>
  </svg>
);

const Button = ({ variant, size, loading, active, className, children, ...props }: ButtonProps) => (
    <button
      className={buttonVariants({ variant, size, loading, active, className })}
      disabled={loading || props.disabled}
      {...props}
    >
      <span className="inline-grid place-items-center">
       
        <span className={`col-start-1 row-start-1 inline-flex items-center gap-2 ${loading ? "invisible" : "visible"}`}>
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
    const [buttonText, setButtonText] = useState<string>("Submit");
  
    const variantsList: ButtonVariant[] = ["primary", "secondary", "text-link", "ghost", "ghost-outline"];
    const sizesList: ButtonSize[] = [ "md",  "fullWidth"];
  
    return (
      <div className="min-h-screen p-8 bg-white dark:bg-[#0C0E16] text-gray-900 dark:text-[#E1E2ED] font-sans transition-colors duration-200">
        {/* Header Section */}
        <h1 className="text-3xl font-bold mb-2">Button</h1>
        <p className="text-gray-500 dark:text-[#8D90A0] mb-6 text-sm">
          Buttons trigger actions or events when clicked, providing essential interactive feedback.
        </p>
  
        {/* Best Practices Section */}
        <div className="mb-8">
          <h2 className="text-lg font-bold mb-3">Best practices</h2>
          <ul className="list-disc list-inside space-y-1.5 text-sm text-gray-600 dark:text-[#8D90A0]">
            <li>Use primary buttons for the main focal action on a page or modal.</li>
            <li>Limit the text inside buttons to concise, action-oriented verbs (1 to 3 words).</li>
            <li>Use secondary or ghost variants to lower visual priority for secondary actions.</li>
            <li>Ensure loading states disable user interaction to prevent duplicate submissions.</li>
          </ul>
        </div>
  
        {/* Code Snippet Box */}
        <div className="mb-8 p-4 rounded-lg bg-gray-900 text-gray-100 border border-gray-800 font-mono text-sm flex justify-between items-center overflow-x-auto">
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
        <h2 className="text-2xl font-bold mb-2">Interactive Controls</h2>
        <p className="text-gray-500 dark:text-[#8D90A0] mb-6 text-sm">
          Customize the props to update the dynamic code snippet above.
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
                <td className="py-3 px-4 font-semibold">variant</td>
                <td className="py-3 px-4">
                  <span className="font-mono text-xs px-2 py-0.5 rounded bg-gray-200 dark:bg-[#262626] text-white">
                    "primary" | "secondary" | "text-link" | "ghost" | "ghost-outline"
                  </span>
                </td>
                <td className="py-3 px-4 text-gray-400 dark:text-white">primary</td>
              </tr>
  
              <tr>
                <td className="py-3 px-4 font-semibold">size</td>
                <td className="py-3 px-4">
                  <span className="font-mono text-xs px-2 py-0.5 rounded bg-gray-200 dark:bg-[#262626] text-white">
                   "md" | "fullWidth"
                  </span>
                </td>
                <td className="py-3 px-4 text-gray-400 dark:text-white">md</td>
              </tr>
  
              <tr>
                <td className="py-3 px-4 font-semibold">loading</td>
                <td className="py-3 px-4">
                  <span className="font-mono text-xs px-2 py-0.5 rounded bg-gray-200 dark:bg-[#262626] text-white">
                    boolean
                  </span>
                </td>
                <td className="py-3 px-4 text-gray-400 dark:text-white">false</td>
              </tr>
  
              <tr>
                <td className="py-3 px-4 font-semibold">active</td>
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
              </tr>
  
              <tr>
                <td className="py-3 px-4 font-semibold">text</td>
                <td className="py-3 px-4">
                  <span className="font-mono text-xs px-2 py-0.5 rounded bg-gray-200 dark:bg-[#262626] text-white">
                    string
                  </span>
                </td>
                <td className="py-3 px-4 text-gray-400 dark:text-white">Submit</td>
                <td className="py-3 px-4">
                  <input
                    type="text"
                    value={buttonText}
                    onChange={(e) => setButtonText(e.target.value)}
                    className="w-48 bg-white dark:bg-[#181826] border border-gray-300 dark:border-[#262626] rounded px-3 py-1 text-sm focus:outline-none"
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>

      {/* Strapi Style Variants Matrix */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Variants</h2>
        <div className="border border-gray-200 dark:border-[#202436] rounded-2xl p-6 overflow-x-auto shadow-2xl [scrollbar-color:#C9CAD_transparent] dark:[scrollbar-color:#C9CAD4_transparent]">
          <table className="w-full text-left text-xs border-separate border-spacing-y-6 border-spacing-x-2">
            <thead>
              <tr className="text-gray-400 uppercase tracking-wider font-semibold text-[11px]">
                <th className="py-2 px-4 dark:text-white">Variant</th>
                <th className="py-2 px-4 dark:text-white">Default</th>
                <th className="py-2 px-4 dark:text-white">Disabled</th>
                <th className="py-2 px-4 dark:text-white">Loading</th>
                <th className="py-2 px-4 dark:text-white">Size MD</th>
                <th className="py-2 px-4 dark:text-white">Size FULL WIDTH</th>
              </tr>
            </thead>
            <tbody>
              {variantsList.map((variantName) => (
                <tr key={variantName} className="align-middle">
                  <td className="py-2 px-4 font-medium text-gray-200 dark:text-gray-150 whitespace-nowrap">
                    {variantName}
                  </td>

                  <td className="py-2 px-4">
                    <button  className="cursor-pointer transition-transform active:scale-95">
                      <Button variant={variantName} size="md" className='uppercase'>
                        {buttonText}
                      </Button>
                    </button>
                  </td>

                  <td className="py-2 px-4">
                    <button  className="cursor-pointer transition-transform active:scale-95">
                      <Button variant={variantName} size="md" disabled className='uppercase'>
                        {buttonText}
                      </Button>
                    </button>
                  </td>

                  <td className="py-2 px-4">
                    <button  className="cursor-pointer transition-transform active:scale-95">
                      <Button variant={variantName} size="md" loading className='uppercase'>
                        {buttonText}
                      </Button>
                    </button>
                  </td>


                  <td className="py-2 px-4">
                    <button  className="cursor-pointer transition-transform active:scale-95">
                      <Button variant={variantName} size="md" className='uppercase'>
                        {buttonText}
                      </Button>
                    </button>
                  </td>

                 <td className="py-2 px-4 min-w-50">
                    <button className="w-full cursor-pointer transition-transform active:scale-95"
                    >
                        <Button variant={variantName} size="fullWidth" className='uppercase'>
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