import {cva} from "class-variance-authority";

import {textVariants} from "./text";

export const footerVariants = cva([
  "flex",
  "w-full",
  "flex-col",
  "items-start",
  "border-t",
  "border-footer-border",
  "bg-footer-background",
]);

export const footerContainerVariants = cva([
  "mx-auto",
  "flex",
  "w-full",
  "max-w-1920",
  "flex-col",
  "items-center",
  "justify-between",
  "gap-6",
  "px-4",
  "py-8",
  "md:flex-row",
  "md:px-8",
]);

export const footerGroupVariants = cva(["flex", "shrink-0", "items-center", "justify-center"], {
  variants: {
    gap: {
      none: "gap-0",
      md: "gap-4",
    },
    /** Los links envuelven en mobile en lugar de desbordar la fila. */
    wrap: {
      true: "flex-wrap",
      false: "flex-nowrap",
    },
  },
  defaultVariants: {
    gap: "none",
    wrap: false,
  },
});

export const footerLogoVariants = cva([
  "relative",
  "block",
  "size-12",
  "shrink-0",
  "overflow-hidden",
  "rounded-md",
  "opacity-80",
  "transition-opacity",
  "duration-200",
  "hover:opacity-100",
]);

export const footerLogoImageVariants = cva(["size-full", "object-cover"]);

export const footerLinkVariants = cva([
  "inline-flex",
  "items-center",
  "text-muted-foreground",
  "transition-colors",
  "duration-200",
  "hover:text-accent",
  "focus-visible:ring-2",
  "focus-visible:ring-accent",
  "focus-visible:outline-none",
  textVariants({variant: "body.4"}),
]);

export const footerCopyrightVariants = cva([
  "text-muted-foreground",
  "opacity-80",
  "text-center",
  textVariants({variant: "body.4"}),
  // Va después de textVariants: el copyright conserva mayúsculas y minúsculas.
  "normal-case",
]);
