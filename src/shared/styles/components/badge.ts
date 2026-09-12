import { cva } from 'class-variance-authority'

import { textVariants } from './text'

const commonClassnames = [
  'inline-flex',
  'w-fit',
  'shrink-0',
  'items-center',
  'justify-center',
  'gap-1',
  'overflow-hidden',
  'rounded-full',
  'border',
  'border-transparent',
  'px-2',
  'py-0.5',
  'text-xs',
  'font-medium',
  'whitespace-nowrap',
  'transition-[color,box-shadow]',
  'focus-visible:border-ring',
  'focus-visible:ring',
  'focus-visible:ring-ring/50',
  'aria-invalid:border-destructive',
  'aria-invalid:ring-destructive/20',
  'dark:aria-invalid:ring-destructive/40',
  '[&>svg]:pointer-events-none',
  '[&>svg]:size-3',
]

export const badgeVariants = cva(commonClassnames, {
  variants: {
    variant: {
      default: 'bg-primary text-primary-foreground [a&]:hover:bg-primary/90',
      secondary: 'bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90',
      destructive:
        'bg-destructive text-white focus-visible:ring-destructive/20 dark:bg-destructive/60 dark:focus-visible:ring-destructive/40 [a&]:hover:bg-destructive/90',
      outline:
        'border-border text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground',
      ghost: '[a&]:hover:bg-accent [a&]:hover:text-accent-foreground',
      link: 'text-primary underline-offset-4 [a&]:hover:underline',
      /** Tag que se apoya sobre media; el color lo pone `tone`. */
      media: [
        'rounded-lg',
        'border-basic-00-10',
        'bg-basic-960-80',
        'px-3',
        'py-2',
        'pt-2.75',
        'backdrop-blur-xs',
        textVariants({ variant: 'meta.1' }),
      ],
      alert: [
        'rounded-lg',
        'border-red-200-30',
        'bg-red-700-20',
        'px-2',
        'py-1',
        'font-normal',
        'text-red-200',
        textVariants({ variant: 'meta.1' }),
      ],
    },
    tone: {
      blue: '',
      red: '',
      orange: '',
    },
  },
  compoundVariants: [
    { variant: 'media', tone: 'blue', class: 'text-blue-200' },
    { variant: 'media', tone: 'red', class: 'text-red-300' },
    { variant: 'media', tone: 'orange', class: 'text-orange-200' },
  ],
  defaultVariants: {
    variant: 'default',
  },
})
