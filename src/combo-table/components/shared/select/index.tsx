import React from "react";
import { DropDownContext } from "../../../index";
import { utils } from "../../../utils";
import "../../../styles/select.css";

type Props = {
  options: Array<{ label: string; value: string | number; id?: number | string; color?: string }>;
  value: string | number | any[] | undefined;
  title: string;
  onChange: (value: string | number | any[], option: any, e: React.MouseEvent, multiple?: boolean | undefined) => void;
  multiple: boolean;
  columnKey: string;
};

function Select({ options, value, title, onChange, multiple, columnKey }: Props) {
  const { setDropdownData, optionsMap } = React.useContext(DropDownContext);

  const currentValue = utils.isArray(value) ? value : [value];

  const onShowDropDown = (event: React.MouseEvent) => {
    event.stopPropagation();
    setDropdownData({ dropDownPosition: { x: event.clientX, y: event.clientY }, columnKey, options, value: currentValue, title, onChange, multiple });
  };

  return (
    <>
      <div onClick={(e) => onShowDropDown(e)} className="combo-table-select-label-wrapper">
        {currentValue ? (
          //@ts-ignore
          currentValue.map((val: any, index: number) => (
            <div
              style={{ color: optionsMap[columnKey][val]?.color || "grey", borderColor: optionsMap[columnKey][val]?.color || "grey" }}
              className="combo-table-select-label"
              key={val?.id || index}
            >
              {optionsMap[columnKey][val]?.label}
            </div>
          ))
        ) : (
          <span>Add {title}</span>
        )}
      </div>
    </>
  );
}

export default Select;