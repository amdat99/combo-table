import React, { useEffect, useState } from "react";
import Table from "./views/Table";
import Form from "./components/form";
import Dropdown from "./components/shared/select/Dropdown";

import tableService from "./services/table.service";
import useOnClickOutside from "./hooks/useOnClickOutside";
import { utils } from "./utils";

import "./styles/variables.css";
import "./styles/table.css";
import "./styles/select.css";
import Toolbar from "./components/shared/toolbar";

type Props = {
  tableData: { key: string; title?: string; columns: Column[]; rows: any[]; startingType?: string }[];
  type?: "table" | "board" | "list" | "card";
  loading?: boolean;
  maxHeight?: string;
  maxWidth?: string;
  setType?: (type: string) => void;
  rowAction?: (rowData: RowAction) => void;
  cellAction?: (cellData: CellAction) => void;
  cellChangeEvent?: (data: CellChangeEvent) => void;
  columnChangeEvent?: (data: ColumnChangeEvent) => void;
  noDataComponent?: React.ReactNode;
  customLoaderComponent?: React.ReactNode;
  dynamicCellHeight?: boolean;
  virtualizationOptions?: VirtualizationOptions;
  selectionOptions?: SelectionOptions;
  formOptions?: FormOptions;
  customFooterComponent?: ((data: FooterData) => React.ReactNode) | null;
};

export const DropDownContext = React.createContext<any>(null);

const ComboTable = (props: Props) => {
  const [optionsMap, setOptionsMap] = useState<any>({});
  const [typeMap, setTypeMap] = useState<any>({});
  const [showForm, setShowForm] = useState(false);
  const [tableKeys, setTableKeys] = useState<any[]>([]);
  const [selectedRows, setSelectedRows] = useState<any>([]);
  const [selectedRowLength, setSelectedRowLength] = useState(0);
  const [selectedCells, setSelectedCells] = useState<any>([]);
  const [selectedCellRowIds, setSelectedCellRowIds] = useState<any>([]);
  const [selectedRowIds, setSelectedRowIds] = useState<any>([]);
  const [dropdownData, setDropdownData] = useState<any>({});
  const [tempDisableDropdownClose, setTempDisableDropdownClose] = useState(false);
  const [currentTableKey, setCurrentTableKey] = useState("");
  const value = React.useMemo(() => ({ dropdownData, setDropdownData, optionsMap }), [dropdownData, optionsMap]);

  const formRef = React.useRef(null);
  const selectRef = React.useRef<HTMLDivElement>(null);
  //Hook to detect click outside of the sleect dropdown
  const { selectionOptions, loading, customLoaderComponent, maxHeight, maxWidth, formOptions, tableData } = props;

  useOnClickOutside(selectRef, () => setDropdownData({}), tempDisableDropdownClose);

  //Hook to detect click outside of the form component
  useOnClickOutside(formRef, () => (formOptions ? formOptions.setShowForm(false) : setShowForm(false)));

  //If column is select converts the options array into an object with the value as the key and hte column label as
  useEffect(() => {
    const types: any = {};
    const tableKeys: any = [];
    tableData.forEach((table) => {
      types[table.key] = table.startingType || "table";
      tableKeys.push(table.key);
      if (table.columns.length > 0) {
        table.columns.forEach((column) => {
          if (column.hasOwnProperty("options")) optionsMap[column.key] = utils.objectify(utils.fieldMap(column.options));
        });
      }
    });
    setCurrentTableKey(tableData[0].key);
    setTypeMap(types);
    setTableKeys(tableKeys);
    console.log("oepoire", optionsMap);
  }, [tableData]);

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
      selectionOptions,
      selectedCells,
      selectedRowIds,
      selectedCellRowIds
    );
    setSelectedRowLength(selectedRows.length);
  };

  const onSelectCells = (cell: any, cellIndex: number, row: any, bulk = false) => {
    if (!bulk) {
      setSelectedCells([]);
      setSelectedCellRowIds([]);
    }
    selectedCells.push(cell);
    selectedCellRowIds.push(cellIndex + "_" + row.id);
  };

  const showFormFlag = formOptions ? formOptions.showForm : showForm;
  return (
    <>
      {dropdownData?.options && (
        <Dropdown
          dropdownData={dropdownData}
          optionsMap={optionsMap}
          selectRef={selectRef}
          setOptionsMap={setOptionsMap}
          setTempDisableDropdownClose={setTempDisableDropdownClose}
        />
      )}
      <DropDownContext.Provider value={value}>
        {showFormFlag && <Form formRef={formRef} />}
        <div className="combo-table-table-wrapper" style={{ height: maxHeight || "100%", maxWidth: maxWidth || "100%" }}>
          {loading && (customLoaderComponent || <span className="combo-table-loader"></span>)}
          <Toolbar tableKeys={tableKeys} setCurrentTableKey={setCurrentTableKey} currentTableKey={currentTableKey} />
          {tableData.map((table) => {
            return (
              <div key={table.key}>
                {currentTableKey === table.key && typeMap[table.key] === "table" && (
                  <Table
                    {...props}
                    onSelectRows={onSelectRows}
                    onSelectCells={onSelectCells}
                    selectedRowLength={selectedRowLength}
                    selectedRowIds={selectedRowIds}
                    selectedCellRowIds={selectedCellRowIds}
                    selectedCells={selectedCells}
                    selectedRows={selectedRows}
                    setShowForm={setShowForm}
                    columns={table.columns}
                    rows={table.rows}
                    title={table.title}
                    tableKey={table.key}
                  />
                )}
              </div>
            );
          })}
        </div>
      </DropDownContext.Provider>
    </>
  );
};

