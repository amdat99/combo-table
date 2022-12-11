import React, { useCallback, useEffect, useRef, useState } from "react";
import { Column, DefaultTableData, PaginationOptions, TableData } from "../index";
import TableRow from "../components/table/TableRow";

import "../styles/table.css";
import Header from "../components/table/Header";
import { FormContext } from "../Main";
import { ViewProps } from ".";
import { utils } from "../utils";

type Props = ViewProps & {
  columns: Column[];
  topRef?: React.RefObject<number>;
  setType?: (type: string) => void;
  wrapperRef?: React.RefObject<HTMLDivElement>;
  dynamicCellHeight?: boolean;
  onSelectRows?: (row: any, rowIndex: number, checkbox?: boolean, virtual?: boolean) => void;
  onSelectCells?: (cell: any, cellIndex: number, row: any) => void;
  selectedRowLength?: number;
  selectedRowIds?: any[];
  selectedCellRowIds?: string | number[];
  selectedCells?: any[];
  selectedRows?: any[];
  hadleShowForm?: (bool: boolean) => void;
  table: TableData;
  tableIndex: number;
  hasScrollBar?: boolean;
  virtualRange: any;
  defaultTableData?: DefaultTableData;
  virtualScroll?: boolean;
  setEditorRef: (ref: React.MouseEvent) => void;
  paginationOptions?: PaginationOptions;
  currentRows: any[];
  setCurrentRows: (currentRows: any[]) => void;
  setPaginationOptions?: (paginationOptions: PaginationOptions) => void;
  currentType?: string;
};

