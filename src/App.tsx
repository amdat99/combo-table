import React from "react";
import "./App.css";
import ComboTable, { Column, CellChangeEvent, Transformer, SelectionData, ColumnChangeEvent } from "./combo-table";
import requestsService from "./requests.service";

function App() {
  const [data, setData] = React.useState<any>({ photos: [], posts: [] });
  const [loading, setLoading] = React.useState(false);
  const [showForm, setShowForm] = React.useState(false);
  const [fields, setFields] = React.useState<any>({});
  const photoColumns: Column[] = [
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
      options: fields.selectFields || [],
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

  const postColumns: Column[] = [
    { key: "checkbox", label: "", type: "checkbox-select" },
    { key: "id", label: "Id" },
    { key: "userId", label: "User Id" },
    { key: "title", label: "Title", minLength: 2, maxLength: 150, type: "input" },
    { key: "body", label: "Body", minLength: 2, maxLength: 500, type: "input", columnStyle: { maxWidth: "200px" } },
  ];

  let timeout: any = null;

  React.useEffect(() => {
    fetchData();
    fetchFields();
  }, []);

  const fetchData = async () => {
    setLoading(true);

    const cb = (res: { photos: any[]; posts: any[] }) => {
      setLoading(false);
      setData(res);
    };

    requestsService.fetchData(["photos", "posts"], cb);
  };

  const fetchFields = async () => {
    const cb = (res: any) => {
      setFields(res);
    };

    requestsService.fetchData(["selectFields"], cb);
  };

  const setCell = (changeData: CellChangeEvent) => {
    if (changeData.hasError) {
      return console.log(changeData);
    }
    console.log(changeData);
    data[changeData.tableKey][changeData.rowIndex][changeData.cellKey] = changeData.value;

    timeout = setTimeout(() => {
      requestsService.setData(data[changeData.tableKey], changeData.tableKey);
      clearTimeout(timeout);
    }, 5000);
  };

  const onColumnMutation = (data: ColumnChangeEvent) => {
    if (data.type === "options" && data.tableKey === "photos") {
      photoColumns[data.columnIndex].options = data.options;
      requestsService.setData(data.options, "selectFields");
    }
  };

  return (
    <>
      <button onClick={() => requestsService.setData(data.photos, "photos")}>Save table</button>
      <div style={{ margin: "20px" }}>
        <ComboTable
          rowAction={(data) => console.log("row", data)}
          // cellAction={(data) => console.log("cellAction", data)}
          cellChangeEvent={setCell}
          columnChangeEvent={(data) => onColumnMutation(data)}
          tableData={[
            { rows: data.photos, key: "photos", columns: photoColumns, startingType: "table" },
            { rows: data.posts, key: "posts", columns: postColumns, startingType: "table" },
          ]}
          loading={loading}
          virtualizationOptions={{ enable: true, renderedRows: 100 }}
          selectionOptions={{
            rowActionSelects: true,
            cellActionSelects: false,
            getSelections: (data: SelectionData) => console.log("getSelections", data),
          }}
          maxHeight={"95vh"}
          formOptions={{ showForm: showForm, setShowForm: setShowForm, showOpenFormHandle: true, formView: "side" }}
        ></ComboTable>
      </div>
    </>
  );
}

export default App;
