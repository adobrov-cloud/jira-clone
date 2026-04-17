import type { Meta, StoryObj } from "@storybook/react";
import { usersMock, userMock1 } from "@domain/user";
import { withRemixStub, withMainContext } from "@app/stories/utils";
import { CreateProjectPanelView } from "./create-project-panel.view";

const meta: Meta<typeof CreateProjectPanelView> = {
  title: "Pages/Projects/CreateProjectPanelView",
  component: CreateProjectPanelView,
  parameters: {
    layout: "centered",
  },
  decorators: [(Story) => withRemixStub(withMainContext(Story))],
};

export default meta;
type Story = StoryObj<typeof CreateProjectPanelView>;

export const Default: Story = {
  args: {
    users: usersMock,
  },
};

export const WithProject: Story = {
  args: {
    project: {
      id: "project-123",
      name: "My Existing Project",
      description: "This is a description for an existing project being edited",
      image: "1.svg",
      users: [userMock1],
    },
    users: usersMock,
  },
};

export const FewUsers: Story = {
  args: {
    users: usersMock.slice(0, 3),
  },
};
