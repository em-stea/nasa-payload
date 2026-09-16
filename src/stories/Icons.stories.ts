import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Icons } from "./Icons";

const meta = {
  title: "Foundations/Icons",
  component: Icons,
  parameters: {
    options: { showPanel: false },
    layout: "padded",
  },
} satisfies Meta<typeof Icons>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Page: Story = {
  name: "Icons",
};