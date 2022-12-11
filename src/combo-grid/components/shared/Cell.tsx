import React from "react";
import { Column } from "../..";

type Props = {
  row: any;
  column: Column;
  rowIndex: number;
  cellIndex: number;
  onClick: (event: React.MouseEvent) => void;
  ref?: React.RefObject<HTMLDivElement>;
  visible: boolean;
  inForm?: boolean;
};

function Cell({ onClick, column, row, rowIndex, cellIndex, visible, inForm }: Props) {
  const transformEvent = () => {
    return {
      cell: row[column.key],
      row,
      rowIndex,
      cellIndex,
      cellKey: column.key,
      column,
      inForm,
    };
  };

  if (!visible) return null;
  return (
    <div className={"combo-grid-cell-content"} style={{ width: inForm ? "100%" : column.ref?.current?.style.width }}>
      <div
        onClick={onClick}
        className={column.columnClass || ""}
        style={{
          ...(column.styleTransformer ? column.styleTransformer(transformEvent()) : column.cellStyle),
        }}
      >
        {column.cellTransformer ? (
          column.cellTransformer(transformEvent())
        ) : row[column.key] ? (
          column.textTransformer ? (
            column.textTransformer(transformEvent())
          ) : column?.type === "quill" ? (
            <span dangerouslySetInnerHTML={{ __html: row[column.key] }} />
          ) : (
            row[column.key]
          )
        ) : column.customAddCellComponent ? (
          column.customAddCellComponent(transformEvent())
        ) : (
          <span style={{ opacity: 0.5, fontSize: 11, cursor: "pointer" }}>Add {column.label}</span>
        )}
      </div>
    </div>
  );
}

export default Cell;
