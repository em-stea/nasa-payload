import { Badges } from "./Badge";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";

const meta = {
  title: "Components/Badge",
  component: Badges,
  parameters: {
    options: { showPanel: false },
    layout: "padded",
  },
  
} satisfies Meta<typeof Badges>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Page: Story = {
  name: "Badge",
};