import type { Meta, StoryObj } from "@storybook/react-vite";
import { IssueTypeIcon } from "./issue-type-icon";
import { issueTypes } from "@domain/issue-type";

const meta: Meta<typeof IssueTypeIcon> = {
  title: "Components/IssueTypeIcon",
  component: IssueTypeIcon,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    type: {
      control: {
        type: "select",
      },
      options: issueTypes,
    },
    size: {
      control: {
        type: "number",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof IssueTypeIcon>;

export const AllVariants: Story = {
  render: () => (
    <div className="flex items-center gap-6">
      <div className="flex flex-col items-center gap-2">
        <IssueTypeIcon type="task" size={24} />
        <span className="text-sm text-text-subtle">Task</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <IssueTypeIcon type="bug" size={24} />
        <span className="text-sm text-text-subtle">Bug</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <IssueTypeIcon type="story" size={24} />
        <span className="text-sm text-text-subtle">Story</span>
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

export const IssueStory: Story = {
  args: {
    type: "story",
    size: 18,
  },
};

export const LargeSizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <IssueTypeIcon type="task" size={16} />
      <IssueTypeIcon type="task" size={24} />
      <IssueTypeIcon type="task" size={32} />
      <IssueTypeIcon type="task" size={48} />
    </div>
  ),
};
