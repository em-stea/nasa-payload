import { cva } from 'class-variance-authority'

import { textVariants } from './text'

export const cardVariants = cva(
  [
    'group',
    'relative',
    'flex',
    'flex-col',
    'isolate',
    'overflow-hidden',
    'rounded-2xl',
    'border',
    'border-basic-00-10',
    'bg-card-foreground',
    'shadow-card',
    'backdrop-blur-[8px]',
    'transition-[border-color]',
    'duration-300',
  ],
  {
    variants: {
      tone: {
        blue: 'hover:border-foreground',
        red: 'hover:border-red-300',
        orange: 'hover:border-orange-200',
      },
    },
    defaultVariants: {
      tone: 'blue',
    },
  },
)

export const cardHeaderVariants = cva('relative h-48 w-full shrink-0 overflow-hidden')

export const cardImageVariants = cva([
  'absolute',
  'inset-0',
  'size-full',
  'object-cover',
  'transition-transform',
  'duration-500',
  'ease-out',
  'group-hover:scale-105',
])

export const cardTagVariants = cva('absolute top-4 left-4')

export const cardBodyVariants = cva('flex w-full flex-col gap-2 px-4 pt-4')

export const cardTitleVariants = cva(
  ['transition-colors', 'duration-300', textVariants({ variant: 'card.title' })],
  {
    variants: {
      tone: {
        blue: 'text-primary-foreground group-hover:text-foreground',
        red: 'text-basic-00 group-hover:text-red-300',
        orange: 'text-basic-00 group-hover:text-orange-200',
      },
    },
    defaultVariants: {
      tone: 'blue',
    },
  },
)

export const cardDescriptionVariants = cva([
  'text-btn-secondary',
  textVariants({ variant: 'body.3' }),
])

export const cardFooterVariants = cva('flex w-full items-center px-4 pb-[19px] pt-2')

export const cardDateVariants = cva(['text-basic-500', textVariants({ variant: 'meta.1' })])
