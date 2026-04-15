import type { Meta, StoryObj } from "@storybook/react-vite";
import { unstable_createRemixStub as createRemixStub } from "@remix-run/testing";
import { BoardView } from "./board.view";
import { Project } from "@domain/project";
import { Category, CategoryType } from "@domain/category";
import { Issue } from "@domain/issue";
import { usersMock, userMock1, userMock2 } from "@domain/user";
import { priorityHigh, priorityMedium, priorityLow } from "@domain/priority";

// Mock issues for each category - diverse and realistic data
const plannedIssues: Issue[] = [
  {
    id: "planned-001-uuid-example",
    name: "Research competitor pricing models for enterprise tier",
    description: "Analyze 5 major competitors",
    reporter: userMock1,
    asignee: userMock2,
    comments: [],
    priority: priorityMedium,
    categoryType: "PLANNED",
    createdAt: Date.now() - 86400000 * 3,
    updatedAt: Date.now() - 86400000 * 2,
  },
  {
    id: "planned-002-uuid-example",
    name: "Design system audit and documentation update",
    description: "Review all components",
    reporter: userMock2,
    asignee: usersMock[3],
    comments: [],
    priority: priorityLow,
    categoryType: "PLANNED",
    createdAt: Date.now() - 86400000 * 5,
    updatedAt: Date.now() - 86400000 * 4,
  },
  {
    id: "planned-003-uuid-example",
    name: "API rate limiting implementation proposal",
    description: "Draft technical spec",
    reporter: usersMock[2],
    asignee: userMock1,
    comments: [],
    priority: priorityHigh,
    categoryType: "PLANNED",
    createdAt: Date.now() - 86400000 * 2,
    updatedAt: Date.now() - 86400000 * 1,
  },
];

const todoIssues: Issue[] = [
  {
    id: "todo-001-uuid-example",
    name: "Implement user notification preferences page",
    description: "Allow users to configure email and push notifications",
    reporter: userMock1,
    asignee: userMock1,
    comments: [],
    priority: priorityHigh,
    categoryType: "TODO",
    createdAt: Date.now() - 86400000 * 7,
    updatedAt: Date.now() - 86400000 * 6,
  },
  {
    id: "todo-002-uuid-example",
    name: "Add export to CSV functionality for reports",
    description: "Enable data export feature",
    reporter: userMock2,
    asignee: usersMock[4],
    comments: [],
    priority: priorityMedium,
    categoryType: "TODO",
    createdAt: Date.now() - 86400000 * 4,
    updatedAt: Date.now() - 86400000 * 3,
  },
];

const inProgressIssues: Issue[] = [
  {
    id: "inprogress-001-uuid-example",
    name: "Refactor authentication middleware for better error handling",
    description: "Improve error messages and logging",
    reporter: userMock1,
    asignee: userMock2,
    comments: [],
    priority: priorityHigh,
    categoryType: "IN_PROGRESS",
    createdAt: Date.now() - 86400000 * 10,
    updatedAt: Date.now() - 86400000 * 1,
  },
  {
    id: "inprogress-002-uuid-example",
    name: "Database query optimization for dashboard metrics",
    description: "Reduce query time by 50%",
    reporter: usersMock[3],
    asignee: usersMock[2],
    comments: [],
    priority: priorityMedium,
    categoryType: "IN_PROGRESS",
    createdAt: Date.now() - 86400000 * 8,
    updatedAt: Date.now() - 86400000 * 2,
  },
  {
    id: "inprogress-003-uuid-example",
    name: "Mobile responsive fixes for settings page",
    description: "Fix layout issues on small screens",
    reporter: userMock2,
    asignee: userMock1,
    comments: [],
    priority: priorityLow,
    categoryType: "IN_PROGRESS",
    createdAt: Date.now() - 86400000 * 5,
    updatedAt: Date.now() - 86400000 * 1,
  },
];

const doneIssues: Issue[] = [
  {
    id: "done-001-uuid-example",
    name: "Update third-party dependencies to latest versions",
    description: "Security patches applied",
    reporter: userMock1,
    asignee: userMock1,
    comments: [],
    priority: priorityHigh,
    categoryType: "DONE",
    createdAt: Date.now() - 86400000 * 14,
    updatedAt: Date.now() - 86400000 * 7,
  },
  {
    id: "done-002-uuid-example",
    name: "Fix timezone bug in scheduled reports",
    description: "Reports now use user's local timezone",
    reporter: usersMock[4],
    asignee: usersMock[3],
    comments: [],
    priority: priorityMedium,
    categoryType: "DONE",
    createdAt: Date.now() - 86400000 * 12,
    updatedAt: Date.now() - 86400000 * 8,
  },
];

// Categories with the new PLANNED column first (order 0)
const categories: Category[] = [
  {
    id: "cat-planned-001",
    type: "PLANNED" as CategoryType,
    name: "Planned",
    issues: plannedIssues,
    order: 0,
    createdAt: Date.now() - 86400000 * 30,
    updatedAt: Date.now(),
  },
  {
    id: "cat-todo-001",
    type: "TODO" as CategoryType,
    name: "To do",
    issues: todoIssues,
    order: 1,
    createdAt: Date.now() - 86400000 * 30,
    updatedAt: Date.now(),
  },
  {
    id: "cat-inprogress-001",
    type: "IN_PROGRESS" as CategoryType,
    name: "In progress",
    issues: inProgressIssues,
    order: 2,
    createdAt: Date.now() - 86400000 * 30,
    updatedAt: Date.now(),
  },
  {
    id: "cat-done-001",
    type: "DONE" as CategoryType,
    name: "Done",
    issues: doneIssues,
    order: 3,
    createdAt: Date.now() - 86400000 * 30,
    updatedAt: Date.now(),
  },
];

// Project mock with all 4 categories
const mockProject: Project = {
  id: "project-board-story",
  name: "Board View Demo Project",
  description: "A project to demonstrate the board view with all 4 columns",
  users: usersMock.slice(0, 5),
  categories: categories,
  image: "/images/projects/1.svg",
  createdAt: Date.now() - 86400000 * 60,
  updatedAt: Date.now(),
};

// Create a wrapper component that renders inside RemixStub
const BoardViewWrapper = ({ project }: { project: Project }) => {
  return (
    <div className="h-screen w-full p-4 bg-elevation-surface">
      <BoardView project={project} />
    </div>
  );
};

const meta: Meta<typeof BoardView> = {
  title: "Views/BoardView",
  component: BoardView,
  parameters: {
    layout: "fullscreen",
  },
  decorators: [
    (Story, context) => {
      const project = context.args.project || mockProject;
      const RemixStub = createRemixStub([
        {
          path: "/",
          Component: () => <BoardViewWrapper project={project} />,
          children: [
            {
              path: "issue/:issueId",
              Component: () => <div />,
            },
            {
              path: "issue/new",
              Component: () => <div />,
            },
          ],
        },
      ]);
      return <RemixStub />;
    },
  ],
};

export default meta;
type Story = StoryObj<typeof BoardView>;

export const Default: Story = {
  args: {
    project: mockProject,
  },
};

export const WithEmptyPlanned: Story = {
  args: {
    project: {
      ...mockProject,
      categories: categories.map((cat) =>
        cat.type === "PLANNED" ? { ...cat, issues: [] } : cat
      ),
    },
  },
};

export const AllColumnsWithIssues: Story = {
  args: {
    project: mockProject,
  },
};
