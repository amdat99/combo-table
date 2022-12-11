import React from "react";
import { TableData } from "../../..";
import exportSvg from "../../../assets/export.svg";
import menuSvg from "../../../assets/menu.svg";

type Props = {
  tableKeys: any[];
  currentTableKey: string;
  tableData: TableData[];
  showNewTable: Function;
  setShowViewOptions: React.Dispatch<React.SetStateAction<boolean>>;
};

function Toolbar({ tableKeys, currentTableKey, tableData, showNewTable, setShowViewOptions }: Props) {
  return (
    <div className="combo-grid-toolbar">
      <div style={{ position: "relative", top: "4px" }}>
        {tableKeys.length > 0 &&
          tableKeys.map((key, i) => (
            <span
              key={key}
              onClick={() => {
                showNewTable({ key, i });
              }}
              style={{ fontWeight: currentTableKey === key ? "650" : "initial", color: currentTableKey === key ? " #60b1bc" : "initial" }}
              className="combo-grid-table-tab"
            >
              {key}
            </span>
          ))}
      </div>
      <div style={{ marginRight: "20px", position: "relative", bottom: "7px" }}>
        <input className="combo-grid-search-filter" type="search" placeholder={"Search " + currentTableKey + " ..."} />{" "}
        <img
          className="combo-grid-icon"
          title="options"
          width="20px"
          height="20px"
          onClick={() => setShowViewOptions((prev: boolean) => !prev)}
          src={menuSvg}
          alt="options"
        />
        <img className="combo-grid-icon" title="export" width="20px" height="20px" src={exportSvg} alt="export" />
      </div>
    </div>
  );
}

export default Toolbar;
