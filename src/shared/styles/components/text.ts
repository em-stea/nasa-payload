import { cva } from 'class-variance-authority'

const commonClassnames = ['font-jetbrains-mono']

export const textVariants = cva(commonClassnames, {
  variants: {
    variant: {
      'body.1': 'text-4 lg:text-4 leading-[25.6px] lg:leading-[25.6px]',
      'body.2': 'text-4 lg:text-4 leading-[24px] lg:leading-[24px] uppercase font-bold',
      'body.3': 'text-3_5 lg:text-3_5 leading-[20px] lg:leading-[20px]',
      // 'subtitle.1': 'text-4 lg:text-4 leading-[22px] lg:leading-[22px]',
      // 'subtitle.2': 'text-3.5 lg:text-3.5 leading-[16px] lg:leading-[16px]',
      'button.1': 'text-4 lg:text-4 leading-[24px] lg:leading-[24px]',
      eyebrow: 'text-3 lg:text-3 leading-[16px] lg:leading-[16px] uppercase letter-spacing-[1.2px]',
      // 'detail.1': 'text-4 lg:text-4 leading-[18px] lg:leading-[18px]',
      // 'detail.2': 'text-3.5 lg:text-3.5 leading-[18px] lg:leading-[16px]',
    },
  },
  defaultVariants: {
    variant: 'body.1',
  },
})
