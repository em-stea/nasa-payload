import {cva} from "class-variance-authority";

export const separatorVariants = cva(
  [
    "shrink-0",
    "data-[orientation=horizontal]:h-px",
    "data-[orientation=horizontal]:w-full",
    "data-[orientation=vertical]:h-full",
    "data-[orientation=vertical]:w-px",
    "bg-border",
    "group-hover:bg-border-hover",
  ],
  {
    variants: {
      variant: {},
    },
  },
);
