import { cva } from 'class-variance-authority'

import { textVariants } from './text'

const commonClassnames = [
  'inline-flex',
  'items-center',
  'justify-center',
  'hover:cursor-pointer',
  textVariants({ variant: 'button.1' }),
]

export const buttonVariants = cva(commonClassnames, {
  variants: {
    variant: {
      primary:
        'bg-blue-700 text-white hover:bg-blue-900 disabled:bg-gray-400 disabled:cursor-not-allowed loading:cursor-wait',
      'text-link':
        'text-foreground hover:text-highlight disabled:text-gray-400 letter-spacing-[1.6px]',
      secondary:
        'p-0 flex items-center justify-center size-10 bg-muted border border-muted-foreground hover:border-blue-200 focus:border-blue-200 focus-within:border-blue-200 ',
      ghost: 'bg-transparent p-0 flex items-center justify-center size-10 hover:border-blue-200 ',
    },
    size: {
      sm: 'px-0.9 py-0.9',
      md: 'px-6 py-3',
      intrinsic: 'w-fit',
      fullWidth: 'w-full',
    },
    loading: {
      true: 'cursor-wait',
    },
  },
  compoundVariants: [],
  defaultVariants: {
    variant: 'primary',
    size: 'md',
    loading: false,
  },
})
