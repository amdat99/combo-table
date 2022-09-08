import React from "react";
import "../../../styles/select.css";

type Options = Array<{ label: string; value: string | number; id?: number | string; color?: string }>;
type Props = {
  dropdownData: {
    options: Options;
    title: string;
    dropDownPosition: { x: number; y: number; width: number };
    onChange: (value: any, option: any, e: React.MouseEvent, multiple: boolean) => void;
    multiple: boolean;
    value: any;
    columnKey: string;
  };
  selectRef: React.RefObject<HTMLDivElement>;
  optionsMap: any;
};

function Dropdown({ dropdownData, selectRef, optionsMap }: Props) {
  const { options, title, dropDownPosition, multiple, value, columnKey } = dropdownData;
  const [currentValue, setCurrentValue] = React.useState(value);

  const onPushValueChange = (value: string | number) => {
    if (!multiple) {
      setCurrentValue([value]);
    } else if (!currentValue.includes(value)) {
      setCurrentValue([...currentValue, value]);
    }
  };

  return (
    <div
      className="combo-table-dropdown"
      ref={selectRef}
      style={{
        top: dropDownPosition?.y - 20 + "px",
        left: dropDownPosition?.x + "px",
        position: "fixed",
        width: dropDownPosition?.width + "px",
      }}
    >
      <div className="combo-table-select-label-wrapper">
        {currentValue &&
          currentValue.map((val: any, index: number) => (
            <div
              style={{
                background: optionsMap[columnKey][val]?.color || "grey",
                borderColor: optionsMap[columnKey][val]?.color || "grey",
                display: val ? "initial" : "none",
              }}
              className="combo-table-select-label"
              key={val?.id || index}
            >
              {optionsMap[columnKey][val]?.label}
            </div>
          ))}
      </div>
      <hr />
      {options.map((option, index) => (
        <div
          className="combo-table-options"
          key={option.id || index}
          onClick={(e) => {
            dropdownData.onChange(option.value, option, e, multiple);
            onPushValueChange(option.value);
          }}
        >
          <div style={{ background: option.color || "grey", border: `1px solid ${option.color}` || "grey" }} className="combo-table-select-label">
            {option.label}
          </div>
        </div>
      ))}
    </div>
  );
}

export default Dropdown;
