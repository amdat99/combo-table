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
  onBlur: (event: React.FocusEvent) => void;
};

function HtmlSelect({ column, row, rowIndex, cellIndex, tableKey, onCellChange, ref, onBlur }: Props) {
  return (
    <>
      <select
        onBlur={onBlur}
        ref={ref}
        onChange={(e) =>
          onCellChange({
            value: e.target.value,
            event: e,
            option: e.target.options[e.target.selectedIndex],
            prevValue: row[column.key],
            row,
            rowIndex,
            cellIndex,
            cellKey: column.key,
            tableKey,
            column,
            rollback: () => {},
          })
        }
      >
        {column.options &&
          column.options.map((o, i: number) => (
            <option
              key={i}
              value={o.value}
              onClick={() => (o.action ? o.action({ option: o, column, cell: row[column.key], row, rowIndex, cellIndex, cellKey: column.key }) : null)}
            >
              {o.label}
            </option>
          ))}
      </select>
    </>
  );
}

export default HtmlSelect;
