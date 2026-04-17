import type { Meta, StoryObj } from "@storybook/react";
import { unstable_createRemixStub as createRemixStub } from "@remix-run/testing";
import { CreateProjectPanelView } from "./create-project-panel.view";
import { usersMock, userMock1 } from "@domain/user";
import { UserContextProvider } from "@app/store/user.store";

const meta: Meta<typeof CreateProjectPanelView> = {
  title: "UI/Projects/CreateProjectPanelView",
  component: CreateProjectPanelView,
  parameters: {
    layout: "fullscreen",
  },
  decorators: [
    (Story) => {
      const RemixStub = createRemixStub([
        {
          path: "/*",
          Component: () => (
            <UserContextProvider user={userMock1}>
              <Story />
            </UserContextProvider>
          ),
          action: () => ({ ok: true }),
        },
      ]);
      return <RemixStub initialEntries={["/projects/new"]} />;
    },
  ],
};

export default meta;
type Story = StoryObj<typeof CreateProjectPanelView>;

export const Default: Story = {
  args: {
    users: usersMock.slice(0, 5),
  },
};

export const WithProject: Story = {
  args: {
    project: {
      id: "project-1",
      name: "My Test Project",
      description: "This is a sample project description for testing purposes.",
      image: "/images/default-project.png",
      users: [userMock1],
    },
    users: usersMock.slice(0, 5),
  },
};
