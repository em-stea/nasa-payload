import { cva } from 'class-variance-authority'

import { textVariants } from './text'

const commonClassnames = [
  'inline-flex',
  'items-center',
  'justify-center',
  'hover:cursor-pointer',
  'rounded-lg',
  textVariants({ variant: 'button.1' }),
]

export const buttonVariants = cva(commonClassnames, {
  variants: {
    variant: {
      primary: 'bg-blue-700 text-white hover:bg-blue-900 disabled:bg-gray-400 ',
      'text-link':
        'text-blue-200 hover:text-blue-900 disabled:text-gray-400 letter-spacing-[1.6px]',
      // secondary: 'border border-blue-700 bg-transparent text-blue-700 hover:bg-blue-50',
      // ghost: 'bg-transparent p-0',
    },
    size: {
      // sm: 'px-2.5 py-1.5',
      md: 'px-6 py-3',
      // lg: 'px-6 py-3',
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
