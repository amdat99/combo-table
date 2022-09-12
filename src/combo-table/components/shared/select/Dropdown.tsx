import React from "react";
import "../../../styles/select.css";
import MenuIcon from "../../../assets/menu.svg";
import MenuDropdown from "../menuDropdown/MenuDropdown";

type Options = Array<{ label: string; value: string | number; id?: number | string; color?: string }>;
type Props = {
  dropdownData: {
    options: Options;
    title: string;
    dropDownPosition: { x: number; y: number; width: number };
    onChange: (value: any, option: any, e: React.MouseEvent, multiple: boolean) => void;
    onColumnChange: (options: any[], prevOptions: any[], value: any, event: React.MouseEvent) => void;
    multiple: boolean;
    value: any;
    columnKey: string;
  };
  selectRef: React.RefObject<HTMLDivElement>;
  optionsMap: any;
  setOptionsMap: React.Dispatch<any>;
  setTempDisableDropdownClose: React.Dispatch<React.SetStateAction<boolean>>;
};

function Dropdown({ dropdownData, selectRef, optionsMap, setOptionsMap, setTempDisableDropdownClose }: Props) {
  const { options, title, dropDownPosition, multiple, value, columnKey } = dropdownData;
  const [currentValue, setCurrentValue] = React.useState<any>([]);
  const [searchValue, setSearchValue] = React.useState<string>("");
  const [currentOptions, setCurrentOptions] = React.useState<Options>(options);
  const [menuTarget, setMenuTarget] = React.useState<any>(null);

  React.useEffect(() => {
    setCurrentValue(value);
    setCurrentOptions(options);
  }, []);

  const onPushValueChange = (value: string | number, option: any, e: React.MouseEvent) => {
    if (!multiple) {
      setCurrentValue([value]);
    } else if (!currentValue.includes(value)) {
      currentValue.push(value);
      setCurrentValue([...currentValue]);
    }
    if (currentValue[0] === undefined) currentValue.shift();
    dropdownData.onChange(currentValue, option, e, multiple);
  };

  const removeValue = (val: string | number, option: any, e: React.MouseEvent) => {
    const filteredValues = currentValue.filter((v: number | string) => v !== val);
    setCurrentValue(filteredValues);
    dropdownData.onChange(filteredValues, option, e, multiple);
  };

  const addOption = (e: React.MouseEvent) => {
    const currentOptionsMap = { ...optionsMap };
    currentOptionsMap[columnKey][searchValue] = { label: searchValue, value: searchValue };
    currentOptions.push({ label: searchValue, value: searchValue });
    setCurrentOptions([...currentOptions]);
    dropdownData.onColumnChange(currentOptions, options, { label: searchValue, value: searchValue }, e);
    setOptionsMap(currentOptionsMap);
    setSearchValue("");
  };

  const filterOptions = () => {
    if (searchValue === "") return currentOptions;
    return currentOptions.filter((option) => option.label.toLowerCase().includes(searchValue.toLowerCase()));
  };

  return (
    <>
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
        <div className="combo-table-select-label-wrapper combo-table-border-bottom">
          <div style={{ display: "flex", flexDirection: "row" }}>
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
                  <span
                    onClick={(e) => removeValue(val, val, e)}
                    title="Remove field"
                    style={{ marginLeft: "3px", padding: "2px", cursor: "pointer" }}
                  >
                    x
                  </span>
                </div>
              ))}
            <input
              type="search"
              autoFocus
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Search or Create"
              style={{ width: "100%" }}
              className="combo-table-input"
            />
          </div>
        </div>
        {filterOptions().map((option, index) => (
          <div
            className="combo-table-options"
            key={option.id || index}
            onClick={(e) => {
              onPushValueChange(option.value, option, e);
            }}
          >
            <div style={{ background: option.color || "grey", border: `1px solid ${option.color}` || "grey" }} className="combo-table-select-label">
              {option.label}
            </div>
            <img
              width="16px"
              height="13px"
              alt="menu icon"
              src={MenuIcon}
              onClick={(e) => {
                e.stopPropagation();
                setMenuTarget(e);
                setTempDisableDropdownClose(true);
              }}
            />
          </div>
        ))}
        {searchValue && (
          <div className="combo-table-select-create-wrapper" onClick={(e) => addOption(e)}>
            Create{" "}
            <div style={{ background: "grey", border: `1px solid grey`, marginLeft: "4px" }} className="combo-table-select-label">
              {searchValue}
            </div>
          </div>
        )}
      </div>
      <MenuDropdown setTarget={setMenuTarget} open={menuTarget !== null} target={menuTarget} onCloseAction={() => setTempDisableDropdownClose(false)}>
        <span>test</span>
      </MenuDropdown>
    </>
  );
}

export default Dropdown;
