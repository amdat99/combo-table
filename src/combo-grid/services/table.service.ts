import { CellChangeEvent, Column, SelectionData, TableData } from "../index";
import { utils } from "../utils";
import { textValidators } from "../validators";

const selectRows = (
  row: any,
  rowIndex: number,
  bulk = false,
  checkbox = false,
  setSelectedRows: (rows: any[]) => void,
  selectedRows: any[],
  setSelectedRowIds: React.Dispatch<any>,
  selectionOptions: undefined | { rowActionSelects?: boolean; cellActionSelects?: boolean; getSelections?: (data: SelectionData) => void },
  selectedCells: any[],
  selectedRowIds: any[],
  selectedCellRowIds: string | number[]
) => {
  let currentselectedRows = selectedRows;

  if (checkbox || selectionOptions?.rowActionSelects) {
    if (!bulk) {
      setSelectedRows([]);
      setSelectedRowIds([]);
    }
    if (selectedRowIds.includes(row.id)) {
      if (currentselectedRows.length === 1) {
        setSelectedRows([]);
        setSelectedRowIds([]);
      }
      currentselectedRows = selectedRows.filter((selectedRow) => selectedRow.id !== row.id);
      setSelectedRows(currentselectedRows);
      const ids = selectedRowIds.filter((id: number | string) => id !== row.id);
      setSelectedRowIds(ids);
    } else {
      selectedRows.push(row);
      selectedRowIds.push(row.id);
    }
  }

  if (selectionOptions?.getSelections)
    selectionOptions.getSelections({
      selectedRows: selectedRows,
      selectedCells: selectedCells,
      selectedRowIds: selectedRowIds,
      selectedCellRowIds: selectedCellRowIds,
    });
};

const onCellValidate = (val: CellChangeEvent, currentRows: any, rowIndex: number, column: Column) => {
  let hasError = false;
  //Set the cuurent cell value

  currentRows[rowIndex][column.key] = val.value;
  const checkVal = val.htmlValue ? val.value.replace(/(\r\n|\n|\r)/gm, "") : val.value;

  //Error validation checks
  if (column.required && !val.value) {
    val.requiredError = `${column.label} is required`;
    hasError = true;
  } else if (val.value && column.subType && textValidators[column.subType] && !checkVal.match(textValidators[column.subType]?.pattern)) {
    val.patternError = textValidators[column.subType]?.error;
    hasError = true;
  } else if (val.value && column.maxLength && checkIfNumForLength(checkVal, column) > column.maxLength) {
    val.maxLengthError = `${column.label} must be below ${column.maxLength} characters`;
    hasError = true;
  } else if (val.value && column.minLength && checkIfNumForLength(checkVal, column) < column.minLength) {
    val.maxLengthError = `${column.label} must be above ${column.minLength} characters`;
    hasError = true;
  }

  val.hasError = hasError;

  return val;
};

const checkIfNumForLength = (value: any, column: Column) => {
  if (value) {
    if (column?.subType === "number") {
      return parseInt(value);
    } else {
      return value.length;
    }
  }
};

const formatTableData = (tableData: TableData[], optionsMap: any, firstRenderedTableKey?: string) => {
  const types: any = {};
  const tableKeys: any = [];
  let startingTable: TableData | any = null;
  tableData.forEach((table, i) => {
    types[table.key] = table.startingType || "table";
    tableKeys.push(table.key);
    if (firstRenderedTableKey) {
      //@ts-ignore
      table.index = i;
      startingTable = table;
    }
    if (table.columns.length > 0) {
      table.columns.forEach((column: Column) => {
        if (column.hasOwnProperty("options")) {
          optionsMap[table.key + column.key] = utils.objectify(utils.fieldMap(column.options));
        }
      });
    }
  });

  return { types, tableKeys, optionsMap, startingTable };
};

const tableService = {
  selectRows,
  onCellValidate,
  formatTableData,
} as const;

Object.freeze(tableService);

export default tableService;
