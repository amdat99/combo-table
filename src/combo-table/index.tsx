import React from "react";
import { useInView } from "react-intersection-observer";

import CellContent from "./components/CellContent";
import "./styles/table.css";

export type Column = {
  id?: string;
  key: string;
  label: string;
  type?: string;
  subType?: string;
  options?: { value: any; label: string }[];
  columnClass?: string;
  headerClass?: string;
  columnStyle?: React.CSSProperties;
  cellStyle?: React.CSSProperties;
  styleTransformer?: (value: Transformer) => React.CSSProperties;
  cellClass?: string;
  classTransformer?: (value: Transformer) => string;
  cellTransformer?: (value: Transformer) => any;
  minLength?: number;
  maxLength?: number;
};

export type RowAction = {
  row: any;
  rowIndex: number;
  selectedRows: any[];
  selectedCells: any[];
  event: React.MouseEvent;
};

export type CellAction = {
  cell: any;
  row: any;
  cellKey: string;
  cellIndex: number;
  rowIndex: number;
  selectedRows: any[];
  selectedCells: any[];
  event: React.MouseEvent;
};

export type Transformer = {
  cell: any;
  row: any;
  cellKey: string;
  cellIndex: number;
  rowIndex: number;
};

export type CellChangeEvent = {
  event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement | HTMLSelectElement>;
  cell: any;
  row: any;
  cellKey: string;
  cellIndex: number;
  rowIndex: number;
  minLengthError?: string;
  maxLengthError?: string;
  patternError?: string;
};

type Props = {
  columns: Column[];
  rows: any[];
  type?: "table" | "board" | "list" | "card";
  loading?: boolean;
  maxHeight?: string;
  maxWidth?: string;
  setType?: (type: string) => void;
  rowAction?: (rowData: RowAction) => void;
  cellAction?: (cellData: CellAction) => void;
  cellChangeEvent?: (data: CellChangeEvent) => void;
  noDataComponent?: React.ReactNode;
  customLoaderComponent?: React.ReactNode;
  visibleRows?: number;
  virtualization?: boolean;
};

