import {cva} from "class-variance-authority";

import {textVariants} from "./text";

const commonClassnames = [
  "inline-flex",
  "items-center",
  "justify-center",
  "rounded-lg",
  "hover:cursor-pointer",
  textVariants({variant: "button.1"}),
];

export const buttonVariants = cva(commonClassnames, {
  variants: {
    variant: {
      primary:
        "loading:cursor-wait bg-blue-700 text-basic-00 hover:bg-blue-900 hover:outline hover:outline-blue-200-30 disabled:cursor-not-allowed disabled:bg-gray-400",
      "text-link":
        "flex items-center gap-2 tracking-1.6 text-foreground hover:text-highlight disabled:text-gray-400",
      secondary:
        "flex size-10 items-center justify-center border border-muted-foreground bg-muted p-0 focus-within:border-blue-200 hover:border-blue-200 focus:border-blue-200",
      ghost: "flex size-10 items-center justify-center bg-transparent p-0 hover:border-blue-200",
      "ghost-outline":
        "group flex items-center justify-center rounded-full border border-gray-800 text-gray-800 hover:border-blue-600 hover:text-blue-600 active:border-blue-600 active:text-blue-600 dark:border-basic-00 dark:text-basic-00 dark:hover:border-blue-200 dark:hover:text-blue-200 dark:active:border-blue-200 dark:active:text-blue-200 p-1 transition-colors disabled:pointer-events-none disabled:opacity-40",
    },
    size: {
      sm: "px-0.9 py-0.9",
      md: "w-auto max-w-fit px-6 py-3",
      xs: "w-auto max-w-fit px-4.25 py-2.25",
      intrinsic: "w-fit",
      fullWidth: "w-full",
    },
    loading: {
      true: "cursor-wait",
    },
    active: {
      true: "",
      false: "",
    },
  },
  compoundVariants: [
    {
      variant: "secondary",
      size: "xs",
      className:
        "size-auto shrink-0 border-border bg-background text-3 leading-3 font-bold tracking-1.2 whitespace-nowrap text-primary-foreground uppercase transition-colors duration-200 hover:text-foreground",
    },
    {
      variant: "secondary",
      size: "xs",
      active: true,
      className:
        "border-blue-700 bg-blue-700 text-basic-00 focus-within:border-blue-700 hover:border-blue-700 hover:bg-blue-700 hover:text-basic-00 focus:border-blue-700",
    },
  ],
  defaultVariants: {
    variant: "primary",
    size: "md",
    loading: false,
    active: false,
  },
});
