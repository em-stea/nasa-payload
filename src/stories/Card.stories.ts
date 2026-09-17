import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { CardsPage } from "./Card";

const meta = {
  title: "Components/Card",
  component: CardsPage,
  parameters: {
    options: { showPanel: false },
    layout: "padded",
  },
  
} satisfies Meta<typeof CardsPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Page: Story = {
  name: "Card",
};