const ComboTable = ({
  columns = [],
  rows = [],
  rowAction = () => {},
  cellAction = () => {},
  loading = false,
  customLoaderComponent = null,
  noDataComponent = null,
  type = "table",
  maxHeight = "",
  maxWidth = "",
  cellChangeEvent = () => {},
  visibleRows = 60,
  virtualization = false,
}: Props) => {
  const [currentRows, setCurrentRows] = React.useState<any>([]);
  const [currentType, setCurrentType] = React.useState(type);
  const [selectedRows, setSelectedRows] = React.useState<any>([]);
  const [selectedCells, setSelectedCells] = React.useState<any>([]);
  const [selectedCellIndexes, setSelectedCellIndexes] = React.useState<any>([]);
  const [selectedRowIndexes, setSelectedRowIndexes] = React.useState<any>([]);
  const [virtualRange, setVirtualRange] = React.useState({ lower: 0, upper: visibleRows * 2, currentId: 0 });

  React.useEffect(() => {
    OnSetCurrentRows();
  }, [rows]); // eslint-disable-line react-hooks/exhaustive-deps

  const OnSetCurrentRows = React.useCallback(() => {
    setCurrentRows([...rows]);
    console.log("OnSetCurrentRows", currentRows);
  }, [rows]);

  React.useEffect(() => {
    if (currentType !== type) {
      setCurrentType(type);
    }
  }, [type]);

  const onSelectRows = (row: any, rowIndex: number, bulk = false) => {
    if (!bulk) {
      setSelectedRows([]);
      setSelectedRowIndexes([]);
    }
    selectedRows.push(row);
    setSelectedRowIndexes([...selectedRowIndexes, rowIndex]);
    console.log("selectedRowsu", selectedRowIndexes);
  };

  const onSelectCells = (cell: any, cellIndex: number, bulk = false) => {
    if (!bulk) {
      setSelectedCells([]);
      setSelectedCellIndexes([]);
    }
    selectedCells.push(cell);
    setSelectedCellIndexes([...selectedCellIndexes, cellIndex]);
  };

  return (
    <div className="combo-table-table-wrapper hide-scroll " style={{ maxHeight: maxHeight || "100%", maxWidth: maxWidth || "100%" }}>
      <table className="combo-table-table ">
        {columns.length > 0 && (
          <thead className="combo-table-header" style={{ maxWidth: maxWidth || "100%" }}>
            <tr>
              {columns.map((column, i) => (
                <th className={"combo-table-header-content " + column.columnClass} style={column.columnStyle} key={column.id || i}>
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
        )}
        {loading && <div>{customLoaderComponent || "Loading..."}</div>}
        <tbody>
          {currentRows && currentRows.length > 0
            ? currentRows.map((row: { [x: string]: any }, rowIndex: number) => {
                return (
                  //@ts-ignore
                  <TableRow
                    row={row}
                    rowIndex={rowIndex}
                    virtualRange={virtualRange}
                    onSelectRows={onSelectRows}
                    rowAction={rowAction}
                    cellAction={cellAction}
                    cellChangeEvent={cellChangeEvent}
                    selectedRows={selectedRows}
                    selectedCells={selectedCells}
                    selectedCellIndexes={selectedCellIndexes}
                    selectedRowIndexes={selectedRowIndexes}
                    key={rowIndex}
                    columns={columns}
                    currentRows={currentRows}
                    visibleRows={visibleRows}
                    onSelectCells={onSelectCells}
                    setVirtualRange={setVirtualRange}
                    setCurrentRows={setCurrentRows}
                    virtualization={virtualization}
                  />
                );
              })
            : noDataComponent && !loading
            ? noDataComponent
            : !loading && (
                <tr>
                  <td>No data</td>
                </tr>
              )}
        </tbody>
      </table>
    </div>
  );
};

const TableRow = ({
  rowIndex,
  virtualRange,
  onSelectRows,
  rowAction,
  visibleRows,
  selectedRows,
  selectedCells,
  row,
  selectedRowIndexes,
  columns,
  cellAction,
  onSelectCells,
  currentRows,
  cellChangeEvent,
  setCurrentRows,
  setVirtualRange,
  virtualization,
}: any) => {
  const { ref, inView } = useInView();
  let shouldRender = virtualization ? rowIndex >= virtualRange.lower && rowIndex < virtualRange.upper : true;
  const viewCondition = (rowIndex + 2) % visibleRows === 0;
  React.useEffect(() => {
    if (inView) {
      if (rowIndex + visibleRows + 2 !== virtualRange.upper) {
        setVirtualRange({ lower: rowIndex - visibleRows, upper: rowIndex + visibleRows + 2, currentId: row.id });
        console.log("setVirtualRange", rowIndex, virtualRange);
      }
    }
  }, [inView]);

  return (
    <>
      {shouldRender ? (
        <tr
          onClick={(event: React.MouseEvent) => {
            onSelectRows(row, rowIndex);
            setTimeout(() => {
              rowAction({ row, event, selectedRows, selectedCells, rowIndex });
            }, 0);
          }}
          //@ts-ignore
          ref={viewCondition && virtualization ? ref : null}
          key={rowIndex}
          style={{ backgroundColor: selectedRowIndexes.includes(rowIndex) ? "#f5f5f5;  " : "transparent" }}
          className={"combo-table-row"}
        >
          {columns.map((column: Column, cellIndex: number) => (
            <td
              className="combo-table-cell"
              key={column.id || cellIndex}
              onClick={(event: React.MouseEvent) => {
                onSelectCells(row[column.key], cellIndex);
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
              />
            </td>
          ))}
        </tr>
      ) : (
        <tr ref={viewCondition && virtualization ? ref : null} style={{ width: "100%", minHeight: "50px" }}>
          <td style={{ opacity: 0 }}>test</td>
        </tr>
      )}
    </>
  );
};
export default ComboTable;
