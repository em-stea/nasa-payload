import { cva } from 'class-variance-authority'

const commonClassnames = ['font-jetbrains-mono']

export const textVariants = cva(commonClassnames, {
  variants: {
    variant: {
      'body.1': 'text-4 lg:text-4 leading-6.4 lg:leading-6.4',
      'body.2': 'text-4 lg:text-4 leading-6 lg:leading-6 uppercase font-bold',
      'body.3': 'text-3.5 lg:text-3.5 leading-5 lg:leading-5',
      'body.4': 'text-3 lg:text-3 leading-3 lg:leading-3 tracking-1.2 uppercase font-bold',
      'button.2': 'text-4 lg:text-4 leading-6 lg:leading-6 font-bold',
      'button.1': 'text-4 lg:text-4 tracking-1.2 lg:leading-6',
      eyebrow: 'text-3 lg:text-3 leading-4 lg:leading-4 uppercase tracking-1.2',
      'meta.1': 'text-2.5 lg:text-2.5 leading-3.75 lg:leading-3.75 uppercase tracking-0.5',
      'nav.link': 'text-3 lg:text-3 leading-3 lg:leading-3 tracking-0.6 uppercase',
      'meta.2': 'text-2.5 lg:text-2.5 leading-3.75 lg:leading-3.75 uppercase tracking-1',

      /* Dato de telemetría: migas, fechas, filas de la sidebar, epígrafes. */
      'meta.3': 'text-3 lg:text-3 leading-4.2 lg:leading-4.2',
      'drawer.item': 'text-4 lg:text-4 leading-6 lg:leading-6',
      'card.title': 'font-space-grotesk text-5 lg:text-5 leading-7 lg:leading-7',
      'card.title.sm': 'font-space-grotesk text-4.5 lg:text-4.5 leading-7 lg:leading-7',
      'card.stat': 'text-4 lg:text-4 leading-6 lg:leading-6',
      'card.stat.label': 'text-3 lg:text-3 leading-3.75 lg:leading-3.75 uppercase',
    },
  },
  defaultVariants: {
    variant: 'body.1',
  },
})
