import React from "react";
//@ts-ignore
import ValidationBox from "./ValidationBox";

import { textValidators } from "../../validators";
import { Column, CellChangeEvent, FormOptions, ColumnChangeEvent } from "../../index";
import "../../styles/cell.css";
import Select from "../shared/select";
import tableService from "../../services/table.service";
import Cell from "../shared/Cell";

type Props = {
  row: any;
  column: Column;
  rowIndex: number;
  cellIndex: number;
  currentRows: any[];
  cellChangeEvent: (data: CellChangeEvent) => void;
  columnChangeEvent: (data: ColumnChangeEvent) => void;
  setCurrentRows: (data: any[]) => void;
  onSetColumns: (data: any[], index: number) => void;
  prevSizes: any;
  setPrevSizes: Function;
  setShowForm: React.Dispatch<React.SetStateAction<boolean>>;
  formOptions: FormOptions;
  tableKey: string | number;
};

const CellContent = ({
  row,
  column,
  rowIndex,
  cellIndex,
  currentRows,
  cellChangeEvent,
  prevSizes,
  setPrevSizes,
  tableKey,
  formOptions,
  setShowForm,
  columnChangeEvent,
  onSetColumns,
}: Props) => {
  const [reresnder, setRerender] = React.useState(false);
  const [showOpenHandle, setShowOpenHandle] = React.useState<boolean>(false);
  const [renderInputs, setRenderInputs] = React.useState(false);
  const changeRef = React.useRef<any>(null);
  let valRef = React.useRef<any>(null);
  let renderTimeout = null;
  let resizeTimeout = null;

  const minLengthError = column.minLength && checkIfNumForLength(row[column.key], column) < column.minLength;
  const maxLengthError = column.maxLength && checkIfNumForLength(row[column.key], column) > column.maxLength;
  const patternError = column.subType && textValidators[column.subType] && !row[column.key].match(textValidators[column.subType]?.pattern);

  React.useEffect(() => {
    if (renderInputs && changeRef.current) {
      formatChangeRef(changeRef, column);
    }
  }, [renderInputs]);

  //Handles onChange event on editable cells, checks for any validation errors and handles autoresizing of textarea
  const onCellChange = (val: CellChangeEvent) => {
    val = tableService.onCellValidate(val, currentRows, rowIndex, column);

    //For autoresizing of textarea
    if (val.text) {
      renderTimeout = setTimeout(() => {
        setRerender(!reresnder);
        renderTimeout = null;
      }, 1000);

      if (val.textarea && changeRef?.current?.style) {
        resizeTimeout = setTimeout(() => {
          changeRef.current.style.height = "30px";
          changeRef.current.style.height = `${changeRef.current.scrollHeight - 10}px`;
          resizeTimeout = null;
        }, 250);
      }
      cellChangeEvent(val);
    }
  };

  const checkInputTypes = () => {
    //If editable input , set the edit option for the cell and listen for cell reszises
    if (column.type === "input" || column.type === "date" || column.type === "select") {
      setRenderInputs(true);
    }
  };

  const onBlur = () => {
    let sizes;
    if (column.type === "input" && changeRef?.current) {
      sizes = { width: changeRef.current.offsetWidth, height: changeRef.current.offsetHeight };
    }
    setPrevSizes({ ...prevSizes, [column.key + "_" + cellIndex]: sizes });
    setTimeout(() => {
      setRenderInputs(false);
    }, 0);
  };

  return (
    <div
      onClick={checkInputTypes}
      onMouseEnter={() => cellIndex === 1 && formOptions.showOpenFormHandle && setShowOpenHandle(true)}
      onMouseLeave={() => cellIndex === 1 && formOptions.showOpenFormHandle && setShowOpenHandle(false)}
    >
      {showOpenHandle && (
        <div onClick={() => (formOptions ? formOptions.setShowForm(true) : setShowForm(true))} className="combo-table-open-handle">
          Open
        </div>
      )}

      {(!column.type || !renderInputs) && column.type !== "select" && (
        <Cell
          prevSizes={prevSizes}
          onClick={() => {}}
          ref={valRef}
          row={row}
          column={column}
          rowIndex={rowIndex}
          cellIndex={cellIndex}
          minLengthError={minLengthError}
          maxLengthError={maxLengthError}
          patternError={patternError}
        />
      )}
      {column.type === "date" && renderInputs && (
        <>
          <input
            onChange={(e) =>
              onCellChange({
                value: e.target.value,
                event: e,
                prevValue: row[column.key],
                row,
                rowIndex,
                cellIndex,
                cellKey: column.key,
                text: true,
                tableKey,
              })
            }
            className="combo-table-input"
            style={maxLengthError || minLengthError ? { borderBottom: "2px solid red", color: "red" } : {}}
            type={column.dateType || "date"}
            defaultValue={row[column.key]}
            ref={changeRef}
            onBlur={onBlur}
          />
        </>
      )}
      {column.type === "input" && renderInputs && (
        <>
          {/* <Textarea
            onChange={onCellChange}
            row={row}
            column={column}
            rowIndex={rowIndex}
            cellIndex={cellIndex}
            ref={changeRef}
            onBlur={onBlur}
            patternError={patternError}
            minLengthError={minLengthError}
            maxLengthError={maxLengthError}
          /> */}

          <textarea
            onChange={(e) =>
              onCellChange({
                value: e.target.value,
                event: e,
                prevValue: row[column.key],
                row,
                rowIndex,
                cellIndex,
                cellKey: column.key,
                text: true,
                tableKey,
                textarea: true,
              })
            }
            className="combo-table-textarea hide-scroll"
            defaultValue={row[column.key]}
            style={maxLengthError || minLengthError || patternError ? { borderBottom: "2px solid red", color: "red" } : {}}
            onBlur={onBlur}
            ref={changeRef}
          />
          {/* //@ts-ignore */}
          {patternError && column.subType && <ValidationBox error={textValidators[column.subType]?.error} />}
          {minLengthError && <ValidationBox error={`${column.label} must be at least ${column.minLength} characters`} />}
          {maxLengthError && <ValidationBox error={`${column.label} must be at most ${column.maxLength} characters`} />}
        </>
      )}

      {column.type === "select" && column.options && (
        <>
          <Select
            options={column.options}
            multiple={column.multiple ? true : false}
            onChange={(val: any, option: any, e: React.MouseEvent, multiple: boolean | undefined) =>
              onCellChange({
                value: val,
                option,
                event: e,
                prevValue: row[column.key],
                row,
                rowIndex,
                cellIndex,
                cellKey: column.key,
                multiple,
                tableKey,
              })
            }
            onColumnChange={(options: any[], prevOptions: any[], value: any, event: React.MouseEvent) => {
              columnChangeEvent({ type: "options", value, prevOptions, options, event, tableKey, columnKey: column.key, columnIndex: cellIndex });
            }}
            value={row[column.key]}
            columnKey={column.key}
            title={column.label}
            cellIndex={cellIndex}
          />
        </>
      )}
      {column.type === "html" && <div dangerouslySetInnerHTML={row.column.key} />}
    </div>
  );
};

export default CellContent;

const formatChangeRef = (changeRef: any, column: Column) => {
  changeRef.current.style.height = "30px";
  changeRef.current.style.height = `${changeRef.current.scrollHeight - 10}px`;
  changeRef.current.focus();
  if (column.type === "input") {
    changeRef.current.value = changeRef.current.value + " ";
  }

  if (changeRef?.current?.showPicker) changeRef.current.showPicker();
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
