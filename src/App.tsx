import React from "react";
import "./App.css";
import ComboTable, { Column, CellChangeEvent, Transformer, SelectionData } from "./combo-table";
import requestsService from "./requests.service";

function App() {
  const [data, setData] = React.useState<any>([]);
  const [loading, setLoading] = React.useState(false);
  const columns: Column[] = [
    { key: "checkbox", label: "", type: "checkbox" },
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
    { key: "title", label: "Title", minLength: 2, maxLength: 700, type: "input", columnStyle: { maxWidth: "200px" } },
    { key: "url", label: "Url", minLength: 2, maxLength: 250, type: "input", subType: "url" },
    {
      key: "key",
      label: "select",
      columnStyle: { width: "20%" },
      type: "select",
      options: [
        { label: "Option1", value: "Option1", color: "green" },
        { label: "Option2", value: "Option2", color: "red" },
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

  React.useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const fetchCb = (res: any) => {
      setLoading(false);
      setData(res);
    };
    requestsService.fetchData("https://jsonplaceholder.typicode.com/photos", fetchCb);
  };

  const setCell = (changeData: CellChangeEvent) => {
    console.log(changeData);
    if (changeData.hasError) {
      return console.log(changeData);
    }
    data[changeData.rowIndex][changeData.cellKey] = changeData.value;
  };

  return (
    <div className="App" style={{ display: "flex", justifyContent: "center", margin: "50px" }}>
      <ComboTable
        // rowAction={(data) => console.log("row", data)}
        // cellAction={(data) => console.log("cellAction", data)}
        cellChangeEvent={setCell}
        rows={data}
        columns={columns}
        maxHeight="95vh"
        loading={loading}
        virtualizationOptions={{ enable: true, renderedRows: 90 }}
        selectionOptions={{
          rowActionSelects: false,
          cellActionSelects: false,
          getSelections: (data: SelectionData) => console.log("getSelections", data),
        }}
        formOptions={{ showForm: true, showOpenFormHandle: true, formView: "side" }}
      ></ComboTable>
    </div>
  );
}

export default App;
