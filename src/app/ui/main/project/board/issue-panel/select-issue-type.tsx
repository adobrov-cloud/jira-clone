import { useState } from "react";
import { IssueTypeId, issueTypesMock } from "@domain/issue-type";
import { IssueTypeIcon } from "@app/components/issue-type-icon";
import * as Select from "@app/components/select";

export const SelectIssueType = ({ initType }: Props): JSX.Element => {
  const [selectValue, setSelectValue] = useState<IssueTypeId>(initType);

  const handleValueChange = (value: string) => {
    setSelectValue(value as IssueTypeId);
  };

  return (
    <Select.Root
      name="type"
      defaultValue={initType}
      onValueChange={handleValueChange}
    >
      <Select.Trigger
        aria-label="Open issue type select"
        className="text-xs uppercase"
      >
        <IssueTypeIcon type={selectValue} />
        <Select.Value />
        <Select.TriggerIcon />
      </Select.Trigger>
      <Select.Content>
        <Select.ScrollUpButton />
        <Select.Viewport>
          {issueTypesMock.map((issueType) => (
            <Select.Item
              key={issueType.id}
              value={issueType.id}
              className="text-xs uppercase"
            >
              <Select.ItemIndicator />
              <IssueTypeIcon type={issueType.id} />
              <Select.ItemText>{issueType.name}</Select.ItemText>
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
  initType: IssueTypeId;
}
