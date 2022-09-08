import React from "react";
import { useInView } from "react-intersection-observer";
import CellContent from "./CellContent";
import { Column, FormOptions, VirtualizationOptions } from "../../index";

type Props = {
  rowIndex: number;
  virtualRange: { lower: number; upper: number; currentId: number | string };
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
  cellChangeEvent: (cell: any) => void;
  setCurrentRows: (currentRows: any[]) => void;
  setVirtualRange: React.Dispatch<
    React.SetStateAction<{
      lower: number;
      upper: number;
      currentId: number;
    }>
  >;
  virtualizationOptions: VirtualizationOptions;
  formOptions: FormOptions;
  setShowForm: React.Dispatch<React.SetStateAction<boolean>>;
};
const TableRow = ({
  rowIndex,
  virtualRange,
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
  setVirtualRange,
  virtualizationOptions,
  formOptions,
  setShowForm,
}: Props) => {
  //Hook to check if element is currently visible in the viewport
  const { ref, inView } = useInView();
  const { renderedRows } = virtualizationOptions;

  let shouldRender = virtualizationOptions.enable ? rowIndex >= virtualRange.lower && rowIndex <= virtualRange.upper : true;
  const extraRange = Math.floor(renderedRows / 3);
  const viewCondition = (rowIndex - extraRange) % renderedRows === 0 || (rowIndex + extraRange) % renderedRows === 0;
  const rowSelected = selectedRowIds.includes(row.id);
  console.log("rowSelected", rowSelected);
  const [prevSizes, setPrevSizes] = React.useState<any>({});

  React.useEffect(() => {
    //If last row of visible row in the virtual range, update virtual range
    if (inView) {
      console.log(rowIndex, virtualRange.upper);
      if (rowIndex + extraRange + 2 > virtualRange.upper) {
        setVirtualRange({ lower: rowIndex - extraRange, upper: rowIndex + (renderedRows + extraRange), currentId: row.id });
        console.log("Updating virtual range", virtualRange);
      } else if (rowIndex - extraRange - 2 < virtualRange.lower) {
        setVirtualRange({
          lower: rowIndex - (renderedRows + extraRange),
          upper: rowIndex + extraRange,
          currentId: row.id,
        });
        console.log("Updating virtual range lower", virtualRange);
      }
    }
  }, [inView]);

  return (
    <>
      {/* If virtualization is enabled render rows if rowIndex is between the virtualRange, otherwhise always render */}
      {shouldRender ? (
        <tr
          onClick={(event: React.MouseEvent) => {
            onSelectRows(row, rowIndex);
            setTimeout(() => {
              rowAction({ row, event, selectedRows, selectedCells, rowIndex });
            }, 0);
          }}
          //set ref if the row index is diviable by the visible rows
          ref={viewCondition && virtualizationOptions.enable ? ref : null}
          key={rowIndex}
          style={{ background: rowSelected ? "#f5f5f5   " : "transparent" }}
          className={"combo-table-row"}
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
                  className="combo-table-cell"
                  id={column.key + "_" + cellIndex}
                  style={{
                    height: prevSizes[column.key + "_" + cellIndex]?.height || "",
                    width: prevSizes[column.key + "_" + cellIndex]?.width || "",
                  }}
                  key={column.id || cellIndex}
                  onClick={(event: React.MouseEvent) => {
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
                    currentRows={currentRows}
                    cellChangeEvent={cellChangeEvent}
                    prevSizes={prevSizes}
                    setPrevSizes={setPrevSizes}
                    formOptions={formOptions}
                    setShowForm={setShowForm}
                  />
                </td>
              );
            }
          })}
        </tr>
      ) : (
        <tr ref={viewCondition && virtualizationOptions.enable ? ref : null} style={{ width: "100%", minHeight: "50px" }}>
          <td style={{ opacity: 0 }}>test</td>
        </tr>
      )}
    </>
  );
};

export default TableRow;
