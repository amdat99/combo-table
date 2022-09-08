import React from "react";
import { Column } from "../..";
import { textValidators } from "../../validators";
import ValidationBox from "../table/ValidationBox";
import "../../styles/cell.css";

type Props = {
  onChange: Function;
  row: any;
  column: Column;
  rowIndex: number;
  cellIndex: number;
  ref?: React.RefObject<HTMLTextAreaElement>;
  onBlur: (event: React.FocusEvent) => void;
  patternError?: boolean | 0 | undefined;
  minLengthError?: boolean | 0 | undefined;
  maxLengthError?: boolean | 0 | undefined;
};

function Textarea({ onChange, row, column, cellIndex, rowIndex, ref, onBlur, maxLengthError, minLengthError, patternError }: Props) {
  return (
    <>
      <textarea
        onChange={(e) =>
          onChange({
            value: e.target.value,
            event: e,
            prevValue: row[column.key],
            row,
            rowIndex,
            cellIndex,
            cellKey: column.key,
            text: true,
            textarea: true,
          })
        }
        className="combo-table-textarea hide-scroll"
        defaultValue={row[column.key]}
        style={maxLengthError || minLengthError || patternError ? { borderBottom: "2px solid red", color: "red" } : {}}
        onBlur={onBlur}
        ref={ref}
      />
      {/* //@ts-ignore */}
      {patternError && column.subType && <ValidationBox error={textValidators[column.subType]?.error} />}
      {minLengthError && <ValidationBox error={`${column.label} must be at least ${column.minLength} characters`} />}
      {maxLengthError && <ValidationBox error={`${column.label} must be at most ${column.maxLength} characters`} />}
    </>
  );
}

export default Textarea;