export default ComboTable;

ComboTable.defaultProps = {
  type: "table",
  loading: false,
  maxHeight: "100%",
  maxWidth: "100%",
  dynamicCellHeight: false,
  virtualizationOptions: { renderedRows: 50, enable: false },
  selectionOptions: { rowActionSelects: false, cellActionSelects: false },
  formOptions: { showForm: false, showOpenFormHandle: false, formView: "side" },
  customFooterComponent: null,
  columns: [],
  rows: [],
  setType: () => {},
  rowAction: () => {},
  cellAction: () => {},
  cellChangeEvent: () => {},
  noDataComponent: null,
};

export type Column = {
  id?: string | number;
  key: string;
  label: string;
  type?: string;
  multiple?: boolean;
  subType?: "number" | "email" | "password" | "tel" | "url" | "char" | "decimal";
  dateType?: "date" | "time" | "datetime-local" | "month" | "week" | "datetime";
  options?: { value: any; label: string; color?: string; action?: Function }[];
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
  extraProps?: any;
  disableCheckBox?: boolean;
};

export type RowAction = {
  row: any;
  rowIndex: number;
  selectedRows: any[];
  selectedCells: any[];
  event: React.MouseEvent;
  tableKey: string | number;
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
  tableKey: string | number;
};

export type Transformer = {
  cell: any;
  row: any;
  cellKey: string;
  cellIndex: number;
  rowIndex: number;
};

export type CellChangeEvent = {
  event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement | HTMLSelectElement> | React.MouseEvent;
  prevValue: any;
  value: any;
  row: any;
  cellKey: string;
  tableKey: string | number;
  cellIndex: number;
  rowIndex: number;
  minLengthError?: string;
  maxLengthError?: string;
  patternError?: string;
  textarea?: boolean;
  text?: boolean;
  hasError?: boolean;
  option?: any;
  multiple?: boolean;
  cb?: any;
  delete?: boolean;
};

export type ColumnChangeEvent = {
  type: string;
  tableKey: string | number;
  columnKey: string;
  value: any;
  options: any[];
  columnIndex: number;
  prevOptions: any[];
  event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement | HTMLSelectElement> | React.MouseEvent;
};

export type SelectionOptions = {
  rowActionSelects?: boolean;
  cellActionSelects?: boolean;
  getSelections?: (data: SelectionData) => void;
};

export type SelectionData = {
  selectedRows: any[];
  selectedCells: any[];
  selectedRowIds: string | number[];
  selectedCellRowIds: string | number[];
};

export type FooterData = {
  selectedRows: any[];
  selectedCells: any[];
  selectedRowIds: string | number[];
  selectedCellRowIds: string | number[];
  selectedRowLength: number;
};

export type FormOptions = {
  showForm: boolean;
  setShowForm: React.Dispatch<React.SetStateAction<boolean>>;
  showOpenFormHandle?: boolean;
  formView?: "side" | "modal" | "full";
};

export type VirtualizationOptions = { renderedRows: number; enable: boolean };
