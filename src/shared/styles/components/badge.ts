import { cva } from 'class-variance-authority'

import { textVariants } from './text'

const commonClassnames = [
  'inline-flex',
  'w-fit',
  'shrink-0',
  'items-center',
  'justify-center',
  'gap-2',
  'overflow-hidden',
  'rounded-lg',
  'border',
  'border-transparent',
  'px-3',
  'py-1',
  textVariants({ variant: 'eyebrow' }),
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
      default: 'bg-blue-700-20 text-blue-200 border border-blue-200-30',
      // secondary: 'bg-secondary text-secondary-foreground',
      destructive: 'bg-destructive text-destructive-foreground',
      // outline:
      //   'border-border text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground',
      // ghost: '[a&]:hover:bg-accent [a&]:hover:text-accent-foreground',
      // link: 'text-primary underline-offset-4 [a&]:hover:underline',
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

export const badgeDotVariants = cva('size-2 shrink-0 rounded-full', {
  variants: {
    variant: {
      default: 'bg-blue-200',
      media: '',
      destructive: 'bg-destructive text-destructive-foreground',
      alert: 'bg-red-200-30',
    },
    tone: {
      blue: 'bg-blue-200',
      red: 'bg-red-300',
      orange: 'bg-orange-200',
    },
  },
  compoundVariants: [
    { variant: 'media', tone: 'blue', class: 'bg-blue-200' },
    { variant: 'media', tone: 'red', class: 'bg-red-300' },
    { variant: 'media', tone: 'orange', class: 'bg-orange-200' },
  ],
  defaultVariants: {
    variant: 'default',
  },
})
