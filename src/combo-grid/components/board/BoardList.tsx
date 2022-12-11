import BoardCard from "./BoardCard";
import { useDroppable } from "@dnd-kit/core";

type Props = {
  title: string;
  items: any[];
};

export default function KanbanLane({ title, items }: Props) {
  const { setNodeRef } = useDroppable({
    id: title,
  });
  return (
    <div className="combo-grid-board-list">
      <span className="combo-grid-list-title">{title}</span>
      <div ref={setNodeRef} className="combo-grid-flex-column">
        {items.map(({ title: cardTitle }, key) => (
          <BoardCard title={cardTitle} key={key} index={key} parent={title} />
        ))}
      </div>
    </div>
  );
}
