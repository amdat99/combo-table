import React from "react";
import { Column } from "../../index";

type Props = {
  columns: Column[];
  currentRows: any[];
  selectedRowLength: number;
};

function TableFooter({ columns, currentRows, selectedRowLength }: Props) {
  return (
    <tfoot className="combo-table-footer">
      <tr>
        <td colSpan={columns.length}>
          <div>
            <div className="combo-table-footer-left">
              <div className="combo-table-footer-left-content">
                <div className="combo-table-footer-left-content-item">
                  <span>
                    {selectedRowLength < 1 ? selectedRowLength : selectedRowLength} / {currentRows.length}
                  </span>
                  <span>{currentRows.length > 1 ? " selected rows " : " selected row "}</span>
                </div>
                {/* <div className="combo-table-footer-left-content-item">
                          <span>{currentRows.length > 0 ? "1" : "0"}</span>
                          <span>{currentRows.length > 0 ? "to" : ""}</span>
                          <span>{currentRows.length > 0 ? "10" : ""}</span>
                        </div> */}
              </div>
            </div>
          </div>
        </td>
      </tr>
    </tfoot>
  );
}

export default TableFooter;
