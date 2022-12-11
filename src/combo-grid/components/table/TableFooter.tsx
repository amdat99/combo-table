import React from "react";
import { Column, PaginationOptions, TableData } from "../../index";

type Props = {
  columns: Column[];
  currentRows: any[];
  selectedRowLength: number;
  tableData: TableData;
  hasScrollBar?: boolean;
  paginationOptions: PaginationOptions;
  updatePage: (page: number) => void;
  wrapperRef?: React.RefObject<HTMLDivElement>;
};

function TableFooter({ columns, currentRows, selectedRowLength, tableData, paginationOptions, updatePage, hasScrollBar, wrapperRef }: Props) {
  const [paginationDetails, setPaginationDetails] = React.useState<any>([]);

  React.useEffect(() => {
    if (paginationOptions) {
      const { page, limit } = paginationOptions;
      const totalPages = Math.ceil(tableData.rows.length / limit);
      const paginationDetails = [
        { name: "First", value: 1 },
        { name: "< Previous", value: page - 1 },
        { name: "Next >", value: page + 1 },
        { name: "Last", value: totalPages },
      ];
      setPaginationDetails(paginationDetails);
    }
  }, [paginationOptions]);

  const setPagination = (page: number) => {
    updatePage(page);
  };

  return (
    <div className="combo-grid-footer">
      <div style={{ display: "flex", justifyContent: "space-between", margin: 5, fontSize: "13.5px" }}>
        <div className="combo-grid-footer-left">
          <div className="combo-grid-footer-left-content">
            <div className="combo-grid-footer-left-content-item">
              <span>
                {tableData.rows.length < 1 ? selectedRowLength : selectedRowLength} / {tableData.rows.length}
              </span>
              <span>{currentRows.length > 1 ? " selected rows " : " selected row "}</span>
            </div>
          </div>
        </div>
        <div>
          {tableData?.paginationOptions?.type && (
            <div className="combo-grid-footer-right">
              {paginationDetails &&
                paginationDetails.length > 0 &&
                paginationDetails.map((item: any, index: number) => {
                  if (paginationOptions?.page === 1 && item.name === "previous") {
                    return null;
                  } else if (paginationOptions?.page === paginationDetails[3].value && item.name === "next") {
                    return null;
                  }
                  return (
                    <>
                      <button
                        key={item.name}
                        className="combo-grid-button"
                        onClick={() => {
                          setPagination(item.value);
                        }}
                        type="button"
                      >
                        {item.name}
                      </button>
                    </>
                  );
                })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default TableFooter;
