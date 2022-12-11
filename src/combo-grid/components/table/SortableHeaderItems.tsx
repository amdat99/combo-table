import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export function SortableHeaderItem(props: any) {
  // props.id
  // JavaScript

  const { setActiveIndex, i, column } = props;

  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: column.key });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <th
      key={column.key || i}
      ref={column.ref}
      // ref={provided.innerRef}
      // {...provided.draggableProps}
      // {...provided.dragHandleProps}
      className={column.columnClass}
      style={{ ...column.columnStyle }}
    >
      {column.type === "checkbox" && <input type="checkbox" />}
      <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
        {column.label}
        {i !== 0 && (
          <div onMouseDown={() => setActiveIndex(i)} className="combo-grid-resize-handle">
            {i}
          </div>
        )}
      </div>

      {/* <input type="number" value={widths[column.key]} onChange={(e) => updateWidth(parseInt(e.target.value), column.key)} /> */}
    </th>
  );
}
