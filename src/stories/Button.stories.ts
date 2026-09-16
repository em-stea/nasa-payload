import { ButtonsPage } from "./Button";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";

const meta = {
  title: "Components/Button",
  component: ButtonsPage,
  parameters: {
    options: { showPanel: false },
    layout: "padded",
  },
  
} satisfies Meta<typeof ButtonsPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Page: Story = {
  name: "Button",
};