import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Drawer } from "./Drawer";

const meta = {
  title: "Components/Drawer",
  component: Drawer,
  parameters: {
    options: { showPanel: false },
    layout: "padded",
  },
  
  
} satisfies Meta<typeof Drawer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Page: Story = {
  name: "Drawer",
};