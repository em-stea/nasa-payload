import {cva} from "class-variance-authority";

export const containerVariants = cva(["mx-auto", "w-full"], {
  variants: {
    variant: {
      default: "max-w-1400 px-4 md:px-6",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});
