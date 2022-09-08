import { CellChangeEvent, Column, SelectionData } from "../index";
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
  let duplicate = false;
  if (val.multiple) {
    if (!currentRows[rowIndex][column.key]) {
      currentRows[rowIndex][column.key] = [];
    } else {
      currentRows[rowIndex][column.key].forEach((cell: any) => {
        if (cell === val.value) {
          duplicate = true;
        }
      });
    }
    if (duplicate) {
      return val;
    }
    currentRows[rowIndex][column.key].push(val.value);
  } else {
    currentRows[rowIndex][column.key] = val.value;
  }
  // setCurrentRows(newRows);
  if (column.maxLength && checkIfNumForLength(val.value, column) > column.maxLength) {
    val.maxLengthError = `${column.label} must be below ${column.maxLength} characters`;
    hasError = true;
  }
  if (column.minLength && checkIfNumForLength(val.value, column) < column.minLength) {
    val.maxLengthError = `${column.label} must be above ${column.minLength} characters`;
    hasError = true;
  }

  if (column.subType && textValidators[column.subType] && !val.value.match(textValidators[column.subType]?.pattern)) {
    val.patternError = textValidators[column.subType]?.error;
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

const tableService = {
  selectRows,
  onCellValidate,
} as const;

Object.freeze(tableService);

export default tableService;
