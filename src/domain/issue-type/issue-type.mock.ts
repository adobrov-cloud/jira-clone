import { IssueType } from "./issue-type";

export const issueTypesMock: IssueType[] = [
  {
    id: "task",
    name: "Task",
  },
  {
    id: "bug",
    name: "Bug",
  },
  {
    id: "story",
    name: "Story",
  },
];

export const issueTypeTask = issueTypesMock[0];
export const issueTypeBug = issueTypesMock[1];
export const issueTypeStory = issueTypesMock[2];
