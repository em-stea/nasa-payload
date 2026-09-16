import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Symbols } from "./Symbols";

const meta = {
  title: "Foundations/Symbols",
  component: Symbols,
  parameters: {
    options: { showPanel: false },
    layout: "padded",
  },
} satisfies Meta<typeof Symbols>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Page: Story = {
  name: "Symbols",
};