function Table({
  columns = [],
  rowAction = () => {},
  cellAction = () => {},
  loading = false,
  noDataComponent = null,
  maxWidth = "",
  cellChangeEvent = () => {},
  onSelectRows = () => {},
  onSelectCells = () => {},
  rowReorderEvent = () => {},
  selectedRowLength = 0,
  selectedRowIds = [],
  selectedCellRowIds = [],
  selectedCells = [],
  selectedRows = [],
  hadleShowForm = () => {},
  table,
  columnChangeEvent = () => {},
  tableIndex,
  paginationAction = () => {},
  extraProps = {},
  virtualRange,
  virtualScroll = false,
  defaultTableData,
  paginationOptions,
  currentType,
  currentRows,
  setCurrentRows = () => {},
  setPaginationOptions = () => {},
  setEditorRef = () => {},
}: Props) {
  const { rows } = table;

  const [newColumns, setNewColumns] = React.useState<any[]>([]);
  // const [virtualCounter, setVirtualCounter] = React.useState({ top: 0, bottom: 0 });
  const [activeIndex, setActiveIndex] = useState<null | number>(null);
  const [renderedTables, setRenderedTables] = useState<string[]>([]);
  const [draggingIndex, setDraggingIndex] = React.useState<number>(-1);
  const tableElement = useRef<HTMLTableElement>(null);
  const endRef = useRef<HTMLTableElement>(null);
  const firstRender = useRef<boolean>(false);

  // let currentColumns = createColumns(columns);
  const { setFormData } = React.useContext(FormContext);

  useEffect(() => {
    if (currentType) firstRender.current = false;
  }, [currentType]);

  useEffect(() => {
    if (rows && rows.length > 0 && table) {
      if (table.paginationOptions?.type === "paging") return doPagination(table.paginationOptions);
      OnSetCurrentRows();
    }
  }, [rows]);

  // useEffect(() => {
  //   if (!renderedTables.includes(table.key)) {
  //     firstRender.current = false;
  //   }
  // }, [table.key]);

  const initColumns = async (columns: Column[]) => {
    if (firstRender.current) return setNewColumns(columns);

    let widths: any = localStorage.getItem(table.key + "_widths");
    if (widths !== null && table?.styleOptions?.saveColumnWidthsToLS) {
      widths = await JSON.parse(widths);

      columns.forEach((col) => {
        if (widths.hasOwnProperty(col.key) && col?.ref?.current) {
          col.ref.current.style.width = widths[col.key];
        } else if (col?.ref?.current) {
          col.ref.current.style.width = col.width || "auto";
        }
      });
    } else {
      columns.forEach((col) => {
        if (col?.ref) col.ref.current.style.width = col.width || "auto";
      });
    }
    setRenderedTables((prev) => [...prev, table.key]);
    setNewColumns(columns);
    firstRender.current = true;
  };

  React.useEffect(() => {
    if (firstRender.current) initColumns(columns);
  }, [columns]);

  useEffect(() => {
    if (!table?.styleOptions?.saveColumnWidthsToLS) return;
    window.addEventListener("beforeunload", (event) => {
      console.log("beforeunload", newColumns);
      if (!newColumns || newColumns.length === 0) return;
      const currentWidths: any = {};
      newColumns.forEach((col) => {
        if (col?.ref?.current) {
          currentWidths[col.key] = col.ref.current.style.width;
        }
      });

      console.log("currentWidths", currentWidths);
      localStorage.setItem(table.key + "_widths", JSON.stringify(currentWidths));
    });
  }, []);

  const OnSetCurrentRows = React.useCallback(() => {
    if (rows && rows.length > 0) {
      setCurrentRows(rows);
    }
  }, [rows]);

  const doPagination = (paginationOptions: PaginationOptions, prevPaginationOptions?: PaginationOptions) => {
    const page = paginationOptions?.page;
    const limit = paginationOptions?.limit;

    if (paginationOptions?.type === "paging") {
      setCurrentRows(rows.slice((page - 1) * limit, page * limit));
    }
    paginationAction({
      page,
      limit,
      prevPage: prevPaginationOptions?.page || null,
      type: paginationOptions?.type,
      key: table.key,
      currentRows,
      tableIndex,
    });
  };

  const mouseMove = useCallback(
    (e: { clientX: number }) => {
      // return console.log(newColumns);
      newColumns.forEach((col, i) => {
        if (i === activeIndex) {
          const width = e.clientX - col.ref.current?.offsetLeft - 33;
          col.ref.current.style.width = `${width}px`;
          // if (endRef?.current && window.innerWidth - e.clientX > 100) endRef.current.style.width = window.innerWidth - e.clientX + "px";
        }
      });
    },
    [activeIndex, newColumns]
  );

  const removeListeners = useCallback(() => {
    window.removeEventListener("mousemove", mouseMove);
    window.removeEventListener("mouseup", removeListeners);
  }, [mouseMove]);

  const mouseUp = useCallback(() => {
    setActiveIndex(null);
    removeListeners();
  }, [setActiveIndex, removeListeners]);

  useEffect(() => {
    if (activeIndex !== null) {
      window.addEventListener("mousemove", mouseMove);
      window.addEventListener("mouseup", mouseUp);
    }

    return () => {
      removeListeners();
    };
  }, [activeIndex, mouseMove, mouseUp, removeListeners]);

  const handleShowForm = (row: any, index: number) => {
    const formOptions = utils.defaultOrTable(table, defaultTableData, "formOptions");
    formOptions ? formOptions.toggleFormAction(table) : hadleShowForm(true);

    const top: number = window.scrollY;
    setFormData({ row, top, key: table.key, tableIndex, currentRows, index });
    // Needed as if the table is virtualised, the table top height is affected by the form
    // if (table?.virtualScroll) wrapperRef?.current?.scrollIntoView();
  };

  // React.useEffect(() => {
  //   if (table?.virtualScroll) wrapperRef?.current?.scrollIntoView();
  //   console.log("rusn");
  // }, [table?.formOptions?.showForm]);

  React.useEffect(() => {
    window.addEventListener("keyup", (e) => {
      if (e.keyCode === 27) {
        setTimeout(() => {
          console.log(currentRows);
        }, 1000);
      }
    });

    return () => {
      window.removeEventListener("keydown", (e) => {});
    };
  }, [columns]);

  return (
    <>
      <table style={{ opacity: loading ? 0.5 : 1 }} className="combo-grid-table combo-grid-fade-in " ref={tableElement}>
        {columns && columns.length > 0 && (
          <Header
            initColumns={initColumns}
            setNewColumns={setNewColumns}
            tableData={table}
            columnChangeEvent={columnChangeEvent}
            currentColumns={newColumns.length > 0 ? newColumns : columns}
            maxWidth={maxWidth}
            endRef={endRef}
            setActiveIndex={setActiveIndex}
          />
        )}

        <tbody className="combo-grid-body" style={{ overflowY: "scroll", maxWidth: maxWidth || "100%" }}>
          {currentRows && currentRows.length > 0 ? (
            <>
              {virtualScroll && virtualRange.topSize !== 0 && virtualRange.lower > 0 && <tr style={{ height: virtualRange.topSize + "px" }}></tr>}

              {currentRows.map((row: { [x: string]: any }, rowIndex: number) => {
                return (virtualScroll && rowIndex >= virtualRange.lower && rowIndex <= virtualRange.upper) || !virtualScroll ? (
                  <TableRow
                    row={row}
                    rowIndex={rowIndex}
                    onSelectRows={onSelectRows}
                    virtualiseRows={() => {}}
                    rowReorderEvent={rowReorderEvent}
                    rowAction={rowAction}
                    cellAction={cellAction}
                    cellChangeEvent={cellChangeEvent}
                    selectedRows={selectedRows}
                    selectedCells={selectedCells}
                    selectedRowIds={selectedRowIds}
                    selectedCellRowIds={selectedCellRowIds}
                    key={rowIndex}
                    columns={newColumns}
                    currentRows={currentRows}
                    onSelectCells={onSelectCells}
                    setCurrentRows={setCurrentRows}
                    draggingIndex={draggingIndex}
                    setDraggingIndex={setDraggingIndex}
                    columnChangeEvent={columnChangeEvent}
                    // selectionOptions={selectionOptions}
                    setCurrentColumns={() => {}}
                    handleShowForm={handleShowForm}
                    tableDetails={{
                      key: table.key,
                      title: table.title,
                      startingType: table.startingType,
                      paginationOptions: paginationOptions,
                      virtualScroll,
                      formOptions: utils.defaultOrTable(table, defaultTableData, "formOptions"),
                    }}
                  />
                ) : null;
              })}
              {virtualScroll && virtualRange.bottomSize !== 0 && virtualRange.upper < currentRows.length && (
                <tr style={{ height: virtualRange.bottomSize + "px" }}></tr>
              )}
            </>
          ) : noDataComponent && !loading ? (
            noDataComponent
          ) : (
            !loading && <tr className="f-row" style={{ position: "absolute", left: "40%" }}></tr>
          )}
        </tbody>
      </table>
    </>
  );
}

export default Table;
