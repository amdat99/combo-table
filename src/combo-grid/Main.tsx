import React, { useState, useEffect } from "react";

import Views from "./views";
import Form from "./views/Form";
import Dropdown from "./components/shared/select/Dropdown";
import Toolbar from "./components/shared/toolbar";

import useOnClickOutside from "./hooks/useOnClickOutside";
import tableService from "./services/table.service";
import { BaseProps } from ".";
import ViewOptions from "./views/ViewOptions";

export const DropDownContext = React.createContext<any>(null);
export const FormContext = React.createContext<any>(null);

const TableRoot = (props: BaseProps) => {
  const [optionsMap, setOptionsMap] = useState<any>({});
  const [typeMap, setTypeMap] = useState<any>({});
  const [renderedTables, setRenderedTables] = useState<any>({});
  const [tableKeys, setTableKeys] = useState<any[]>([]);
  const [showViewOptions, setShowViewOptions] = useState(false);
  const [dropdownData, setDropdownData] = useState<any>({});
  const [tempDisableDropdownClose, setTempDisableDropdownClose] = useState(false);
  const [curIndex, setCurIndex] = useState(0);
  const [currentTableKey, setCurrentTableKey] = useState("");
  const [formData, setFormData] = useState<any>({});

  const dropdownValue = React.useMemo(() => ({ dropdownData, setDropdownData, optionsMap }), [dropdownData, optionsMap]);
  const formValue = React.useMemo(() => ({ formData, setFormData }), [formData]);

  const formRef = React.useRef(null);
  const selectRef = React.useRef<HTMLDivElement>(null);
  //Hook to detect click outside of the sleect dropdown
  const { loading, customLoaderComponent, tableData, renderOptions } = props;

  useOnClickOutside(selectRef, () => setDropdownData({}), tempDisableDropdownClose);
  const showFormFlag = tableData[curIndex]?.showTableForm ? true : false;

  //Hook to detect click outside of the form component
  useOnClickOutside(formRef, () => (tableData[curIndex]?.formOptions ? tableData[curIndex]?.formOptions?.toggleFormAction(tableData[curIndex]) : null));
  //Hook to detect click outside of the table component

  //If column is select converts the options array into an object with the value as the key and hte column label as
  useEffect(() => {
    const data = tableService.formatTableData(tableData, optionsMap, renderOptions?.firstRenderedTableKey);

    if (data.startingTable && data.startingTable?.key) {
      setCurrentTableKey(data.startingTable.key);
      setRenderedTables({ ...renderedTables, [data.startingTable.key]: true });
      const index = tableData.findIndex((table) => table.key === data.startingTable.key);

      setCurIndex(index);
    } else {
      setCurrentTableKey(tableData[0].key);
      setRenderedTables({ ...renderedTables, [tableData[0].key]: true });
    }
    setTypeMap(data.types);
    setTableKeys(data.tableKeys);
  }, [tableData]);

  const showNewTable = (data: { i: number; key: string }) => {
    setTimeout(
      () => {
        setCurIndex(data.i);
        setCurrentTableKey(data.key);
      },
      renderedTables.hasOwnProperty(data.key) ? 0 : 150
    );

    const curRenderedtables = renderedTables;
    curRenderedtables[data.key] = true;
    setRenderedTables(curRenderedtables);
  };

  return (
    <>
      {dropdownData?.options && (
        <Dropdown
          dropdownData={dropdownData}
          optionsMap={optionsMap}
          selectRef={selectRef}
          tableKey={currentTableKey}
          setOptionsMap={setOptionsMap}
          setTempDisableDropdownClose={setTempDisableDropdownClose}
        />
      )}
      <DropDownContext.Provider value={dropdownValue}>
        <FormContext.Provider value={formValue}>
          {showFormFlag && currentTableKey === formData?.key && (
            <Form
              formRef={formRef}
              formData={formData}
              columns={tableData[formData.tableIndex].columns}
              cellChangeEvent={props.cellChangeEvent}
              columnChangeEvent={props.columnChangeEvent}
            />
          )}
          {props.customToolbarComponent ? (
            props.customToolbarComponent({ tableKeys, setCurrentTableKey, currentTableKey, tableData, extraProps: props.extraProps })
          ) : (
            <Toolbar
              setShowViewOptions={setShowViewOptions}
              showNewTable={showNewTable}
              tableKeys={tableKeys}
              currentTableKey={currentTableKey}
              tableData={tableData}
            />
          )}
          {loading && (customLoaderComponent || <span className="combo-grid-loader"></span>)}
          {tableData.map((table, i) => {
            if (
              (!renderedTables.hasOwnProperty(table.key) && renderOptions?.altRenderMethod !== "render-all") ||
              (renderOptions?.altRenderMethod === "render-only-inview" && table.key !== currentTableKey)
            )
              return null;
            return (
              <Views
                showViewOptions={showViewOptions}
                setTypeMap={setTypeMap}
                currentTableKey={currentTableKey}
                currentType={typeMap[table.key]}
                i={i}
                setShowForm={() => {}}
                table={table}
                {...props}
              />
            );
          })}
        </FormContext.Provider>
      </DropDownContext.Provider>
    </>
  );
};

export default TableRoot;
