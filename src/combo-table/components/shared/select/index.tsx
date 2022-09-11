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
  cellIndex: number;
  onColumnChange: (options: any[], prevValue: any[], value: any, event: React.MouseEvent) => void;
};

function Select({ options, value, title, onChange, multiple, columnKey, cellIndex, onColumnChange }: Props) {
  const { setDropdownData, optionsMap } = React.useContext(DropDownContext);

  const currentValue = utils.isArray(value) ? value : [value];

  const onShowDropDown = (event: React.MouseEvent) => {
    const cell = document.getElementById(columnKey + "_" + cellIndex);
    //@ts-ignore
    const rect = cell.getBoundingClientRect();
    const width = rect.right - rect.left;

    event.stopPropagation();
    setDropdownData({
      dropDownPosition: { x: rect.left, y: event.clientY, width },
      columnKey,
      options,
      value: currentValue,
      title,
      onChange,
      onColumnChange,
      multiple,
    });
  };

  return (
    <>
      <div onClick={(e) => onShowDropDown(e)} className="combo-table-select-label-wrapper">
        {currentValue ? (
          //@ts-ignore
          currentValue.map((val: any, index: number) => (
            <div
              style={{ background: optionsMap[columnKey][val]?.color || "grey", borderColor: optionsMap[columnKey][val]?.color || "grey" }}
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
