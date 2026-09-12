import { cva } from 'class-variance-authority'

export const separatorVariants = cva(
  [
    'shrink-0',

    'data-[orientation=horizontal]:h-px',
    'data-[orientation=horizontal]:w-full',
    'data-[orientation=vertical]:h-full',
    'data-[orientation=vertical]:w-px',
  ],
  {
    variants: {
      variant: {
        light: 'bg-basic-00-10',
        dark: 'bg-border',
      },
    },
    defaultVariants: {
      variant: 'light',
    },
  },
)
