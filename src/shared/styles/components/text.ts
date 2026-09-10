import { cva } from 'class-variance-authority'

const commonClassnames = ['font-jetbrains-mono']

export const textVariants = cva(commonClassnames, {
  variants: {
    variant: {
      'body.1': 'text-4 lg:text-4 leading-[25.6px] lg:leading-[25.6px]',
      'body.2': 'text-4 lg:text-4 leading-[24px] lg:leading-[24px] uppercase font-bold',
      'body.3': 'text-3_5 lg:text-3_5 leading-[20px] lg:leading-[20px]',
      'button.1': 'text-4 lg:text-4 leading-[24px] lg:leading-[24px]',
      eyebrow: 'text-3 lg:text-3 leading-[16px] lg:leading-[16px] uppercase tracking-[1.2px]',
      'meta.1':
        'text-2_5 lg:text-2_5 leading-[15px] lg:leading-[15px] uppercase tracking-[0.5px]',
      'card.title':
        'font-space-grotesk text-5 lg:text-5 leading-[28px] lg:leading-[28px]',
    },
  },
  defaultVariants: {
    variant: 'body.1',
  },
})
