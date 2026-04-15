import { User, UserId } from "../user";
import { CategoryType } from "@domain/category";
import { Comment } from "../comment";
import { Priority } from "../priority";
import { IssueTypeId } from "../issue-type";

export type IssueId = string;
export interface Issue {
  id: UserId;
  name: string;
  description?: string;
  type?: IssueTypeId;
  categoryType?: CategoryType;
  reporter: User;
  asignee: User;
  comments: Comment[];
  priority: Priority;
  createdAt: number;
  updatedAt: number;
}
