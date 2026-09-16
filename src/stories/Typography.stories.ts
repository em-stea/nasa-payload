import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Typography } from "./Typography";

const meta = {
  title: "Foundations/Typography",
  component: Typography,
  parameters: {
    options: { showPanel: false },
    layout: "padded",
  },
} satisfies Meta<typeof Typography>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Page: Story = {
  name: "Typography",
};