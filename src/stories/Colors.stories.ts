import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Colors } from "./Colors";

const meta = {
  title: "Foundations/Color",
  component: Colors,
  parameters: {
    options: { showPanel: false },
    layout: "padded",
  },
  
} satisfies Meta<typeof Colors>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Page: Story = {
  name: "Color",
};