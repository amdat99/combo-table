import React from "react";
import { Column, ColumnChangeEvent, TableData } from "../..";
import MenuDropdown from "../shared/menuDropdown/MenuDropdown";
import Select from "../shared/select";

type Props = {
  currentColumns: Column[];
  maxWidth: string;
  setActiveIndex: (index: number) => void;
  endRef: React.RefObject<any>;
  initColumns: (columns: Column[]) => void;
  setNewColumns: (columns: Column[]) => void;
  columnChangeEvent: (column: ColumnChangeEvent) => void;
  tableData: TableData;
};

function Header({ currentColumns, maxWidth, setActiveIndex, setNewColumns, endRef, initColumns, columnChangeEvent, tableData }: Props) {
  const [dragging, setDragging] = React.useState(false);
  const [menuData, setMenuData] = React.useState<any>({ event: null, column: null });
  const [draggedIndex, setDraggedIndex] = React.useState(-1);
  const lastDraggableIndex = React.useRef<any>(null);

  const counter = React.useRef<any>(0);

  const moveColumns = (e: any) => {
    const newColumns = [...currentColumns];
    const index = parseInt(e.target.id);
    const setIndex = parseInt(lastDraggableIndex.current);

    if (setIndex === index || isNaN(setIndex)) return;
    const target = newColumns[index];
    const prev = newColumns[setIndex];
    newColumns.splice(index, 1);
    newColumns.splice(setIndex, 0, target);

    setNewColumns(newColumns);

    columnChangeEvent({
      type: "reorder",
      tableKey: tableData.key,
      newColumns,
      columnIndex: index,
      event: e,
      columnKey: target.key,
      value: target,
      newColumn: target,
      prevColumn: prev,
      prevColumnIndex: setIndex,
      prevColumnKey: prev.key,
    });
  };

  const setRef = (i: number, ref: React.MutableRefObject<any> | undefined) => {
    if (ref) {
      currentColumns[i].ref = ref;
      counter.current++;
    }
    if (counter.current >= currentColumns.length && currentColumns[currentColumns.length - 1].ref) {
      console.log("setRef", currentColumns);
      initColumns(currentColumns);
      counter.current = 0;
    }
  };

  const onTypePropChange = (column: any, value: any) => {
    const newColumns = [...currentColumns];
    const index = newColumns.findIndex((c) => c.key === column.key);
    newColumns[index] = column;
    console.log("newColumns", newColumns);
    setNewColumns(newColumns);
  };

  return (
    <>
      <thead className="combo-grid-header" style={{ maxWidth: maxWidth || "100%", height: "30px" }}>
        <tr>
          {currentColumns.map((column, i) => (
            <HeaderContent
              column={column}
              key={i}
              i={i}
              setActiveIndex={setActiveIndex}
              setDragging={setDragging}
              dragging={dragging}
              setDraggedIndex={setDraggedIndex}
              draggedIndex={draggedIndex}
              lastDraggableIndex={lastDraggableIndex}
              setMenuData={setMenuData}
              moveColumns={moveColumns}
              setRef={setRef}
            />
          ))}
          <th
            onDragOver={(e: React.DragEvent) => {
              if (!dragging) return;
              e.preventDefault();
              //@ts-ignore
              if (draggedIndex !== e.target.offsetParent.id) setDraggedIndex(parseInt(e.target?.offsetParent?.id));
              //@ts-ignore
              if (lastDraggableIndex.current !== e.target.offsetParent.id) lastDraggableIndex.current = e.target.offsetParent.id;
            }}
            ref={endRef}
            id={(currentColumns.length - 1).toString()}
            style={{ width: "100px" }}
          >
            +
          </th>
        </tr>
      </thead>
      {menuData?.event && (
        <MenuDropdown
          topOffset={-40}
          setTarget={setMenuData}
          open={menuData?.event !== null}
          target={menuData?.event}
          hardLeftOffset={menuData?.column?.ref?.current?.offsetLeft}
          // onCloseAction={() => setTempDisableDropdownClose(false)}
        >
          <div style={{ height: "250px", margin: 5 }}>
            <div>
              <input
                autoFocus
                className="combo-grid-input "
                type="text"
                value={menuData?.column.label}
                onChange={(e) => {
                  const column: any = menuData?.column;
                  column.label = e.target.value;
                  onTypePropChange(column, e.target.value);
                }}
              />
            </div>
            <div style={{ marginTop: 5 }}>
              {/* <Select
                column={menuData?.column}
                defaultSelect
                onChange={(e: any) => {
                  console.log("e", e);
                }}
                value={menuData?.column?.type || "Text"}
                options={[
                  { label: "input", value: "input" },
                  { label: "Text", value: "Text" },
                ]}
              /> */}
              <select
                value={menuData?.column?.type || "readonly"}
                onChange={(e) => {
                  const column: any = menuData?.column;
                  column.type = e.target.value;
                  onTypePropChange(column, e.target.value);
                }}
              >
                <option value="readonly">Read-only</option>
                <option value="input">input</option>
                <option value="date">date</option>
              </select>
            </div>
          </div>
        </MenuDropdown>
      )}
    </>
  );
}

export default Header;

const HeaderContent = ({
  column,
  dragging,
  draggedIndex,
  setDragging,
  moveColumns,
  setActiveIndex,
  i,
  setDraggedIndex,
  lastDraggableIndex,
  setRef,
  setMenuData,
}: any) => {
  const currentRef = React.useRef<any>(null);

  React.useEffect(() => {
    setTimeout(() => {
      console.log("setRef", i, currentRef);
      setRef(i, currentRef);
    }, 0);
  }, [column]);

  return (
    <th
      key={column.key || i}
      ref={column?.ref || currentRef}
      className={column.columnClass}
      style={{ background: dragging && draggedIndex == i ? "var(--combo-grid-background-hover)" : "transparent" }}
      id={i.toString()}
      onDragOver={(e) => {
        if (!dragging) return;
        e.preventDefault();
        //@ts-ignore
        if (draggedIndex !== e.target.offsetParent.id) setDraggedIndex(parseInt(e.target?.offsetParent?.id));
        //@ts-ignore
        if (lastDraggableIndex.current !== e.target.offsetParent.id) lastDraggableIndex.current = e.target.offsetParent.id;
      }}
    >
      {column.type === "checkbox" && <input type="checkbox" />}
      <div style={{ display: "flex", justifyContent: "space-between", cursor: "auto" }}>
        <div style={{ width: "100%", cursor: "pointer" }} onClick={(e) => setMenuData({ event: e, column })}>
          <span
            draggable={!column?.noReorderable ? true : false}
            onDragStart={() => setDragging(true)}
            // @ts-ignore   Using jaavscript == operator
            // eslint-disable-next-line eqeqeq
            style={{
              cursor: !column.noReorderable ? "grabbing" : "default",
              opacity: dragging && draggedIndex == i ? 0.5 : 1,
            }}
            id={i.toString()}
            onDragEnd={(e) => {
              moveColumns(e);
              setDragging(false);
            }}
          >
            {column.label}
          </span>
        </div>
        {i !== 0 && (
          <div onClick={(e) => e.stopPropagation()} onMouseDown={() => setActiveIndex(i)} className="combo-grid-resize-handle">
            {i}
          </div>
        )}
      </div>

      {/* <input type="number" value={widths[column.key]} onChange={(e) => updateWidth(parseInt(e.target.value), column.key)} /> */}
    </th>
  );
};
