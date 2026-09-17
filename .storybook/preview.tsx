import type {Preview} from "@storybook/nextjs";

import {withThemeByDataAttribute} from "@storybook/addon-themes";

import "../src/shared/styles/globals.css";

const preview: Preview = {
  decorators: [
    (Story) => (
      <div className="font-sans">
        <Story />
      </div>
    ),
    withThemeByDataAttribute({
      attributeName: "data-theme",
      themes: {light: "light", dark: "dark"},
      defaultTheme: "dark",
    }),
  ],
};

export default preview;
