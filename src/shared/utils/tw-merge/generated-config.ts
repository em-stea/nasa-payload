import config from "./helpers/generated-config.json";

export const tailwindMergeConfig = {
  extend: {
    theme: config,
  },
} as const;
