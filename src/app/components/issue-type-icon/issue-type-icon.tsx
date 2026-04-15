import cx from "classix";
import { FaCheckSquare, FaBug, FaBookmark } from "react-icons/fa";
import { IssueTypeId } from "@domain/issue-type";

export const IssueTypeIcon = ({ type, size = 18 }: IssueTypeIconProps): JSX.Element => {
  const iconClass = cx(
    "flex",
    type === "task" && "text-icon-accent-blue",
    type === "bug" && "text-icon-accent-red",
    type === "story" && "text-icon-accent-green"
  );

  const Icon = type === "bug" ? FaBug : type === "story" ? FaBookmark : FaCheckSquare;

  return (
    <span className={iconClass}>
      <Icon size={size} />
    </span>
  );
};

interface IssueTypeIconProps {
  type: IssueTypeId;
  size?: number;
}
