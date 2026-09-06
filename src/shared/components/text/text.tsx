import { VariantProps } from 'class-variance-authority'

import { textVariants } from '@/shared/styles/components/text'
import { cn } from '@/shared/utils/className-builder'

type TextVariants = VariantProps<typeof textVariants>

interface TextProps extends React.HTMLAttributes<HTMLParagraphElement>, TextVariants {}

export const Text: React.FC<TextProps> = ({ children, variant, className, ...props }) => {
  return (
    <p className={cn(textVariants({ variant }), className)} {...props}>
      {children}
    </p>
  )
}
