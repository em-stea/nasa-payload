import { cva } from 'class-variance-authority'

export const containerVariants = cva(['mx-auto', 'w-full'], {
  variants: {
    variant: {
      default: 'px-4 md:px-6 max-w-1400',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
})
