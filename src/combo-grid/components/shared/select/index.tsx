import React from "react";
import { utils } from "../../../utils";
import "../../../styles/select.css";
import { DropDownContext } from "../../../Main";
import { Column } from "../../..";

type Props = {
  options: Array<{ label: string; value: string | number; id?: number | string; color?: string }>;
  value: string | number | any[] | undefined;
  onChange: (value: string | number | any[], option: any, e: React.MouseEvent, multiple?: boolean | undefined) => void;
  multiple?: boolean;
  column: Column;
  tableKey?: string | number;
  cellIndex?: number;
  onColumnChange?: (options: any[], prevValue: any[], value: any, event: React.MouseEvent) => void;
  inForm?: boolean;
  clickEvent?: React.MouseEvent | null | string;
  defaultSelect?: boolean;
};

function Select({ options, value, onChange, multiple, cellIndex, onColumnChange, inForm, column, tableKey, clickEvent, defaultSelect = false }: Props) {
  const { setDropdownData, optionsMap } = React.useContext(DropDownContext);

  const currentValue = utils.isArray(value) ? value : [value];

  const onShowDropDown = (event: React.MouseEvent) => {
    if (!defaultSelect && typeof value === "string") return;
    let width = 200;
    let rect = null;
    if (cellIndex) {
      const cell = document.getElementById(column.key + "_" + cellIndex);
      //@ts-ignore
      rect = cell.getBoundingClientRect();

      width = rect.right - rect.left;
    }

    event.stopPropagation();
    setDropdownData({
      dropDownPosition: { x: inForm ? event?.clientX : rect?.left || event?.clientX, y: event?.clientY, width },
      columnKey: column.key,
      options,
      value: currentValue,
      title: column.label,
      onChange,
      onColumnChange,
      multiple,
    });
  };

  React.useEffect(() => {
    if (clickEvent && typeof clickEvent !== "string") {
      // @ts-ignore
      onShowDropDown(clickEvent);
    }
  }, [clickEvent]);

  return (
    <>
      <div onClick={(e) => (!clickEvent ? onShowDropDown(e) : null)} className="combo-grid-select-label-wrapper" style={{ minWidth: column?.width || "120px" }}>
        {/* @ts-ignore */}
        {!defaultSelect && currentValue !== undefined && currentValue.length > 0
          ? //@ts-ignore
            currentValue.map(
              (val: any, index: number) =>
                optionsMap[tableKey + column.key][val] && (
                  <div
                    style={{
                      background: optionsMap[tableKey + column.key][val]?.color || "var(--combo-grid-primary)",
                      borderColor: optionsMap[tableKey + column.key][val]?.color || "var(--combo-grid-primary)",
                    }}
                    className="combo-grid-select-label"
                    key={val?.id || index}
                  >
                    {optionsMap[tableKey + column.key][val]?.label}
                  </div>
                )
            )
          : // <span>Add {column.label}</span>
            null}
        {defaultSelect && <span> {value}</span>}
      </div>
    </>
  );
}

export default Select;
