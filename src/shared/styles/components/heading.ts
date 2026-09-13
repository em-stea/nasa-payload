import {cva} from "class-variance-authority";

const commonClassnames = ["font-space-grotesk"];

export const headingVariants = cva(commonClassnames, {
  variants: {
    variant: {
      "title.1": "text-8 leading-10 font-semibold lg:text-16 lg:leading-20",
      "title.1-bold": "text-12 leading-20 font-bold lg:text-12 lg:leading-20",
      "title.2": "text-8 leading-10 font-bold lg:text-8 lg:leading-10",
      "title.3": "text-5 leading-7 lg:text-5 lg:leading-7",
      "title.4": "lg:text-3-5 text-3.5 leading-5 font-bold lg:leading-5",
    },
  },
  defaultVariants: {
    variant: "title.1",
  },
});
