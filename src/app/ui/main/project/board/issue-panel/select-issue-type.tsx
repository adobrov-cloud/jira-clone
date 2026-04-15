import { useState } from "react";
import { IssueTypeId, issueTypesMock } from "@domain/issue-type";
import { IssueTypeIcon } from "@app/components/issue-type-icon";
import * as Select from "@app/components/select";

export const SelectIssueType = ({ initType }: Props): JSX.Element => {
  const [selectValue, setSelectValue] = useState<IssueTypeId>(initType);

  const onValueChange = (value: string) => {
    const type = value as IssueTypeId;
    setSelectValue(type);
  };

  return (
    <Select.Root name="type" defaultValue={initType} onValueChange={onValueChange}>
      <Select.Trigger aria-label="Open issue type select" className="text-xs uppercase">
        <div className="mr-2">
          <IssueTypeIcon type={selectValue} />
        </div>
        <Select.Value />
        <Select.TriggerIcon />
      </Select.Trigger>
      <Select.Content>
        <Select.ScrollUpButton />
        <Select.Viewport>
          {issueTypesMock.map((issueType, index) => (
            <Select.Item key={index} value={issueType.id} className="text-xs uppercase">
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
