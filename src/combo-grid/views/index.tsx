import React, { useState } from "react";
import { BaseProps, PaginationOptions, TableData } from "..";
import TableFooter from "../components/table/TableFooter";
import { useHasScrollBar } from "../hooks/useHasScrollBart";
import tableService from "../services/table.service";
import { utils } from "../utils";
import Board from "./Board";
import Table from "./Table";
import ViewOptions from "./ViewOptions";

export type ViewProps = BaseProps & {
  i: number;
  currentTableKey: string;
  currentType: string;
  setShowForm: React.Dispatch<React.SetStateAction<boolean>>;
  table: TableData;
  showViewOptions: boolean;
  setTypeMap: React.Dispatch<React.SetStateAction<any>>;
};

function Views(props: ViewProps) {
  const { maxHeight, maxWidth, table, i, currentTableKey, currentType, setShowForm, defaultTableData } = props;
  const virtualizationOptions = utils.defaultOrTable(props.table, defaultTableData, "virtualizationOptions");

  const [editorRef, setEditorRef] = useState<React.MouseEvent | null>(null);
  const [selectedRows, setSelectedRows] = useState<any>([]);
  const [selectedCells, setSelectedCells] = useState<any>([]);
  const [selectedCellRowIds, setSelectedCellRowIds] = useState<any>([]);
  const [currentRows, setCurrentRows] = React.useState<any[]>([]);

  const [paginationOptions, setPaginationOptions] = React.useState<PaginationOptions>({ page: 1, limit: 12, type: "paging" });
  const [selectedRowIds, setSelectedRowIds] = useState<any>([]);
  const [virtualRange, setVirtualRange] = React.useState({
    lower: 0,
    upper: virtualizationOptions?.renderedRows || 10,
    currentId: 0,
    bottomSize: 0,
    topSize: 0,
  });

  const wrapperRef = React.useRef(null);
  const hasScrollBar = useHasScrollBar(wrapperRef);
  const estimatedRowHeight = virtualizationOptions?.tableCellHeight || 30;
  const extraRange = virtualizationOptions?.renderedRows ? virtualizationOptions?.renderedRows / 3 : 15;
  const renderedRows = virtualizationOptions?.renderedRows || 30;
  const virtualScroll = utils.defaultOrTable(table, defaultTableData, "virtualScroll");

  let timeout: any;

  React.useEffect(() => {
    if (!table) return;
    if (virtualScroll) virtualiseRows(0, true);
    if (table.paginationOptions) setPaginationOptions(table.paginationOptions);
  }, [table, currentType]);

  React.useEffect(() => {
    if (editorRef) console.log(editorRef);
  }, [editorRef]);
  //Handles the selection of checkbox select and row on clcik if selectionOptions.rowactionSelects is true
  const onSelectRows = (row: any, rowIndex: number, bulk = false, checkbox = false) => {
    tableService.selectRows(
      row,
      rowIndex,
      bulk,
      checkbox,
      setSelectedRows,
      selectedRows,
      setSelectedRowIds,
      props.selectionOptions,
      selectedCells,
      selectedRowIds,
      selectedCellRowIds
    );
  };

  const onSelectCells = (cell: any, cellIndex: number, row: any, bulk = false) => {
    if (!bulk) {
      setSelectedCells([]);
      setSelectedCellRowIds([]);
    }
    selectedCells.push(cell);
    selectedCellRowIds.push(cellIndex + "_" + row.id);
  };

  const virtualiseRows = (rowIndex: number, firstRender = false) => {
    if (timeout) clearTimeout(timeout);
    //@ts-ignore

    timeout = setTimeout(
      () => {
        if (virtualRange.upper > table.rows.length)
          setVirtualRange({ ...virtualRange, upper: table.rows.length, lower: table.rows.length - (renderedRows + extraRange) });
        if (firstRender || rowIndex + extraRange * 2 > virtualRange.upper || rowIndex < virtualRange.lower + extraRange) {
          setVirtualRange({
            lower: rowIndex - (renderedRows + extraRange),
            upper: rowIndex + (renderedRows + extraRange),
            currentId: rowIndex,
            topSize: (rowIndex - (renderedRows + extraRange)) * estimatedRowHeight,
            bottomSize: (table.rows.length - (rowIndex + extraRange)) * estimatedRowHeight,
          });
        }
      },
      firstRender ? 0 : 0
    );
  };
  const hadleShowForn = (bool: boolean) => {
    setShowForm(bool);
  };

  const doPagination = (paginationOptions: PaginationOptions, prevPaginationOptions?: PaginationOptions) => {
    const page = paginationOptions?.page;
    const limit = paginationOptions?.limit;

    if (paginationOptions?.type === "paging") {
      setCurrentRows(table.rows.slice((page - 1) * limit, page * limit));
    }
    if (props.paginationAction)
      props.paginationAction({
        page,
        limit,
        prevPage: prevPaginationOptions?.page || null,
        type: paginationOptions?.type,
        key: table.key,
        currentRows,
        tableIndex: i,
      });
  };

  const updatePage = (page: number) => {
    const currentPaginationOptions = { ...paginationOptions, page };
    doPagination(currentPaginationOptions, paginationOptions);
    setPaginationOptions(currentPaginationOptions);
  };

  return (
    <>
      <div
        className="combo-grid-table-wrapper combo-grid-fade-in "
        style={{
          height: maxHeight || "100%",
          width: maxWidth || "100%",
          display: currentTableKey === table.key ? "flex" : "none",
        }}
        ref={wrapperRef}
        key={table.key}
        onScroll={(e) => {
          //@ts-ignore :   React type error for target
          if (virtualScroll) virtualiseRows(Math.floor(e.target?.scrollTop / estimatedRowHeight));
        }}
      >
        <>
          {currentType === "table" && (
            <Table
              {...props}
              onSelectRows={onSelectRows}
              onSelectCells={onSelectCells}
              selectedRows={selectedRows}
              selectedRowLength={selectedRows.length}
              selectedRowIds={selectedRowIds}
              selectedCellRowIds={selectedCellRowIds}
              selectedCells={selectedCells}
              hadleShowForm={hadleShowForn}
              columns={table.columns}
              table={table}
              tableIndex={i}
              hasScrollBar={hasScrollBar}
              wrapperRef={wrapperRef}
              virtualRange={virtualRange}
              virtualScroll={virtualScroll}
              setEditorRef={setEditorRef}
              currentRows={currentRows}
              setCurrentRows={setCurrentRows}
              setPaginationOptions={setPaginationOptions}
              paginationOptions={paginationOptions}
              currentType={currentType}
            />
          )}

          {currentType === "board" && <Board />}
        </>
      </div>
      {props.currentTableKey === table.key && (
        <>
          {props.showViewOptions && <ViewOptions currentType={currentType} wrapperRef={wrapperRef} setTypeMap={props.setTypeMap} table={props.table} />}

          <TableFooter
            updatePage={updatePage}
            tableData={props.table}
            paginationOptions={utils.defaultOrTable(props.table, defaultTableData, "paginationOptions")}
            selectedRowLength={selectedRows.length}
            columns={table.columns}
            currentRows={props.table.rows}
          />
        </>
      )}
    </>
  );
}

export default Views;
