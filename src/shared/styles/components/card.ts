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
      padding: {
        none: '',
        md: 'gap-4 p-4',
      },
    },
    defaultVariants: {
      tone: 'blue',
      padding: 'none',
    },
  },
)

export const cardHeaderVariants = cva('', {
  variants: {
    variant: {
      media: 'relative h-48 w-full shrink-0 overflow-hidden',
      bar: 'flex w-full shrink-0 items-start justify-between gap-2',
    },
  },
  defaultVariants: {
    variant: 'media',
  },
})

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

export const cardBodyVariants = cva('flex w-full flex-col', {
  variants: {
    variant: {
      article: 'gap-2 px-4 pt-4',
      plain: 'gap-3',
    },
  },
  defaultVariants: {
    variant: 'article',
  },
})

export const cardTitleVariants = cva(['transition-colors', 'duration-300'], {
  variants: {
    tone: {
      blue: 'text-primary-foreground group-hover:text-foreground',
      red: 'text-basic-00 group-hover:text-red-300',
      orange: 'text-basic-00 group-hover:text-orange-200',
    },
    size: {
      md: textVariants({ variant: 'card.title' }),
      sm: textVariants({ variant: 'card.title.sm' }),
    },
  },
  defaultVariants: {
    tone: 'blue',
    size: 'md',
  },
})

export const cardDescriptionVariants = cva([
  'text-btn-secondary',
  textVariants({ variant: 'body.3' }),
])

export const cardFooterVariants = cva('flex w-full px-4', {
  variants: {
    variant: {
      meta: 'items-center pb-[19px] pt-2',
      stats: 'items-start gap-2 border-t border-basic-00-10 pt-[17px] pb-4',
    },
  },
  defaultVariants: {
    variant: 'meta',
  },
})

export const cardDateVariants = cva(['text-basic-500', textVariants({ variant: 'meta.1' })])

export const cardStatVariants = cva('flex min-w-0 flex-col', {
  variants: {
    layout: {
      inline: 'flex-1 gap-px',
      stacked: 'w-full gap-[3px] pb-px',
    },
  },
  defaultVariants: {
    layout: 'inline',
  },
})

export const cardStatLabelVariants = cva([
  'text-basic-500',
  textVariants({ variant: 'card.stat.label' }),
])

export const cardStatValueVariants = cva('truncate', {
  variants: {
    size: {
      md: textVariants({ variant: 'card.stat' }),
      sm: textVariants({ variant: 'body.3' }),
    },
    tone: {
      default: 'text-basic-00',
      highlight: 'text-blue-200',
    },
  },
  defaultVariants: {
    size: 'md',
    tone: 'default',
  },
})

export const cardAlertDotVariants = cva('size-1.5 shrink-0 rounded-full bg-red-200')
