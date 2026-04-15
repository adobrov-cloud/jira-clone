export const formatIssueKey = (num: number): string => {
  return `PROJ-${String(num).padStart(4, "0")}`;
};
