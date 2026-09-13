import { cva } from 'class-variance-authority'

import { textVariants } from './text'

const commonClassnames = [
  'inline-flex',
  'items-center',
  'justify-center',
  'rounded-lg',
  'hover:cursor-pointer',
  textVariants({ variant: 'button.1' }),
]

export const buttonVariants = cva(commonClassnames, {
  variants: {
    variant: {
      primary:
        'bg-blue-700 text-basic-00 hover:bg-blue-900 hover:outline hover:outline-blue-200-30 disabled:bg-gray-400 disabled:cursor-not-allowed loading:cursor-wait',
      'text-link':
        'text-foreground hover:text-highlight disabled:text-gray-400 tracking-1.6 flex items-center gap-2',
      secondary:
        'p-0 flex items-center justify-center size-10 bg-muted border border-muted-foreground hover:border-blue-200 focus:border-blue-200 focus-within:border-blue-200 ',
      ghost: 'bg-transparent p-0 flex items-center justify-center size-10 hover:border-blue-200 ',
    },
    size: {
      sm: 'px-0.9 py-0.9',
      md: 'px-6 py-3 w-auto max-w-fit',
      xs: 'px-4.25 py-2.25 w-auto max-w-fit',
      intrinsic: 'w-fit',
      fullWidth: 'w-full',
    },
    loading: {
      true: 'cursor-wait',
    },
    active: {
      true: '',
      false: '',
    },
  },
  compoundVariants: [
    {
      variant: 'secondary',
      size: 'xs',
      className:
        'size-auto shrink-0 whitespace-nowrap border-border bg-background text-3 leading-3 tracking-1_2 font-bold uppercase text-primary-foreground transition-colors duration-200 hover:text-foreground',
    },
    {
      variant: 'secondary',
      size: 'xs',
      active: true,
      className:
        'border-blue-700 bg-blue-700 text-basic-00 hover:border-blue-700 hover:bg-blue-700 hover:text-basic-00 focus:border-blue-700 focus-within:border-blue-700',
    },
  ],
  defaultVariants: {
    variant: 'primary',
    size: 'md',
    loading: false,
    active: false,
  },
})
