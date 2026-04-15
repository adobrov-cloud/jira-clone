export type IssueTypeId = "task" | "bug" | "story";

export type IssueType = {
  id: IssueTypeId;
  name: string;
};

export const issueTypes = ["task", "bug", "story"] as const;

export const issueTypeDict: Record<IssueTypeId, string> = {
  task: "Task",
  bug: "Bug",
  story: "Story",
};
