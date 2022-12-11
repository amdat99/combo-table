import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";

const BoardCard = ({ title, index, parent }: { title: string; index: number; parent: string }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: title,
    data: {
      title,
      index,
      parent,
    },
  });
  const style = {
    transform: CSS.Translate.toString(transform),
  };
  return (
    <div
      className="combo-grid-board-card"
      style={{
        transform: style.transform,
      }}
      {...listeners}
      {...attributes}
      ref={setNodeRef}
    >
      <span>{title}</span>
    </div>
  );
};

export default BoardCard;
