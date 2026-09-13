import {VariantProps} from "class-variance-authority";

import {headingVariants} from "@/shared/styles/components/heading";
import {cn} from "@/shared/utils/className-builder";

type HeadingVariants = VariantProps<typeof headingVariants>;

interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement>, HeadingVariants {
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
}

export const Heading: React.FC<HeadingProps> = ({
  as: HeadingTag = "h2",
  children,
  variant,
  className,
  ...props
}) => {
  return (
    <HeadingTag className={cn(headingVariants({variant}), className)} {...props}>
      {children}
    </HeadingTag>
  );
};
