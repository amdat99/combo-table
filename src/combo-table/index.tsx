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
  dynamicCellHeight?: boolean;
  virtualizationOptions?: VirtualizationOptions;
  selectionOptions?: SelectionOptions;
  formOptions?: FormOptions;
  customFooterComponent?: ((data: FooterData) => React.ReactNode) | null;
};

export const DropDownContext = React.createContext<any>(null);

const ComboTable = (props: Props) => {
  const [currentRows, setCurrentRows] = useState<any>([]);
  const [optionsMap] = useState<any>({});
  const [currentType, setCurrentType] = useState(props.type);
  const [showForm, setShowForm] = useState(false);
  const [selectedRows, setSelectedRows] = useState<any>([]);
  const [selectedRowLength, setSelectedRowLength] = useState(0);
  const [selectedCells, setSelectedCells] = useState<any>([]);
  const [selectedCellRowIds, setSelectedCellRowIds] = useState<any>([]);
  const [selectedRowIds, setSelectedRowIds] = useState<any>([]);
  const [dropdownData, setDropdownData] = useState<any>({});
  const value = React.useMemo(() => ({ dropdownData, setDropdownData, optionsMap }), [dropdownData, optionsMap]);

  const formRef = React.useRef(null);
  const selectRef = React.useRef<HTMLDivElement>(null);
  //Hook to detect click outside of the sleect dropdown

  useOnClickOutside(selectRef, () => setDropdownData({}));

  //Hook to detect click outside of the form component
  useOnClickOutside(formRef, () => setShowForm(false));

  const { rows, type, selectionOptions, loading, customLoaderComponent, maxHeight, maxWidth, columns } = props;

  useEffect(() => {
    OnSetCurrentRows();
  }, [rows]);

  const OnSetCurrentRows = React.useCallback(() => {
    setCurrentRows([...rows]);
  }, [rows]);

  //If column is select converts the options array into an object with the value as the key and hte column label as
  useEffect(() => {
    if (columns.length > 0) {
      columns.forEach((column) => {
        if (column.hasOwnProperty("options")) optionsMap[column.key] = utils.objectify(utils.fieldMap(column.options));
      });
    }
  }, [columns]);

  useEffect(() => {
    if (currentType !== type) {
      setCurrentType(type);
    }
  }, [type]);

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
      selectedCellRowIds,
      setSelectedRowLength
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

  return (
    <>
      {showForm && <Form formRef={formRef} />}
      {dropdownData?.options && <Dropdown dropdownData={dropdownData} optionsMap={optionsMap} selectRef={selectRef} />}
      <DropDownContext.Provider value={value}>
        <div
          className="combo-table-table-wrapper combo-table-table-shadow combo-table-hide-scrollbar"
          style={{ height: maxHeight || "100%", maxWidth: maxWidth || "100%" }}
        >
          {loading && (customLoaderComponent || <span className="combo-table-loader"></span>)}
          {type === "table" && (
            <Table
              {...props}
              onSelectRows={onSelectRows}
              onSelectCells={onSelectCells}
              currentRows={currentRows}
              selectedRowLength={selectedRowLength}
              selectedRowIds={selectedRowIds}
              selectedCellRowIds={selectedCellRowIds}
              selectedCells={selectedCells}
              selectedRows={selectedRows}
              setShowForm={setShowForm}
              setCurrentRows={OnSetCurrentRows}
            />
          )}
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
  event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement | HTMLSelectElement> | React.MouseEvent;
  prevValue: any;
  value: any;
  row: any;
  cellKey: string;
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

export type FormOptions = { showForm: boolean; showOpenFormHandle: boolean; formView: "side" | "modal" | "full" };

export type VirtualizationOptions = { renderedRows: number; enable: boolean };
