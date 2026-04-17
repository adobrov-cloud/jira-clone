import type { Meta, StoryObj } from "@storybook/react";
import { unstable_createRemixStub as createRemixStub } from "@remix-run/testing";

import { UserContextProvider } from "@app/store/user.store";
import { userMock1, usersMock } from "@domain/user";
import { CreateProjectPanelView } from "./create-project-panel.view";

const meta: Meta<typeof CreateProjectPanelView> = {
  title: "UI/Projects/CreateProjectPanelView",
  component: CreateProjectPanelView,
  parameters: {
    layout: "fullscreen",
  },
  decorators: [
    (Story) => {
      // Wraps stories with Remix routing stub and user context
      // Required for Form component actions and user authentication state
      const RemixStub = createRemixStub([
        {
          path: "/*",
          Component: () => (
            <UserContextProvider user={userMock1}>
              <Story />
            </UserContextProvider>
          ),
          // Mock successful form submission response
          action: () => ({ ok: true }),
        },
      ]);
      return <RemixStub initialEntries={["/projects/new"]} />;
    },
  ],
};

export default meta;
type Story = StoryObj<typeof CreateProjectPanelView>;

/**
 * Default state: empty form for creating a new project.
 * Shows available team members to assign to the project.
 */
export const Default: Story = {
  args: {
    users: usersMock.slice(0, 5),
  },
};

/**
 * Edit mode: form pre-populated with existing project data.
 * Used when updating an existing project's details.
 */
export const WithProject: Story = {
  args: {
    project: {
      id: "project-1",
      name: "My Test Project",
      description: "This is a sample project description for testing purposes.",
      image: "/images/default-project.png",
      users: [userMock1],
      categories: [],
    },
    users: usersMock.slice(0, 5),
  },
};
