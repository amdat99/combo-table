import React from "react";
import { TableData } from "..";

type Props = {
  wrapperRef: React.RefObject<HTMLDivElement>;
  currentType: string;
  setTypeMap: React.Dispatch<React.SetStateAction<any>>;
  table: TableData;
};

function ViewOptions({ wrapperRef, table, setTypeMap, currentType }: Props) {
  return (
    <div
      style={{ minWidth: "25%", height: wrapperRef?.current?.offsetHeight ? wrapperRef.current.offsetHeight - 9 : "80%", top: wrapperRef?.current?.offsetTop }}
      className="combo-grid-form-wrapper-side"
    >
      <div className="combo-grid-form-wrapper-side-content" style={{ margin: "4%" }}>
        <h4>View options</h4>

        <div className="combo-grid-flex-row">
          <p>Layout</p>
          <select
            value={currentType}
            style={{ marginLeft: "10px" }}
            onChange={(e) =>
              setTypeMap((prev: any) => {
                return {
                  ...prev,
                  [table.key]: e.target.value,
                };
              })
            }
          >
            <option value="table">Table</option>
            <option value="board">Board</option>
            <option>Calender</option>
            <option>Gnatt</option>
            <option>Files</option>
          </select>
        </div>
      </div>
    </div>
  );
}

export default ViewOptions;
