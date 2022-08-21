import React from "react";
import ComboTable, { Transformer, Column, CellChangeEvent } from "./combo-table";
import "./App.css";

function App() {
  const [data, setData] = React.useState<any>([]);
  const [loading, setLoading] = React.useState(false);
  const columns: Column[] = [
    {
      key: "",
      label: "Profile pic",
      cellTransformer: (data: Transformer) => {
        return (
          <div>
            <img
              loading="lazy"
              alt="profile"
              width="30"
              height="30"
              style={{ borderRadius: "50%" }}
              src={`https://picsum.photos/id/${data.row.id}/200/300`}
            />
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
    { key: "title", label: "Title", type: "input", minLength: 2, maxLength: 70 },
    { key: "url", label: "Url", type: "textarea", columnStyle: { width: "40%" }, minLength: 2, maxLength: 700 },
    {
      key: "",
      label: "select",
      type: "select",
      options: [
        { label: "option1", value: "1" },
        { label: "option2", value: "2" },
      ],
    },
    {
      key: "",
      label: "Email",
      type: "input",
      subType: "email",
    },
    {
      key: "",
      label: "Date",
      type: "input",
      subType: "date",
    },
  ];

  React.useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const response = await fetch("https://jsonplaceholder.typicode.com/photos");
    const data = await response.json();
    setData(data);
    setTimeout(() => setLoading(false), 1000);
  };

  const setCell = (changeData: CellChangeEvent) => {
    if (changeData.maxLengthError || changeData.minLengthError) {
      console.log(changeData.maxLengthError, changeData.minLengthError);
    }
    console.log(changeData);
    data[changeData.rowIndex][changeData.cellKey] = changeData.event.target.value;
  };

  return (
    <div className="App" style={{ display: "flex", justifyContent: "center", margin: "50px" }}>
      <ComboTable
        rowAction={(data) => console.log("row", data)}
        cellAction={(data) => console.log("cellAction", data)}
        cellChangeEvent={setCell}
        rows={data}
        columns={columns}
        maxHeight="90vh"
        loading={loading}
        visibleRows={70}
        virtualization={true}
      ></ComboTable>
    </div>
  );
}

export default App;
