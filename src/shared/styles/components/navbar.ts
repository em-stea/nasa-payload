import { cva } from 'class-variance-authority'

import { textVariants } from './text'

export const navbarVariants = cva([
  'flex',
  'w-full',
  'flex-col',
  'items-start',
  'border-b',
  'border-basic-00-10',
  //  'bg-basic-960-80',
  'bg-transparency-navbar',
  'backdrop-blur-[6px]',
])

export const navbarContainerVariants = cva([
  'mx-auto',
  'flex',
  'h-20',
  'w-full',
  'max-w-[1920px]',
  'items-center',
  'justify-between',
  'px-8',
])

export const navbarGroupVariants = cva(['flex', 'shrink-0', 'items-center'], {
  variants: {
    gap: {
      none: 'gap-0',
      sm: 'gap-1.5',
      md: 'gap-6',
    },
  },
  defaultVariants: {
    gap: 'none',
  },
})

export const navbarLogoVariants = cva([
  'relative',
  'block',
  'size-12',
  'shrink-0',
  'overflow-hidden',
])

export const navbarLogoImageVariants = cva(['size-full', 'object-cover'])

export const navbarLinkVariants = cva(
  [
    'inline-flex',
    'items-center',
    'gap-1.5',
    'text-btn-secondary',
    'transition-colors',
    'duration-200',
    'hover:text-blue-200',
    textVariants({ variant: 'body.4' }),
  ],
  {
    variants: {
      active: {
        true: 'text-blue-200',
      },
    },
    defaultVariants: {
      active: false,
    },
  },
)

export const navbarDotVariants = cva([
  'shrink-0',
  'rounded-full',
  'bg-red-200',
  'shadow-live-dot',
  'relative',
  'inline-flex',
  'size-2',
  'items-center',
  'justify-center',
  'animate-pulse',
  'mr-0.5',
])

export const navbarUserVariants = cva([
  'inline-flex',
  'shrink-0',
  'flex-col',
  'items-center',
  'justify-center',
  'rounded-full',
  'px-1.5',
  'pt-1.5',
  'pb-[13px]',
  'text-icon',
  'transition-colors',
  'duration-200',
  'hover:cursor-pointer',
  'hover:text-blue-50',
  'focus-visible:ring-2',
  'focus-visible:ring-blue-200',
  'focus-visible:outline-none',
])

export const navbarUserIconVariants = cva(['size-6'])
