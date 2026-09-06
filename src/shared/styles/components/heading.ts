import { cva } from 'class-variance-authority'

const commonClassnames = ['font-space-grotesk']

export const headingVariants = cva(commonClassnames, {
  variants: {
    variant: {
      'title.1': 'text-16 lg:text-16 leading-[80px] lg:leading-[80px] font-bold',
      'title.2': 'text-8 lg:text-8 leading-[40px] lg:leading-[40px] font-bold',
      'title.3': 'text-5 lg:text-5 leading-[28px] lg:leading-[28px] ',
    },
  },
  defaultVariants: {
    variant: 'title.1',
  },
})
