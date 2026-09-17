import type { Preview } from "@storybook/nextjs-vite";
import { withThemeByDataAttribute } from "@storybook/addon-themes";

import { SpaceGrotesk, JetBrainsMono } from "@/shared/styles/foundations/fonts"; 
import "../src/shared/styles/globals.css";

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
    (Story) => (
      <div className={`${SpaceGrotesk.variable} ${JetBrainsMono.variable}`}>
        <Story />
      </div>
    ),
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