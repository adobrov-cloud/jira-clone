import type { Meta, StoryObj } from "@storybook/react";
import { IssueTypeIcon } from "./issue-type-icon";

const meta = {
  title: "Components/IssueTypeIcon",
  component: IssueTypeIcon,
  tags: ["autodocs"],
  argTypes: {
    type: {
      control: "select",
      options: ["task", "bug", "story"],
    },
    size: {
      control: "number",
    },
  },
} satisfies Meta<typeof IssueTypeIcon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AllTypes: Story = {
  args: {
    type: "task",
    size: 24,
  },
  render: () => (
    <div className="flex items-center gap-6 p-4">
      <div className="flex flex-col items-center gap-2">
        <IssueTypeIcon type="task" size={24} />
        <span className="text-sm text-font-subtle">Task (Blue)</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <IssueTypeIcon type="bug" size={24} />
        <span className="text-sm text-font-subtle">Bug (Red)</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <IssueTypeIcon type="story" size={24} />
        <span className="text-sm text-font-subtle">Story (Green)</span>
      </div>
    </div>
  ),
};

export const Task: Story = {
  args: {
    type: "task",
    size: 18,
  },
};

export const Bug: Story = {
  args: {
    type: "bug",
    size: 18,
  },
};

export const StoryType: Story = {
  args: {
    type: "story",
    size: 18,
  },
};

export const Large: Story = {
  args: {
    type: "bug",
    size: 32,
  },
};
