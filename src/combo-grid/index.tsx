import TableRoot from "./Main";

import "./styles/variables.css";
import "./styles/table.css";
import "./styles/utils.css";
import "./styles/toolbar.css";
import "./styles/select.css";

export type BaseProps = {
  tableData: TableData[];
  defaultTableData?: DefaultTableData;
  loading?: boolean;
  maxHeight?: string;
  maxWidth?: string;
  renderOptions?: RenderOptions;
  setType?: (type: string) => void;
  rowAction?: (rowData: RowAction) => void;
  cellAction?: (cellData: CellAction) => void;
  cellChangeEvent?: (data: CellChangeEvent) => void;
  columnChangeEvent?: (data: ColumnChangeEvent) => void;
  rowReorderEvent?: (data: RowReorderEvent) => void;
  noDataComponent?: React.ReactNode;
  customLoaderComponent?: React.ReactNode;
  dynamicCellHeight?: boolean;
  virtualizationOptions?: VirtualizationOptions;
  selectionOptions?: SelectionOptions;
  customFooterComponent?: ((data: FooterData) => React.ReactNode) | null;
  customToolbarComponent?: ((data: ToolbarData) => React.ReactNode) | null;
  extraProps?: any;
  paginationAction?: (data: PaginateData) => void;
};

type RenderOptions = {
  firstRenderedTableKey?: string; //This is the first table that will be rendered

  //  If altRenderMethod is not provided the default render method would be used. This works by only rendering the first table in view on init. If a new table is opened from the toolbar it will then be rendered and will stay rendered. As such all tables will stay rendered if rendered once.
  //The rennder-all option will render all tables on init, on table change and tables will stay rendered . The render-only-inview  option will only render the current table in view. The only table that will stay rendered is the one that is in view.
  altRenderMethod?: "render-all" | "render-only-inview";
};

const ComboTable = (props: BaseProps) => {
  return <TableRoot {...props} />;
};
export default ComboTable;

ComboTable.defaultProps = {
  loading: false,
  maxHeight: "100%",
  maxWidth: "100%",
  dynamicCellHeight: false,
  virtualizationOptions: { renderedRows: 50 },
  selectionOptions: { rowActionSelects: false, cellActionSelects: false },
  customFooterComponent: null,
  columns: [],
  rows: [],
  setType: () => {},
  rowAction: () => {},
  cellAction: () => {},
  cellChangeEvent: () => {},
  noDataComponent: null,
  extaProps: {},
};

//Types

export type DefaultTableData = {
  title?: string;
  startingType?: string;
  paginationOptions?: {
    type: "lazy-load" | "server-side-paging" | "paging";
    page: number;
    limit: number;
    total?: number;
  };
  virtualScroll?: boolean;
  expandableOptions?: {
    expandComponents: {
      key: string;
      component: (data: RowAction) => React.ReactNode;
    }[];
    expandOnRowClick?: string; // This should be existing string in the expandableComponent/ Providing the key wold expand this component on row click
  };
  formOptions?: FormOptions;
  bodyStyle?: React.CSSProperties;
  virtualizationOptions?: VirtualizationOptions;
  styleOptions?: {
    saveColumnWidthsToLS?: boolean;
  };
};

export type TableData = DefaultTableData & {
  key: string;
  columns: Column[];
  showTableForm?: boolean;
  tableView?: string;
  rows: any[];
  newRows?: any[];
};

export type DefaultTableOptions = {
  key: string;
  customType?: string;
  title?: string;
  startingType?: string;
  paginationOptions?: PaginationOptions;
  virtualScroll?: boolean;
  expandableOptions?: {
    expandComponents: {
      key: string;
      component: (data: RowAction) => React.ReactNode;
    }[];
    expandOnRowClick?: string; // This should be existing string in the expandableComponent/ Providing the key wold expand this component on row click
  };
  formOptions?: FormOptions;
  bodyStyle?: React.CSSProperties;
  styleOptions?: {
    saveColumnWidthsToLS?: boolean;
  };
};

