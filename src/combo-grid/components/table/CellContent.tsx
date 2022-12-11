import React from "react";
import ValidationBox from "./ValidationBox";
import Select from "../shared/select";
import Cell from "../shared/Cell";

import tableService from "../../services/table.service";
import { textValidators } from "../../validators";
import { Column, CellChangeEvent, FormOptions, ColumnChangeEvent } from "../../index";

import "../../styles/cell.css";
import HtmlSelect from "../shared/HtmlSelect";
import HtmlDate from "../shared/HtmlDate";
import Quill from "../shared/Quill";

type Props = {
  row: any;
  column: Column;
  columns: Column[];
  rowIndex: number;
  cellIndex: number;
  currentRows: any[];
  cellChangeEvent: (data: CellChangeEvent) => void;
  columnChangeEvent: (data: ColumnChangeEvent) => void;
  setCurrentRows: (data: any) => void;
  onSetColumns: (data: any[], index: number) => void;
  handleShowForm: (row: any, index: number) => void;
  tableKey: string | number;
  formOptions?: FormOptions;
  inForm?: boolean;
  renderInputs: string | React.MouseEvent;
  setRenderInputs: React.Dispatch<React.SetStateAction<any>>;
};

const CellContent = ({
  row,
  column,
  columns,
  rowIndex,
  cellIndex,
  currentRows,
  cellChangeEvent,
  tableKey,
  handleShowForm,
  columnChangeEvent,
  setCurrentRows,
  formOptions,
  setRenderInputs,
  renderInputs,
  inForm,
}: Props) => {
  const [showOpenHandle, setShowOpenHandle] = React.useState<boolean>(false);
  const [selectEvent, setSelectEvent] = React.useState<React.MouseEvent | null>(null);
  const [errors, setErrors] = React.useState<any>({ pattern: null, minLength: null, maxLength: null, required: null });
  const changeRef = React.useRef<any>(null);
  let valRef = React.useRef<any>(null);

  React.useEffect(() => {
    if (row && column) {
      const minLengthError = row[column.key] && column.minLength && checkIfNumForLength(row[column.key], column) < column.minLength;
      const maxLengthError = row[column.key] && column.maxLength && checkIfNumForLength(row[column.key], column) > column.maxLength;
      const patternError =
        row[column.key] && column.subType && textValidators[column.subType] && !row[column.key].match(textValidators[column.subType]?.pattern);
      const requiredError = !row[column.key] && column.required;

      setErrors({ pattern: patternError, minLength: minLengthError, maxLength: maxLengthError, required: requiredError });
    }
  }, [row[column.key]]);

  React.useEffect(() => {
    if (renderInputs && changeRef.current) {
      formatChangeRef(changeRef, column);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [renderInputs]);

  //Handles onChange event on editable cells, checks for any validation errors and handles autoresizing of textarea
  const onCellChange = (val: CellChangeEvent) => {
    val = tableService.onCellValidate(val, currentRows, rowIndex, column);
    const errors = {
      pattern: val.patternError ? true : false,
      minLength: val.minLengthError ? true : false,
      maxLength: val.maxLengthError ? true : false,
      required: val?.requiredError ? true : false,
    };

    setErrors(errors);

    const rollback = (backValue: any) => {
      const value = backValue || val.prevValue;
      setCurrentRows((prev: any) => {
        prev[rowIndex][column.key] = value;
        return prev;
      });
      if (changeRef.current) changeRef.current.value = value;
    };

    console.log("val", val);

    val.rollback = rollback;
    cellChangeEvent(val);
  };

  const onBlur = () => {
    setRenderInputs("");
  };

  const handleCellChangeEvent = ({ val, e, option, multiple, textarea, text, html }: any) => {
    onCellChange({
      value: val,
      htmlValue: html ? html : null,
      option,
      event: e,
      prevValue: row[column?.key],
      row,
      rowIndex,
      cellIndex,
      cellKey: column?.key,
      multiple: multiple ? true : false,
      tableKey,
      column,
      rollback: () => {},
    });
  };

  return (
    <div
      // onClick={(e) => (column.type === "combo-select" ? console.log("dfdf", e) : checkInputTypes(e))}
      aria-label={rowIndex.toString()}
      style={{ width: "100%", height: "100%" }}
      onMouseEnter={() => cellIndex < 3 && formOptions?.showOpenFormHandle && setShowOpenHandle(true)}
      onMouseLeave={() => cellIndex < 3 && formOptions?.showOpenFormHandle && setShowOpenHandle(false)}
    >
      {showOpenHandle && (
        <div onClick={() => handleShowForm(row, rowIndex)} className="combo-grid-open-handle">
          Open
        </div>
      )}
      {column?.customType ? null : (
        <Cell
          onClick={() => {}}
          ref={valRef}
          row={row}
          column={column}
          rowIndex={rowIndex}
          inForm={inForm}
          cellIndex={cellIndex}
          visible={!column.type || (renderInputs !== column.key && (column.initCellRender || column.type !== "combo-select"))}
        />
      )}
      {column.type === "date" && renderInputs === column.key && (
        <>
          {/* <HtmlDate
            onBlur={onBlur}
            ref={changeRef}
            column={column}
            row={row}
            onCellChange={onCellChange}
            rowIndex={rowIndex}
            cellIndex={cellIndex}
            tableKey={tableKey}
            errors={errors}
          /> */}

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
                column,
                rollback: () => {},
              })
            }
            className="combo-grid-input"
            style={errors.maxLength || errors.minLength ? { borderBottom: "2px solid red", color: "red" } : {}}
            type={column.dateType || "date"}
            defaultValue={row[column?.key]}
            ref={changeRef}
            onBlur={onBlur}
          />
        </>
      )}
      {column.type === "input" && renderInputs === column.key && (
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
            onChange={(e) => {
              // handleCellChangeEvent({val})
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
                column,
                rollback: () => {},
              });
            }}
            onFocus={() => changeRef.current && (changeRef.current.style.height = changeRef.current.scrollHeight - 8 + "px")}
            onScroll={() => changeRef.current && (changeRef.current.style.height = changeRef.current.scrollHeight - 8 + "px")}
            className="combo-grid-textarea hide-scroll"
            defaultValue={row[column?.key]}
            style={errors.maxLength || errors.minLength || errors.pattern || errors.required ? { borderBottom: "2px solid red", color: "red" } : {}}
            onBlur={onBlur}
            ref={changeRef}
          />
        </>
      )}
      {column.type === "select" && renderInputs === column.key && (
        <HtmlSelect
          onBlur={onBlur}
          ref={changeRef}
          column={column}
          row={row}
          onCellChange={onCellChange}
          rowIndex={rowIndex}
          cellIndex={cellIndex}
          tableKey={tableKey}
        />
      )}
      {column.type === "combo-select" && column.options && (
        <>
          <Select
            options={column.options}
            multiple={column.multiple ? true : false}
            inForm={inForm}
            tableKey={tableKey}
            clickEvent={renderInputs.hasOwnProperty("clientX") ? renderInputs : null}
            column={column}
            onChange={(val: any, option: any, e: React.MouseEvent, multiple: boolean | undefined) => handleCellChangeEvent({ val, e, option, multiple })}
            onColumnChange={(options: any[], prevOptions: any[], value: any, event: React.MouseEvent) => {
              const newColumn = { ...column, options };
              const newColumns = [...columns];
              newColumns[cellIndex] = newColumn;
              columnChangeEvent({
                type: "options",
                value,
                prevOptions,
                options,
                event,
                tableKey,
                columnKey: column.key,
                columnIndex: cellIndex,
                newColumn,
                newColumns,
              });
            }}
            value={row[column?.key]}
            cellIndex={cellIndex}
          />
        </>
      )}
      {column.type === "quill" && renderInputs === column.key && (
        <Quill
          value={row[column?.key]}
          cellIndex={cellIndex}
          setRenderInputs={setRenderInputs}
          onChange={(val: any, html: string, e: React.MouseEvent) => {
            handleCellChangeEvent({ val, e, html });
          }}
        />
      )}
      {column.type === "html" && <div dangerouslySetInnerHTML={row.column.key} />}
      {!column.hideValidation ? (
        column.customValidator ? (
          column.customValidator(row[column.key], row)
        ) : (
          <>
            {errors.pattern && column.subType && !column.hideValidation && <ValidationBox error={textValidators[column.subType]?.error} />}
            {errors.required && !column.hideValidation && <ValidationBox error={`${column.label} is required`} />}
            {errors.minLength && !column.hideValidation && <ValidationBox error={`${column.label} must be at least ${column.minLength} characters`} />}
            {errors.maxLength && !column.hideValidation && <ValidationBox error={`${column.label} must be at most ${column.maxLength} characters`} />}
          </>
        )
      ) : null}
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
    changeRef.current.value = changeRef.current.value.slice(0, -1);
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
