import {cva} from "class-variance-authority";

import {textVariants} from "./text";

export const navbarVariants = cva([
  "flex",
  "w-full",
  "flex-col",
  "items-start",
  "border-b",
  "border-navbar-border",
  "bg-transparency-navbar",
  "backdrop-blur-6",
]);

export const navbarContainerVariants = cva([
  "mx-auto",
  "flex",
  "h-16",
  "w-full",
  "max-w-1920",
  "items-center",
  "justify-between",
  "gap-3",
  "px-4",
  "md:h-20",
  "md:px-8",
]);

export const navbarGroupVariants = cva(["shrink-0", "items-center"], {
  variants: {
    gap: {
      none: "gap-0",
      sm: "gap-1.5",
      md: "gap-6",
    },
    /** `desktop` esconde el grupo por debajo de `md` (los links viven en el drawer). */
    visibility: {
      always: "flex",
      desktop: "hidden md:flex",
    },
  },
  defaultVariants: {
    gap: "none",
    visibility: "always",
  },
});

export const navbarLogoVariants = cva([
  "relative",
  "block",
  "size-15",
  "shrink-0",
  "opacity-100",
  "dark:opacity-80",
  "transition-[opacity,filter]",
  "duration-200",
  "hover:opacity-100",
  "hover:brightness-125",
]);

export const navbarLogoImageVariants = cva(["size-full", "object-contain"]);

export const navbarLinkVariants = cva(
  [
    "inline-flex",
    "items-center",
    "gap-1.5",
    "text-muted-foreground",
    "transition-colors",
    "duration-200",
    "hover:text-accent",
    textVariants({variant: "nav.link"}),
  ],
  {
    variants: {
      active: {
        true: "text-accent",
      },
    },
    defaultVariants: {
      active: false,
    },
  },
);

export const navbarDotVariants = cva([
  "shrink-0",
  "rounded-full",
  "bg-live-dot",
  "shadow-live-dot",
  "relative",
  "inline-flex",
  "size-2",
  "items-center",
  "justify-center",
  "animate-pulse",
  "mr-0.5",
]);

const navbarIconButtonClasses = [
  "inline-flex",
  "size-9",
  "shrink-0",
  "items-center",
  "justify-center",
  "rounded-full",
  "text-icon",
  "transition-colors",
  "duration-200",
  "hover:cursor-pointer",
  "hover:text-highlight",
  "focus-visible:ring-2",
  "focus-visible:ring-accent",
  "focus-visible:outline-none",
];

export const navbarUserVariants = cva(navbarIconButtonClasses);

export const navbarUserIconVariants = cva(["size-6"]);

/** Hamburguesa: solo existe por debajo de `md`. */
export const navbarMenuVariants = cva([...navbarIconButtonClasses, "md:hidden"]);

export const navbarMenuIconVariants = cva(["size-6"]);