export type Column = {
  id?: string | number;
  key: string; // Should bn unique in the table
  label: string; // Column name
  required?: boolean; // If the column is required
  isFormTitle?: boolean; //THis columnn would be shown as the title in the form
  maxWidth?: number | string; //The starting width of the column
  width?: number | string;
  type?: "input" | "quill" | "readonly" | "combo-select" | "select" | "checkbox" | "checkbox-select" | "html" | "date" | "textarea" | "radio" | "button"; //The type of the column
  customType?: string;
  multiple?: boolean; //If using with the tag-select type if selecting multiple options is allowed
  subType?: "number" | "email" | "password" | "tel" | "url" | "char" | "decimal"; //The type of the input field
  dateType?: "date" | "time" | "datetime-local" | "month" | "week" | "datetime"; //If the column is of type date
  options?: {
    value: any;
    label: string;
    color?: string;
    action?: Function;
    classTransformer?: (value: Transformer) => string; //Function to transform the cell class based on the value
    optionTransformer?: (value: Transformer) => any; //Function to transform the inner cell component based on the value
    styleTransformer?: (value: Transformer) => any; //Function to transform the cell style based on the value
    style?: React.CSSProperties;
    className?: string;
    id?: string;
  }[];
  columnClass?: string;
  headerClass?: string;
  columnStyle?: React.CSSProperties;
  cellStyle?: React.CSSProperties;
  styleTransformer?: (value: Transformer) => React.CSSProperties; //Function to transform the cell style based on the value
  cellClass?: string;
  classTransformer?: (value: Transformer) => string; //Function to transform the cell class based on the value
  cellTransformer?: (value: Transformer) => any; //Function to transform the inner cell component based on the value
  textTransformer?: (value: Transformer) => any; //Function to transform the text of the cell based on the value
  minLength?: number; //For input type
  maxLength?: number;
  initCellRender?: boolean;
  extraProps?: any; //Extra properties that can be passed
  disableCheckBox?: boolean;
  hideValidation?: boolean; //Visual validation will be hidden but validation on values will still be done
  noValidation?: boolean; //No validation will be done and no validation will be shown
  expandOnCellClick?: string; //// This should be existing string in the expandableComponent/ Providing the key wold expand this component on the cell click
  events?: {
    onBlur?: (data: CellAction) => void;
    onFocus?: (data: CellAction) => void;
    onClick?: (data: CellAction) => void;
    onKeyDown?: (data: CellAction) => void;
    onKeyUp?: (data: CellAction) => void;
    onMouseEnter?: (data: CellAction) => void;
    onMouseLeave?: (data: CellAction) => void;
    onMouseUp?: (data: CellAction) => void;
    onMouseDown?: (data: CellAction) => void;
    onMouseMove?: (data: CellAction) => void;
    onMouseOver?: (data: CellAction) => void;
    onMouseOut?: (data: CellAction) => void;
  };
  customValidator?(arg0: any, row: any): React.ReactNode;
  noReorderable?: boolean;
  ctxMenuOptions?: any;
  customAddCellComponent?: (data: Transformer) => React.ReactNode; //Function to render a custom component if no value is in cell (provide null if u want nothing rendered )
  ref?: React.MutableRefObject<any>; // This ref is passed to the th element of the column (passing a ref could break the column resizing for this column)
  quillOptions?: any;
};

export type RowAction = {
  row: any;
  rowIndex: number;
  selectedRows: any[];
  selectedCells: any[];
  event: React.MouseEvent;
  tableKey: string | number;
  column?: Column;
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
  column?: Column;
};

export type Transformer = {
  cell: any;
  row: any;
  cellKey: string;
  cellIndex: number;
  rowIndex: number;
  column?: Column;
  inForm?: boolean;
};

export type CellChangeEvent = {
  event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement | HTMLSelectElement> | React.MouseEvent;
  prevValue: any;
  value: any;
  htmlValue?: string;
  row: any;
  cellKey: string;
  tableKey: string | number;
  cellIndex: number;
  rowIndex: number;
  rollback: (val?: any) => void;
  minLengthError?: string;
  maxLengthError?: string;
  patternError?: string;
  requiredError?: string;
  textarea?: boolean;
  text?: boolean;
  hasError?: boolean;
  option?: any;
  multiple?: boolean;
  cb?: any;
  delete?: boolean;
  column?: Column;
};

export type ColumnChangeEvent = {
  type: string;
  tableKey: string | number;
  columnKey: string;
  value?: any;
  newColumn: Column;
  prevColumn?: Column;
  prevColumnKey?: string;
  prevColumnIndex?: number;
  newColumns: Column[];
  options?: any[];
  columnIndex: number;
  prevOptions?: any[];
  event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement | HTMLSelectElement> | React.MouseEvent | React.KeyboardEvent | React.DragEvent;
};

export type RowReorderEvent = {
  tableKey: string | number;
  targetIndex: number;
  index: number;
  targetRow: any;
  row: any;
  newRows: any[];
  event: React.DragEvent;
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
  tableData: TableData;
  paginationOptions: PaginationOptions;
  setPaginationOptions: (data: PaginationOptions) => void;
  tableIndex?: number;
  extraProps?: any;
};

export type ToolbarData = {
  tableKeys: any[];
  setCurrentTableKey: React.Dispatch<React.SetStateAction<string>>;
  currentTableKey: string;
  tableData: TableData[];
  extraProps?: any;
};

export type FormOptions = {
  toggleFormAction: (data: TableData) => void;
  showOpenFormHandle?: boolean;
  formView?: "side" | "modal" | "full";
  submitAction?: (RowAction: RowAction) => void;
  showButton?: boolean;
  customButton?: (data: Transformer) => React.ReactNode;
  topFormContent?: () => React.ReactNode;
  leftSideFormContent?: () => React.ReactNode;
  rightSideFormContent?: () => React.ReactNode;
  bottomFormContent?: () => React.ReactNode;
  customFormComponent?: (data: Transformer) => React.ReactNode;
};

export type PaginationOptions = {
  page: number;
  limit: number;
  type: "lazy-load" | "server-side-paging" | "paging";
  total?: number;
};
export type PaginateData = {
  page: number;
  limit: number;
  prevPage?: number | null;
  type: string;
  key: string;
  currentRows: any[];
  tableIndex: number;
};

export type VirtualizationOptions = { renderedRows?: number; tableCellHeight?: number };
