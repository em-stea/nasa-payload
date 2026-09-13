import {cva} from "class-variance-authority";

export const switchVariants = cva([
  "peer",
  "inline-flex",
  "h-4.6",
  "w-8",
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
  "data-[state=checked]:bg-primary",
  "data-[state=unchecked]:bg-input",
]);

export const switchThumbVariants = cva([
  "pointer-events-none",
  "block",
  "size-4",
  "rounded-full",
  "bg-background",
  "ring-0",
  "transition-transform",
  "data-[state=checked]:translate-x-[calc(100%-2px)]",
  "data-[state=unchecked]:translate-x-0",
]);
