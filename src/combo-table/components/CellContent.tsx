import React from "react";
import ValidationBox from "./ValidationBox";
import { Column, CellChangeEvent } from "../index";
import "../styles/cell.css";

type Props = {
  row: any;
  column: Column;
  rowIndex: number;
  cellIndex: number;
  currentRows: any[];
  cellChangeEvent: (data: CellChangeEvent) => void;
  setCurrentRows: (data: any[]) => void;
};

const CellContent = ({ row, column, rowIndex, cellIndex, currentRows, cellChangeEvent }: Props) => {
  const [minLengthErrors, setMinLengthErrors] = React.useState<any>({});
  const [maxLengthErrors, setMaxLengthErrors] = React.useState<any>({});

  const checkIfNumForLength = (value: any) => {
    if (column?.subType === "number") {
      return parseInt(value);
    } else {
      return value.length;
    }
  };

  const minLengthError = column.minLength && checkIfNumForLength(row[column.key]) < column.minLength;
  const maxLengthError = column.maxLength && checkIfNumForLength(row[column.key]) > column.maxLength;

  const onCellChange = (val: CellChangeEvent) => {
    currentRows[rowIndex][column.key] = val.event.target.value;
    // setCurrentRows(newRows);
    if (column.maxLength && checkIfNumForLength(val.cell) > column.maxLength) {
      val.minLengthError = `${column.label} must be below ${column.maxLength} characters`;
      setMinLengthErrors({ ...minLengthErrors, ...{ [rowIndex + "_" + column.key]: true } });
    } else {
      setMinLengthErrors({ ...minLengthErrors, ...{ [rowIndex + "_" + column.key]: false } });
    }
    if (column.minLength && checkIfNumForLength(val.cell) < column.minLength) {
      val.maxLengthError = `${column.label} must be above ${column.minLength} characters`;
      setMaxLengthErrors({ ...maxLengthErrors, ...{ [rowIndex + "_" + column.key]: true } });
    } else {
      setMaxLengthErrors({ ...maxLengthErrors, ...{ [rowIndex + "_" + column.key]: false } });
    }

    cellChangeEvent(val);
  };

  return (
    <form>
      {!column.type && (
        <div
          style={
            column.styleTransformer
              ? column.styleTransformer({ cell: row[column.key], row, rowIndex, cellIndex, cellKey: column.key })
              : column.cellStyle || {}
          }
          className={
            column.classTransformer
              ? column.classTransformer({ cell: row[column.key], row, rowIndex, cellIndex, cellKey: column.key })
              : column.cellClass || ""
          }
        >
          {column.cellTransformer
            ? column.cellTransformer({ cell: row[column.key], row, rowIndex, cellIndex, cellKey: column.key })
            : row[column.key]}
        </div>
      )}
      {column.type === "input" && (
        <>
          <input
            onChange={(e) => onCellChange({ event: e, cell: row[column.key], row, rowIndex, cellIndex, cellKey: column.key })}
            className={"combo-table-input"}
            style={maxLengthError || minLengthError ? { borderBottom: "2px dotted red" } : {}}
            type={column.subType || "text"}
            defaultValue={row[column.key]}
          />
          {minLengthError && <ValidationBox error={`${column.label} must be at least ${column.minLength} characters`} />}
          {maxLengthError && <ValidationBox error={`${column.label} must be at most ${column.maxLength} characters`} />}
        </>
      )}
      {column.type === "textarea" && (
        <>
          <textarea
            onChange={(e) => onCellChange({ event: e, cell: row[column.key], row, rowIndex, cellIndex, cellKey: column.key })}
            className="combo-table-textarea hide-scroll"
            defaultValue={row[column.key]}
          />
          {minLengthErrors[rowIndex + "_" + column.key] && (
            <ValidationBox error={`${column.label} must be at least ${column.minLength} characters`} />
          )}
          {maxLengthErrors[rowIndex + "_" + column.key] && <ValidationBox error={`${column.label} must be at most ${column.maxLength} characters`} />}
        </>
      )}
      {column.type === "select" && column.options && (
        <>
          <select
            onChange={(e) => onCellChange({ event: e, cell: row[column.key], row, rowIndex, cellIndex, cellKey: column.key })}
            className="combo-table-select"
            defaultValue={row[column.key]}
          >
            {column.options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </>
      )}
      {column.type === "html" && <div dangerouslySetInnerHTML={row.column.key} />}
    </form>
  );
};

export default CellContent;
