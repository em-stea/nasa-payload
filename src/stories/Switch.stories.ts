import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { SwitchPage } from "./Switch";

const meta = {
  title: "Components/Switch",
  component: SwitchPage,
  parameters: {
    options: { showPanel: false },
    layout: "padded",
  },
} satisfies Meta<typeof SwitchPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Page: Story = {
  name: "Switch",
};