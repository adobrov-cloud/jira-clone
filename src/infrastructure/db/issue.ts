import { Prisma } from "@prisma/client";
import { UserId } from "@domain/user";
import { CategoryType, CategoryId } from "@domain/category";
import { IssueId, Issue } from "@domain/issue";
import { Priority, PriorityId } from "@domain/priority";
import { Comment } from "@domain/comment";
import { dnull } from "src/utils/dnull";
import { formatIssueKey } from "@utils/issue-key";
import { db } from "./db.server";

// Shared Prisma query configuration for fetching issues with all related data
const issueInclude = {
  asignee: true,
  reporter: true,
  category: true,
  priority: true,
  comments: {
    include: {
      user: true,
    },
    orderBy: {
      createdAt: "asc" as const,
    },
  },
} satisfies Prisma.IssueInclude;

type IssueDbResult = Prisma.IssueGetPayload<{ include: typeof issueInclude }>;

// Maps a Prisma issue result to the domain Issue model
const mapIssueDbToIssue = (issueDb: IssueDbResult): Issue => ({
  id: issueDb.id,
  key: issueDb.key,
  name: issueDb.name,
  description: issueDb.description || undefined,
  categoryType: issueDb.category.type as CategoryType,
  priority: issueDb.priority as Priority,
  asignee: dnull(issueDb.asignee),
  reporter: dnull(issueDb.reporter),
  comments: issueDb.comments.map((comment) => ({
    ...comment,
    createdAt: comment.createdAt.getTime(),
    updatedAt: comment.updatedAt.getTime(),
    user: dnull({
      ...comment.user,
      createdAt: comment.user.createdAt.getTime(),
      updatedAt: comment.user.updatedAt.getTime(),
    }),
  })),
  createdAt: issueDb.createdAt.getTime(),
  updatedAt: issueDb.updatedAt.getTime(),
});

export const getIssue = async (issueId: IssueId): Promise<Issue | null> => {
  const issueDb = await db.issue.findUnique({
    where: { id: issueId },
    include: issueInclude,
  });

  return issueDb ? mapIssueDbToIssue(issueDb) : null;
};

export type CreateIssueInputData = {
  name: string;
  description: string;
  categoryId: CategoryId;
  priority: PriorityId;
  asigneeId: UserId;
  reporterId: UserId;
  comments: Comment[];
};
export const getIssueByKey = async (key: string): Promise<Issue | null> => {
  const issueDb = await db.issue.findUnique({
    where: { key },
    include: issueInclude,
  });

  return issueDb ? mapIssueDbToIssue(issueDb) : null;
};

export const createIssue = async (issue: CreateIssueInputData): Promise<IssueId> => {
  // Generate sequential issue key based on total count
  // Note: In high-concurrency scenarios, this could create duplicate keys if two issues
  // are created simultaneously. For production, consider using a database sequence or transaction.
  const issueCount = await db.issue.count();
  const key = formatIssueKey(issueCount + 1);

  const newIssue = await db.issue.create({
    data: {
      ...issue,
      key,
      priority: undefined,
      priorityId: issue.priority,
      comments: {
        create: issue.comments.map((comment) => {
          const commentInput: Omit<Prisma.CommentCreateInput, "issue"> = {
            id: comment.id,
            message: comment.message,
            user: { connect: { id: comment.user.id } },
          };

          return {
            ...commentInput,
            id: undefined,
          };
        }),
      },
    },
  });

  return newIssue.id as IssueId;
};

export type UpdateIssueInputData = CreateIssueInputData & { id: IssueId };
export const updateIssue = async (issue: UpdateIssueInputData) => {
  await db.issue.update({
    where: {
      id: issue.id,
    },
    data: {
      ...issue,
      priority: undefined,
      priorityId: issue.priority,
      comments: {
        upsert: issue.comments.map((comment) => {
          const commentInput: Omit<Prisma.CommentCreateInput, "issue"> = {
            id: comment.id,
            message: comment.message,
            user: { connect: { id: comment.user.id } },
          };

          return {
            where: { id: comment.id },
            create: {
              ...commentInput,
              id: undefined,
            },
            update: commentInput,
          };
        }),
      },
    },
  });
};

export type UpdateIssueCategoryData = {
  issueId: IssueId;
  categoryId: CategoryId;
};
export const updateIssueCategory = async ({ issueId, categoryId }: UpdateIssueCategoryData) => {
  await db.issue.update({
    where: {
      id: issueId,
    },
    data: {
      category: {
        connect: {
          id: categoryId,
        },
      },
    },
  });
};

export const deleteIssue = async (issueId: IssueId) => {
  await db.issue.delete({
    where: {
      id: issueId,
    },
  });
};
