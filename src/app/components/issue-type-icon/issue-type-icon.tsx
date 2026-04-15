import cx from "classix";
import { FaCheckSquare, FaBug, FaBookmark } from "react-icons/fa";
import { IssueTypeId } from "@domain/issue-type";
import type { IconType } from "react-icons";

// Maps issue types to their corresponding icon components
const ISSUE_TYPE_ICONS: Record<IssueTypeId, IconType> = {
  task: FaCheckSquare,
  bug: FaBug,
  story: FaBookmark,
};

// Maps issue types to their color classes — matches Jira's visual language
const ISSUE_TYPE_COLORS: Record<IssueTypeId, string> = {
  task: "text-icon-accent-blue",
  bug: "text-icon-accent-red",
  story: "text-icon-accent-green",
};

export const IssueTypeIcon = ({
  type,
  size = 18,
}: IssueTypeIconProps): JSX.Element => {
  const Icon = ISSUE_TYPE_ICONS[type];
  const colorClass = ISSUE_TYPE_COLORS[type];

  return (
    <span className={cx("flex", colorClass)}>
      <Icon size={size} />
    </span>
  );
};

interface IssueTypeIconProps {
  type: IssueTypeId;
  size?: number;
}
