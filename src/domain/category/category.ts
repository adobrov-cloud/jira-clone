import { Issue } from "@domain/issue";

export type CategoryId = string;
export type CategoryType = (typeof categoryTypes)[number];
export const categoryTypes = ["PLANNED", "TODO", "IN_PROGRESS", "DONE"] as const;

export const categoryTypeDict: Record<CategoryType, string> = {
  PLANNED: "Planned",
  TODO: "To do",
  IN_PROGRESS: "In progress",
  DONE: "Done",
};

export interface Category {
  id: CategoryId;
  type: CategoryType;
  name: string;
  issues: Issue[];
  order: number;
  createdAt?: number;
  updatedAt?: number;
}
