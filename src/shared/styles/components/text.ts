import {cva} from "class-variance-authority";

const commonClassnames = ["font-jetbrains-mono"];

export const textVariants = cva(commonClassnames, {
  variants: {
    variant: {
      "body.1": "leading-6.4 lg:leading-6.4 text-3.5 lg:text-4",
      "body.2": "text-4 leading-6 font-bold uppercase lg:text-4 lg:leading-6",
      "body.3": "text-3.5 leading-5.5 lg:text-3.5 lg:leading-5.5",
      "body.4": "text-3 leading-3 font-bold tracking-1.2 uppercase lg:text-3 lg:leading-3",
      "button.2": "text-4 leading-6 font-bold lg:text-4 lg:leading-6",
      "button.1": "text-3.5 tracking-1.2 uppercase lg:text-3.5 lg:leading-6",
      eyebrow: "text-3 leading-4 tracking-1.2 uppercase lg:text-3 lg:leading-4",
      "meta.1": "text-3 leading-3.75 tracking-0.5 uppercase lg:text-3 lg:leading-3.75",
      "nav.link":
        "text-3,5 leading-3.5 font-bold tracking-widest uppercase lg:text-3.5 lg:leading-3.5",
      "meta.2": "text-2.5 leading-3.75 tracking-1 uppercase lg:text-2.5 lg:leading-3.75",

      /* Dato de telemetría: migas, fechas, filas de la sidebar, epígrafes. */
      "meta.3": "leading-4.2 lg:leading-4.2 text-3 lg:text-3",
      "drawer.item": "text-4 leading-6 lg:text-4 lg:leading-6",
      "card.title": "font-space-grotesk text-5 leading-7 lg:text-5 lg:leading-7",
      "card.title.sm": "font-space-grotesk text-4.5 leading-7 lg:text-4.5 lg:leading-7",
      "card.stat": "text-4 leading-6 lg:text-4 lg:leading-6",
      "card.stat.label": "text-3 leading-3.75 uppercase lg:text-3 lg:leading-3.75",
    },
  },
  defaultVariants: {
    variant: "body.1",
  },
});
