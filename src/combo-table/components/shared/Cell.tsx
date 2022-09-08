import React from "react";
import { Column } from "../..";
import { textValidators } from "../../validators";
import ValidationBox from "../table/ValidationBox";

type Props = {
  row: any;
  column: Column;
  rowIndex: number;
  cellIndex: number;
  prevSizes?: { height: number; width: number };
  onClick: (event: React.MouseEvent) => void;
  ref?: React.RefObject<HTMLDivElement>;
  patternError?: boolean | 0 | undefined;
  minLengthError?: boolean | 0 | undefined;
  maxLengthError?: boolean | 0 | undefined;
};

function Cell({ onClick, ref, column, row, prevSizes, rowIndex, cellIndex, patternError, minLengthError, maxLengthError }: Props) {
  return (
    <>
      <div
        onClick={onClick}
        ref={ref}
        style={
          column.styleTransformer
            ? column.styleTransformer({ cell: row[column.key], row, rowIndex, cellIndex, cellKey: column.key })
            : column.cellStyle || { height: prevSizes?.height || "fit-content", width: prevSizes?.width || "fit-content" }
        }
        className={
          column.classTransformer
            ? column.classTransformer({ cell: row[column.key], row, rowIndex, cellIndex, cellKey: column.key })
            : column.cellClass || "combo-table-input"
        }
      >
        {column.cellTransformer
          ? column.cellTransformer({ cell: row[column.key], row, rowIndex, cellIndex, cellKey: column.key })
          : row[column.key] || <span style={{ opacity: 0.5 }}>Enter {column.label}</span>}
      </div>
      {patternError && column.subType && <ValidationBox error={textValidators[column.subType]?.error} />}
      {minLengthError && <ValidationBox error={`${column.label} must be at least ${column.minLength} characters`} />}
      {maxLengthError && <ValidationBox error={`${column.label} must be at most ${column.maxLength} characters`} />}
    </>
  );
}

export default Cell;
