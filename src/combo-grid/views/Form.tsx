import React from "react";
import CellContent from "../components/table/CellContent";

import { CellChangeEvent, Column } from "..";

import "../styles/form.css";

const Form = ({ formRef, columns, formData, cellChangeEvent, columnChangeEvent }: any) => {
  const [formTitle, setFormTitle] = React.useState<any>(null);
  const [hasError, setHasError] = React.useState(false);
  const [renderInputs, setRenderInputs] = React.useState("");
  const { formOptions } = formData;

  React.useEffect(() => {
    if (columns && columns.length > 0) {
      for (let i = 0; i < columns.length; i++) {
        if (columns[i].isFormTitle === true) {
          const titleColumn = { ...columns[i] };
          titleColumn.index = i;
          titleColumn.styleTransformer = () => {
            return { fontSize: "1.5rem", fontWeight: "bold" };
          };

          setFormTitle(titleColumn);
          break;
        }
      }
    }
  }, []);

  const formEvent = () => {
    return {
      formData,
      columns,
      columnChangeEvent,
      cellChangeEvent,
    };
  };

  const handleShowForm = () => {};

  const onCellChange = (event: CellChangeEvent) => {
    if (event.hasError) {
      setHasError(true);
    } else if (hasError) {
      setHasError(false);
    }
    cellChangeEvent(event);
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formOptions?.submitAction) {
      return;
    } else if (hasError) {
      return;
    }
    formOptions?.submitAction(formEvent());
  };

  if (formOptions?.customFormComponent) {
    return formOptions?.customFormComponent(formEvent());
  }

  const checkInputTypes = (column: Column) => {
    //If editable input , set the edit option for the cell and listen for cell reszises
    if (column.type !== "combo-select") {
      setRenderInputs(column.key);
    }
  };
  return (
    <div ref={formRef} className="combo-grid-form-wrapper-side">
      <form onSubmit={(e) => onSubmit(e)}>
        {formOptions?.topFormContent && formOptions.topFormContent(formEvent())}
        <div style={{ margin: "6%" }} onClick={() => setRenderInputs(formTitle)}>
          {formTitle && (
            <CellContent
              row={formData.row}
              column={formTitle}
              rowIndex={formData.index}
              cellIndex={formTitle.index}
              onSetColumns={() => {}}
              setCurrentRows={() => {}}
              currentRows={formData.currentRows}
              cellChangeEvent={cellChangeEvent}
              columnChangeEvent={columnChangeEvent}
              handleShowForm={handleShowForm}
              tableKey={formData.key}
              formOptions={formOptions}
              columns={columns}
              renderInputs={renderInputs}
              setRenderInputs={setRenderInputs}
              inForm={true}
            />
          )}
          {columns &&
            columns.map((column: any, index: number) => {
              return (
                <div>
                  {column?.label && column?.label !== formTitle?.label && (
                    <div className="combo-grid-flex-column">
                      <div className="combo-grid-flex-row" style={{ marginTop: "15px" }}>
                        <div style={{ minWidth: "12%" }}>{column.label}:</div>
                        {/* <div style={{ marginLeft: "80px" }}>{formData.row[column.key]}</div> */}
                        <div style={{ width: "80%" }} onClick={() => setRenderInputs(column)}>
                          <CellContent
                            row={formData.row}
                            column={column}
                            rowIndex={formData.index}
                            cellIndex={index}
                            onSetColumns={() => {}}
                            currentRows={formData.currentRows}
                            cellChangeEvent={onCellChange}
                            columnChangeEvent={columnChangeEvent}
                            handleShowForm={handleShowForm}
                            tableKey={formData.key}
                            formOptions={formOptions}
                            setCurrentRows={() => {}}
                            columns={columns}
                            renderInputs={renderInputs}
                            setRenderInputs={setRenderInputs}
                            inForm={true}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
        </div>
        {/* <hr className="text-color" /> */}
        {formOptions?.bottomFormContent && formData?.formOptions.bottomFormContent(formEvent())}
        {(formOptions?.showButton || formOptions?.customButton) && (
          <div style={{ position: "absolute", bottom: "2%", margin: "6%" }}>
            {formOptions?.customButton ? formOptions.customButton(formEvent()) : <button type="submit">Submit</button>}
          </div>
        )}
      </form>
    </div>
  );
};

export default Form;
