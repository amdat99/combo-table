import React from "react";
import "./App.css";
import ComboTable, { Column, CellChangeEvent, Transformer, SelectionData } from "./combo-table";
import requestsService from "./requests.service";

function App() {
  const [data, setData] = React.useState<any>([]);
  const [loading, setLoading] = React.useState(false);
  const [showForm, setShowForm] = React.useState(false);
  const columns: Column[] = [
    { key: "checkbox", label: "", type: "checkbox-select" },
    {
      key: "pic",
      label: "Profile pic",
      cellTransformer: (data: Transformer) => {
        return (
          <div>
            {data.row.id < 1000 ? (
              <img alt="profile" width="22" height="22" style={{ borderRadius: "50%" }} src={`https://picsum.photos/id/${data.row.id}/200/300`} />
            ) : (
              <span>No image found</span>
            )}
          </div>
        );
      },
    },
    {
      key: "id",
      label: "Id",
      styleTransformer: (data: Transformer) => ({
        color: data.cell === 2 ? "red" : "black",
      }),
    },
    { key: "title", label: "Title", minLength: 2, maxLength: 200, type: "input", columnStyle: { maxWidth: "200px" } },
    { key: "url", label: "Url", minLength: 2, maxLength: 250, type: "input", subType: "url" },
    {
      key: "select",
      label: "select",
      columnStyle: { width: "20%" },
      type: "select",
      options: [
        { label: "Option1", value: "Option1", color: "blue" },
        { label: "Option2", value: "Option2", color: "pink" },
      ],
      multiple: true,
    },

    {
      key: "date",
      label: "Date",
      type: "date",
      columnStyle: { minWidth: "200px" },
      dateType: "date",
    },
  ];

  let timeout: any = null;

  React.useEffect(() => {
    fetchData();
    // window.addEventListener("beforeunload", () => requestsService.setTable(data, "photos"));
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const fetchCb = (res: any) => {
      setLoading(false);
      setData(res);
    };
    requestsService.fetchData("photos", fetchCb);
  };

  const setCell = (changeData: CellChangeEvent) => {
    if (changeData.hasError) {
      return console.log(changeData);
    }
    data[changeData.rowIndex][changeData.cellKey] = changeData.value;

    timeout = setTimeout(() => {
      requestsService.setTable(data, "photos");
      clearTimeout(timeout);
    }, 10000);
  };

  return (
    <>
      <button onClick={() => requestsService.setTable(data, "photos")}>Save table</button>
      <div className="App" style={{ display: "flex", justifyContent: "center", margin: "20px" }}>
        <ComboTable
          rowAction={(data) => console.log("row", data)}
          // cellAction={(data) => console.log("cellAction", data)}
          cellChangeEvent={setCell}
          rows={data}
          columns={columns}
          maxHeight="92vh"
          loading={loading}
          virtualizationOptions={{ enable: true, renderedRows: 200 }}
          selectionOptions={{
            rowActionSelects: true,
            cellActionSelects: false,
            getSelections: (data: SelectionData) => console.log("getSelections", data),
          }}
          formOptions={{ showForm: showForm, setShowForm: setShowForm, showOpenFormHandle: true, formView: "side" }}
        ></ComboTable>
      </div>
    </>
  );
}

export default App;
