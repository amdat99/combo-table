import React from "react";
import exportSvg from "../../../assets/export.svg";

type Props = {
  tableKeys: any[];
  setCurrentTableKey: React.Dispatch<React.SetStateAction<string>>;
  currentTableKey: string;
};

function Toolbar({ tableKeys, setCurrentTableKey, currentTableKey }: Props) {
  return (
    <div className="combo-table-toolbar">
      <div style={{ marginLeft: "40px", position: "relative", top: "4px" }}>
        {tableKeys.length > 0 &&
          tableKeys.map((key) => (
            <span
              key={key}
              onClick={() => setCurrentTableKey(key)}
              style={{ fontWeight: currentTableKey === key ? "bold" : "initial" }}
              className="combo-table-table-tab"
            >
              {key}
            </span>
          ))}
      </div>
      <div style={{ marginRight: "20px", position: "relative", bottom: "7px" }}>
        <input type="search" placeholder="Search" />
        <img className="combo-table-icon" title="export" width="20px" height="20px" src={exportSvg} alt="search" />
      </div>
    </div>
  );
}

export default Toolbar;
