import {cva} from "class-variance-authority";

import {textVariants} from "./text";

const commonClassnames = [
  "inline-flex",
  "w-fit",
  "shrink-0",
  "items-center",
  "justify-center",
  "gap-2",
  "overflow-hidden",
  "rounded-lg",
  "border",
  "border-transparent",
  "px-3",
  "py-1",
  textVariants({variant: "eyebrow"}),
  "whitespace-nowrap",
  "transition-[color,box-shadow]",
  "focus-visible:border-ring",
  "focus-visible:ring",
  "focus-visible:ring-ring/50",
  "aria-invalid:border-destructive",
  "aria-invalid:ring-destructive/20",
  "dark:aria-invalid:ring-destructive/40",
  "[&>svg]:pointer-events-none",
  "[&>svg]:size-3",
];

export const badgeVariants = cva(commonClassnames, {
  variants: {
    variant: {
      default: "border border-blue-200-30 bg-blue-700-20 text-blue-200",
      destructive: "bg-destructive text-destructive-foreground",
      media: [
        "border-basic-00-10",
        "bg-basic-960-80",
        "py-2",
        "pt-2.75",
        textVariants({variant: "meta.1"}),
      ],
    },
    tone: {
      blue: "",
      red: "",
      neutral: "",
      darkRed: "",

    },
  },
  compoundVariants: [
    {variant: "media", tone: "blue", class: "text-blue-200"},
    {variant: "media", tone: "red", class: "text-red-300"},
  
  ],
  defaultVariants: {
    variant: "default",
  },
});

export const badgeDotVariants = cva("size-2 shrink-0 rounded-full", {
  variants: {
    variant: {
      default: "bg-blue-200",
      destructive: "bg-destructive text-destructive-foreground",
      media: "",
   
    },
    tone: {
      neutral: "bg-basic-00",
      blue: "bg-blue-200",
      red: "bg-red-300",
      darkRed: "bg-red-300",
    
    },
  },
  compoundVariants: [
    {variant: "media", tone: "blue", class: "bg-blue-200"},
    {variant: "media", tone: "red", class: "bg-red-300"},
  
  ],
  defaultVariants: {
    variant: "default",
  },
});
