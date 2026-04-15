import { useState } from "react";
import cx from "classix";
import { CategoryId, CategoryType } from "@domain/category";
import { useProjectStore } from "@app/ui/main/project";
import * as Select from "@app/components/select";

/**
 * Returns the list of categories available for status transitions.
 * Enforces workflow rule: PLANNED issues can only transition to TODO,
 * preventing them from skipping stages in the workflow.
 */
const getAvailableCategories = (
  allCategories: Array<{ type: CategoryType; id: CategoryId; name: string }>,
  initStatus: CategoryType
) => {
  if (initStatus === "PLANNED") {
    return allCategories.filter(
      (cat) => cat.type === "PLANNED" || cat.type === "TODO"
    );
  }
  return allCategories;
};

const getTriggerClassName = (status: CategoryType): string => {
  const statusStyles: Record<CategoryType, string> = {
    PLANNED:
      "hover:bg-background-accent-teal-bolder-hovered !bg-background-accent-teal-bolder",
    TODO: "hover:bg-background-accent-grey-bolder-hovered !bg-background-accent-grey-bolder",
    IN_PROGRESS:
      "hover:bg-background-accent-blue-bolder-hovered !bg-background-accent-blue-bolder",
    DONE: "hover:bg-background-accent-green-bolder-hovered !bg-background-accent-green-bolder",
  };
  return statusStyles[status];
};

const getItemClassName = (categoryType: CategoryType): string => {
  const categoryStyles: Record<CategoryType, string> = {
    PLANNED: "bg-background-accent-teal-subtler text-font-accent-teal",
    TODO: "bg-background-accent-grey-subtler text-font-accent-grey",
    IN_PROGRESS: "bg-background-accent-blue-subtler text-font-accent-blue",
    DONE: "bg-background-accent-green-subtler text-font-accent-green",
  };
  return categoryStyles[categoryType];
};

export const SelectStatus = ({ initStatus }: Props): JSX.Element => {
  const projectStore = useProjectStore();
  const allCategories = projectStore.project.categories;
  const categories = getAvailableCategories(allCategories, initStatus);
  const initCategory = categories.find(
    (category) => category.type === initStatus
  );

  if (!initCategory) {
    throw new Error("No default category found");
  }

  const defaultValue = initCategory.id;
  const [selectedValue, setSelectedValue] = useState<CategoryId>(defaultValue);
  const selectedStatus = categories.find(
    (category) => category.id === selectedValue
  )?.type as CategoryType;

  const onValueChange = (value: CategoryId): void => {
    setSelectedValue(value);
  };

  return (
    <Select.Root
      name="status"
      defaultValue={defaultValue}
      onValueChange={onValueChange}
    >
      <Select.Trigger
        aria-label="Open status select"
        className={cx(
          "!text-font-inverse hover:!opacity-80",
          getTriggerClassName(selectedStatus)
        )}
      >
        <Select.Value className="pt-1" />
        <Select.TriggerIcon />
      </Select.Trigger>
      <Select.Content>
        <Select.ScrollUpButton />
        <Select.Viewport>
          {categories.map((category) => (
            <Select.Item key={category.id} value={category.id}>
              <Select.ItemIndicator />
              <span
                className={cx(
                  "flex w-fit items-center gap-2 rounded px-1 py-0.5 text-2xs uppercase",
                  getItemClassName(category.type)
                )}
              >
                <Select.ItemText>{category.name}</Select.ItemText>
              </span>
            </Select.Item>
          ))}
          <Select.Separator />
        </Select.Viewport>
        <Select.ScrollDownButton />
      </Select.Content>
    </Select.Root>
  );
};

interface Props {
  initStatus: CategoryType;
}
