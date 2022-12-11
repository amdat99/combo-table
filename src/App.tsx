import React from "react";

import "./App.css";
import ComboGrid, { Column, CellChangeEvent, Transformer, SelectionData, ColumnChangeEvent, PaginationOptions, TableData } from "./combo-grid";
import requestsService from "./requests.service";

function App() {
  const [data, setData] = React.useState<any>({ photos: [], posts: [] });
  const dataRef = React.useRef<any>({ photos: [], posts: [] });
  const [paginationOptions, setPaginationOptions] = React.useState<{ posts: PaginationOptions }>({
    posts: { page: 1, limit: 25, type: "paging" },
  });

  const [loading, setLoading] = React.useState(false);
  const [showForm, setShowForm] = React.useState({ photos: false, posts: false });
  const [fields, setFields] = React.useState<any>({});

  const photoColumns: Column[] = [
    { key: "checkbox", label: "", type: "checkbox-select", maxWidth: 40, noReorderable: true },
    {
      key: "pic",
      label: "Profile pic",
      cellTransformer: (data: Transformer) => {
        return (
          <div>
            {data.row.id < 1000 ? (
              <img
                alt="profile"
                width={data?.inForm ? "50" : "22"}
                height={data?.inForm ? "50" : "22"}
                loading="lazy"
                style={{ borderRadius: "50%", marginLeft: data.inForm ? "0" : "10px" }}
                src={`https://picsum.photos/id/${data.row.id}/200/300`}
              />
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
      width: "20px",
      ctxMenuOptions: ["copy"],
      styleTransformer: (data: Transformer) => ({
        color: data.cell === 2 ? "red" : "black",
      }),
    },
    { key: "index", label: "Index", cellTransformer: (data: Transformer) => data.rowIndex },
    { key: "title", label: "Title", required: true, maxLength: 200, type: "input", ctxMenuOptions: ["copy"], isFormTitle: true, width: "300px" },
    { key: "url", label: "Url", minLength: 2, maxLength: 250, type: "quill" },
    {
      key: "select",
      label: "select",
      type: "combo-select",
      options: fields.selectFields || [],
      multiple: true,
    },

    {
      key: "date",
      label: "Date",
      type: "date",
      textTransformer: (data: Transformer) => new Date(data.cell).toLocaleDateString(),
      dateType: "date",
    },
  ];

  const postColumns: Column[] = [
    { key: "checkbox", label: "", type: "checkbox-select" },
    { key: "id", label: "Id" },
    { key: "userId", label: "User Id" },
    { key: "title", label: "Title", minLength: 2, width: "120px", maxLength: 150, type: "input" },
    { key: "body", label: "Body", width: "500px", minLength: 2, type: "input" },
  ];

  React.useEffect(() => {
    fetchData();
    fetchFields();
    window.addEventListener("click", (event) => {
      console.log("click", dataRef.current.photos[0]);
      requestsService.setData(dataRef.current.photos, "photos");
    });
  }, []);

  const fetchData = async () => {
    setLoading(true);

    const cb = (res: { photos: any[]; posts: any[] }) => {
      setLoading(false);
      setData(res);
      dataRef.current = res;
    };
    requestsService.fetchData(["photos", "posts"], cb);
  };

  const fetchFields = async () => {
    requestsService.fetchData(["selectFields"], (res: any) => setFields(res));
  };

  const setCell = (changeData: CellChangeEvent) => {
    console.log(changeData);
    const { tableKey, rowIndex, cellKey, hasError } = changeData;

    if (hasError) {
      return console.log("error", changeData);
    } else {
      console.log("success", changeData.value);
    }
    dataRef.current[tableKey][rowIndex][cellKey] = changeData.htmlValue || changeData.value;
  };

  const onColumnMutation = (data: ColumnChangeEvent) => {
    console.log("onColumnMutation", data);
    if (data.type === "options" && data.tableKey === "photos") {
      photoColumns[data.columnIndex].options = data.options;
      requestsService.setData(data.options, "selectFields");
    }
  };

  return (
    <>
      <div style={{ margin: "20px" }}>
        <ComboGrid
          // renderOptions={{ firstRenderedTableKey: "photos" }}
          rowAction={(data) => console.log("row", data)}
          paginationAction={(data) => console.log("pagination", data)}
          // cellAction={(data) => console.log("cellAction", data)}
          cellChangeEvent={(data) => setCell(data)}
          rowReorderEvent={(data) => {
            console.log("rowReorderEvent", data);
            requestsService.setData(data.newRows, data.tableKey);
          }}
          columnChangeEvent={(data) => onColumnMutation(data)}
          defaultTableData={{
            virtualizationOptions: { renderedRows: window.innerHeight / 30 },
            virtualScroll: true,
            formOptions: {
              toggleFormAction: (data: TableData) => setShowForm({ ...showForm, [data.key]: [!data.key] }),
              showOpenFormHandle: true,
              formView: "side",
            },
          }}
          tableData={[
            {
              rows: data.photos,
              key: "photos",
              columns: photoColumns,
              startingType: "table",
              title: "Photos",
              showTableForm: showForm?.photos,
              // paginationOptions: paginationOptions.photos,

              styleOptions: { saveColumnWidthsToLS: true },
            },
            {
              rows: data.posts,
              key: "posts",
              columns: postColumns,
              startingType: "table",
              title: "Posts",
              paginationOptions: paginationOptions.posts,
              virtualScroll: false,
              showTableForm: showForm?.posts,
            },
            {
              rows: Array(100000).fill({
                id: 2,
                title: "title",
                select: "YES",
                text: "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus. Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae. Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat.",
              }),
              columns: [
                { key: "index", label: "index", cellTransformer: (data: { rowIndex: any }) => data.rowIndex },
                { key: "id", label: "Id", width: "40px" },
                { key: "title", label: "Title", type: "input" },
                {
                  key: "select",
                  label: "Select",
                  type: "select",
                  width: "100px",
                  options: [
                    { label: "Select", value: "Select" },
                    { label: "YES", value: "YES" },
                    { label: "NO", value: "NO" },
                  ],
                },
                { key: "text", label: "Text", type: "input", width: "70vw" },
              ],
              virtualizationOptions: { renderedRows: 20 },
              title: "100,000 of Lorem Ipsum",
              key: "100,000 of Lorem Ipsum",
            },
          ]}
          loading={loading}
          selectionOptions={{
            rowActionSelects: true,
            cellActionSelects: false,
            getSelections: (data: SelectionData) => console.log("getSelections", data),
          }}
          maxHeight="90vh"
        ></ComboGrid>
        {/* <button onClick={() => requestsService.setData(data.photos, "photos")}>Save table</button> */}
      </div>
    </>
  );
}

export default App;
