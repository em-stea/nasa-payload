import { cva } from 'class-variance-authority'

const commonClassnames = ['font-space-grotesk']

export const headingVariants = cva(commonClassnames, {
  variants: {
    variant: {
      'title.1': 'text-16 lg:text-16 leading-20 lg:leading-20 font-bold',
      'title.2': 'text-8 lg:text-8 leading-10 lg:leading-10 font-bold',
      'title.3': 'text-5 lg:text-5 leading-7 lg:leading-7 ',
      'title.4': 'text-3_5 lg:text-3_5 leading-5 lg:leading-5 font-bold',
    },
  },
  defaultVariants: {
    variant: 'title.1',
  },
})
