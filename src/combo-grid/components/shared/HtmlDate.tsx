import React, { ReactNode } from "react";
import { CellChangeEvent, Column } from "../..";

type Props = {
  column: Column;
  row: any;
  rowIndex: number;
  cellIndex: number;
  ref: React.RefObject<any>;
  tableKey: string | number;
  onCellChange: (cell: CellChangeEvent) => void;
  errors: { maxLength?: boolean; minLength?: boolean; required?: boolean };
  onBlur: (event: React.FocusEvent) => void;
};

function HtmlDate({ column, row, rowIndex, cellIndex, tableKey, onCellChange, ref, errors, onBlur }: Props) {
  return (
    <>
      <input
        onChange={(e) =>
          onCellChange({
            value: e.target.value,
            event: e,
            prevValue: row[column.key],
            row,
            rowIndex,
            cellIndex,
            cellKey: column.key,
            text: true,
            tableKey,
            column,
            rollback: () => {},
          })
        }
        className="combo-grid-input"
        style={errors.maxLength || errors.minLength || errors.required ? { borderBottom: "2px solid red", color: "red" } : { minWidth: "100% !important" }}
        type={column.dateType || "date"}
        defaultValue={row[column.key]}
        ref={ref}
        onBlur={onBlur}
      />
    </>
  );
}

export default HtmlDate;
