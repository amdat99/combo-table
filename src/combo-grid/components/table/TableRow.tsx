import React from "react";
import CellContent from "./CellContent";
import { CellChangeEvent, Column, ColumnChangeEvent, FormOptions, RowReorderEvent } from "../../index";
import MenuDropdown from "../shared/menuDropdown/MenuDropdown";

type Props = {
  rowIndex: number;
  onSelectRows: (row: any, rowIndex: number, checkbox?: boolean, virtual?: boolean) => void;
  rowAction: (row: any) => void;
  selectedRows: any[];
  selectedCells: any[];
  row: any;
  selectedRowIds: any[];
  selectedCellRowIds: string | number[];
  columns: Column[];
  cellAction: (cell: any) => void;
  onSelectCells: (cell: any, cellIndex: number, row: any) => void;
  currentRows: any[];
  cellChangeEvent: (cell: CellChangeEvent) => void;
  columnChangeEvent: (column: ColumnChangeEvent) => void;
  rowReorderEvent: (data: RowReorderEvent) => void;
  setCurrentRows: (currentRows: any[]) => void;
  setCurrentColumns: (columns: any[]) => void;
  draggingIndex: number;
  setDraggingIndex: React.Dispatch<React.SetStateAction<number>>;
  virtualiseRows: (rowIndex: number) => void;
  handleShowForm: (row: any, index: number) => void;
  setEditorRef?: (ref: React.RefObject<any>) => void;
  tableDetails: {
    key: string | number;
    title?: string;
    startingType?: string;
    paginationOptions?: any;
    virtualScroll?: boolean;
    formOptions?: FormOptions;
  };
};
const TableRow = ({
  rowIndex,
  onSelectRows,
  rowAction,
  selectedRows,
  selectedCells,
  row,
  selectedRowIds,
  selectedCellRowIds,
  columns,
  cellAction,
  onSelectCells,
  currentRows,
  cellChangeEvent,
  setCurrentRows,
  tableDetails,
  columnChangeEvent,
  setCurrentColumns,
  rowReorderEvent,
  setDraggingIndex,
  draggingIndex,
  handleShowForm,
}: Props) => {
  const rowSelected = selectedRowIds.includes(row?.id);
  const [menuTarget, setMenuTarget] = React.useState<any>(null);
  const [cancelDrag, setCancelDrag] = React.useState<boolean>(false);
  const [renderInputs, setRenderInputs] = React.useState<string | React.MouseEvent>("");

  const lastDraggableIndex = React.useRef<any>(null);

  const onSetColumns = (data: any[], index: number) => {
    const newColumns = [...columns];
    newColumns[index].options = data;
    setCurrentColumns(newColumns);
  };

  const moveRows = (e: any) => {
    if (cancelDrag) {
      setCancelDrag(false);
      return;
    }

    const index = parseInt(e.target.id);
    if (columns[draggingIndex]?.noReorderable) return;
    else if (draggingIndex === index || isNaN(draggingIndex)) return;

    const target = currentRows[index];
    const targetRow = currentRows[draggingIndex];
    currentRows.splice(index, 1);
    currentRows.splice(draggingIndex, 0, target);
    // setCurrentRows(newRows);
    rowReorderEvent({ index, row: target, targetIndex: draggingIndex, targetRow, event: e, tableKey: tableDetails.key, newRows: currentRows });
    setDraggingIndex(-1);
  };

  const checkInputTypes = (column: Column, e: React.MouseEvent) => {
    //If editable input , set the edit option for the cell and listen for cell reszises
    if (column.type === "readonly") return;
    setRenderInputs(column.type !== "combo-select" ? column.key : e);
  };

  return (
    <>
      {/* If virtualization is enabled render rows if rowIndex is between the virtualRange, otherwhise always render */}
      {row && (
        <tr
          onClick={(event: React.MouseEvent) => {
            onSelectRows(row, rowIndex);
            setTimeout(() => {
              rowAction({ row, event, selectedRows, selectedCells, rowIndex, tableKey: tableDetails.key });
            }, 0);
          }}
          //set ref if the row index is diviable by the visible rows
          // ref={viewCondition && tableDetails?.virtualScroll ? ref : null}
          onDragOver={(e) => {
            e.preventDefault();
            if (draggingIndex !== rowIndex) setDraggingIndex(rowIndex);
          }}
          key={rowIndex}
          style={{ background: rowSelected || (draggingIndex === rowIndex && draggingIndex !== -1) ? "var( --combo-grid-background-hover)" : "transparent" }}
          className={"combo-grid-row"}
          id={`${rowIndex.toString()}`}
          draggable
          aria-label={rowIndex.toString()}
          onDragEnd={(e) => {
            moveRows(e);
            setDraggingIndex(-1);
          }}
          onDragStart={(e: React.DragEvent) => {
            setDraggingIndex(rowIndex);
            //@ts-ignore
            if (e.target?.id) lastDraggableIndex.current = e.target.id;
          }}
        >
          {columns.map((column: Column, cellIndex: number) => {
            //If type is checkbox, render checkbox

            if (column.type === "checkbox-select") {
              return (
                <td key={column.id || cellIndex}>
                  <input
                    className=""
                    type="checkbox"
                    checked={rowSelected}
                    onClick={(event: React.MouseEvent) => {
                      event.stopPropagation();
                    }}
                    onChange={(e) => {
                      e.stopPropagation();
                      onSelectRows(row, rowIndex, true, true);
                    }}
                  />
                </td>
              );
            } else {
              return (
                <td
                  className="combo-grid-cell"
                  id={column.key + "_" + cellIndex}
                  key={column.id || cellIndex}
                  aria-label={rowIndex.toString()}
                  onContextMenu={(e) => {
                    if (!column.ctxMenuOptions) return;
                    e.preventDefault();
                    console.log(e.pageX, e.pageY);
                    setMenuTarget(e);
                  }}
                  onClick={(event: React.MouseEvent) => {
                    checkInputTypes(column, event);
                    onSelectCells(row[column.key], cellIndex, row);
                    setTimeout(() => {
                      cellAction({
                        cell: row[column.key],
                        row,
                        rowIndex,
                        cellIndex,
                        selectedRows,
                        selectedCells,
                        event,
                        cellKey: column.key,
                        tableKey: tableDetails.key,
                        column,
                      });
                    }, 0);
                  }}
                >
                  <CellContent
                    row={row}
                    column={column}
                    rowIndex={rowIndex}
                    cellIndex={cellIndex}
                    setCurrentRows={setCurrentRows}
                    onSetColumns={onSetColumns}
                    currentRows={currentRows}
                    cellChangeEvent={cellChangeEvent}
                    columnChangeEvent={columnChangeEvent}
                    handleShowForm={handleShowForm}
                    tableKey={tableDetails.key}
                    formOptions={tableDetails.formOptions}
                    columns={columns}
                    renderInputs={renderInputs}
                    setRenderInputs={setRenderInputs}
                  />
                </td>
              );
            }
          })}
          <td style={{ width: "100vw", overflow: "hidden" }} className="combo-grid-cell"></td>
        </tr>
      )}

      <MenuDropdown
        setTarget={setMenuTarget}
        open={menuTarget !== null}
        topOffset={-50}
        rightOffset={120}
        target={menuTarget}
        onCloseAction={() => setMenuTarget(null)}
      >
        <span></span>
      </MenuDropdown>
    </>
  );
};

export default TableRow;
