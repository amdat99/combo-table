import React from "react";
import { DragDropContext, DropResult } from "react-beautiful-dnd";
import {
  CellAction,
  CellChangeEvent,
  Column,
  FooterData,
  FormOptions,
  RowAction,
  SelectionData,
  SelectionOptions,
  VirtualizationOptions,
} from "../index";
import TableFooter from "../components/table/TableFooter";
import TableRow from "../components/table/TableRow";

type Props = {
  columns: Column[];
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
  dynamicCellHeight?: boolean;
  virtualizationOptions?: VirtualizationOptions;
  selectionOptions?: SelectionOptions;
  formOptions?: FormOptions;
  customFooterComponent?: ((data: FooterData) => React.ReactNode) | null;
  onSelectRows?: (row: any, rowIndex: number, checkbox?: boolean, virtual?: boolean) => void;
  onSelectCells?: (cell: any, cellIndex: number, row: any) => void;
  currentRows?: any[];
  selectedRowLength?: number;
  selectedRowIds?: any[];
  selectedCellRowIds?: string | number[];
  selectedCells?: any[];
  selectedRows?: any[];
  setShowForm?: React.Dispatch<React.SetStateAction<boolean>>;
  setCurrentRows?: (currentRows: any[]) => void;
};

function Table({
  columns = [],
  rowAction = () => {},
  cellAction = () => {},
  loading = false,
  noDataComponent = null,
  maxWidth = "",
  cellChangeEvent = () => {},
  virtualizationOptions = { renderedRows: 50, enable: false },
  selectionOptions = { rowActionSelects: false, cellActionSelects: false },
  formOptions = { showForm: false, setShowForm: () => {}, showOpenFormHandle: true, formView: "side" },
  customFooterComponent = null,
  onSelectRows = () => {},
  onSelectCells = () => {},
  currentRows = [],
  selectedRowLength = 0,
  selectedRowIds = [],
  selectedCellRowIds = [],
  selectedCells = [],
  selectedRows = [],
  setShowForm = () => {},
  setCurrentRows = () => {},
}: Props) {
  const [virtualRange, setVirtualRange] = React.useState({ lower: 0, upper: virtualizationOptions?.renderedRows, currentId: 0 });

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) {
      return;
    }
    const { source, destination } = result;
    if (source.droppableId === destination.droppableId) {
      const items = currentRows.slice();
      const [removed] = items.splice(source.index, 1);
      items.splice(destination.index, 0, removed);

      setCurrentRows(items);
    } else {
      const sourceItems = currentRows.slice();
      const [removed] = sourceItems.splice(source.index, 1);
      const destItems = currentRows.slice();
      destItems.splice(destination.index, 0, removed);
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <table style={{ opacity: loading ? 0.5 : 1 }} className="combo-table-table ">
        {columns.length > 0 && (
          // <Droppable droppableId="board" type="ROW" direction={"horizontal"}>
          //   {(provided) => {
          // return (
          <thead className="combo-table-header" style={{ maxWidth: maxWidth || "100%", height: "30px" }}>
            <tr
            // ref={provided.innerRef} {...provided.droppableProps}
            >
              {columns.map((column, i) => (
                // <Draggable key={column.key || i} draggableId={column.key} index={i}>
                //   {(provided) => (
                <th
                  key={column.key || i}
                  // ref={provided.innerRef}
                  // {...provided.draggableProps}
                  // {...provided.dragHandleProps}
                  className={"combo-table-header-content " + column.columnClass}
                  style={column.columnStyle}
                >
                  {column.type === "checkbox" && <input type="checkbox" />}
                  {column.label}
                </th>
                //   )}
                // </Draggable>
              ))}
              {/* {provided.placeholder} */}
            </tr>
          </thead>
          // );
          //   }}
          // </Droppable>
        )}
        {/* <Droppable droppableId="row" type="ROW" direction="vertical">
            {(provided) => { */}
        {/* return ( */}
        <tbody
        //  ref={provided.innerRef} {...provided.droppableProps}
        >
          {currentRows && currentRows.length > 0
            ? currentRows.map((row: { [x: string]: any }, rowIndex: number) => {
                return (
                  // <Draggable key={row.id || rowIndex} draggableId={row.id.toString() || rowIndex.toString()} index={rowIndex}>
                  //   {(provided) => (
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
                    selectedRowIds={selectedRowIds}
                    selectedCellRowIds={selectedCellRowIds}
                    key={rowIndex}
                    columns={columns}
                    currentRows={currentRows}
                    onSelectCells={onSelectCells}
                    setVirtualRange={setVirtualRange}
                    setCurrentRows={setCurrentRows}
                    virtualizationOptions={virtualizationOptions}
                    // selectionOptions={selectionOptions}
                    formOptions={formOptions}
                    setShowForm={setShowForm}

                    // provided={provided}
                  />
                  //   )}
                  // </Draggable>
                );
              })
            : noDataComponent && !loading
            ? noDataComponent
            : !loading && (
                <tr>
                  <td>No data</td>
                </tr>
              )}
          {/* {provided.placeholder} */}
        </tbody>
        {customFooterComponent ? (
          customFooterComponent({ selectedRows, selectedCells, selectedRowIds, selectedCellRowIds, selectedRowLength })
        ) : (
          <TableFooter columns={columns} currentRows={currentRows} selectedRowLength={selectedRowLength} />
        )}
        {/* }}
          </Droppable> */}
      </table>
    </DragDropContext>
  );
}

export default Table;
