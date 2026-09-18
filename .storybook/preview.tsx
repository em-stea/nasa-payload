import type {Preview} from "@storybook/nextjs-vite";

import {withThemeByDataAttribute} from "@storybook/addon-themes";

import {JetBrainsMono, SpaceGrotesk} from "@/shared/styles/foundations/fonts";

import "../src/shared/styles/globals.css";

/* Las variables de next/font tienen que colgar de <html>, igual que en el layout de la app:
   globals.css declara `body {font-family: var(--font-space-grotesk)}` y ese token resuelve a
   `var(--font-primary)`. Si --font-primary vive en un div dentro del body, el body queda con la
   font-family inválida y las historias heredan la tipografía por defecto de Storybook. */
document.documentElement.classList.add(SpaceGrotesk.variable, JetBrainsMono.variable);

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: {
      test: "todo",
    },
    sidebar: {
      collapsedRoots: [],
    },
  },
  decorators: [
    withThemeByDataAttribute({
      attributeName: "data-theme",
      themes: {
        light: "light",
        dark: "dark",
      },
      defaultTheme: "dark",
    }),
  ],
};

export default preview;
