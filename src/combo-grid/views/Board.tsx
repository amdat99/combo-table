import { DndContext, rectIntersection } from "@dnd-kit/core";

// import AddCard from "./AddCard";
import { useState } from "react";
import BoardList from "../components/board/BoardList";

import "../styles/board.css";

function Board() {
  const [todoItems, setTodoItems] = useState<Array<any>>([]);
  const [doneItems, setDoneItems] = useState<Array<any>>([]);
  const [inProgressItems, setInProgressItems] = useState<Array<any>>([]);
  const [uItems, setuItems] = useState<Array<any>>([{ title: "test" }]);

  const addNewCard = (title: string) => {
    setuItems([...uItems, { title }]);
  };
  return (
    <DndContext
      collisionDetection={rectIntersection}
      onDragEnd={(e) => {
        const container = e.over?.id;
        const title = e.active.data.current?.title ?? "";
        const index = e.active.data.current?.index ?? 0;
        const parent = e.active.data.current?.parent ?? "ToDo";
        if (container === "ToDo") {
          setTodoItems([...todoItems, { title }]);
        } else if (container === "Done") {
          setDoneItems([...doneItems, { title }]);
        } else if (container === "Unassigned") {
          setuItems([...uItems, { title }]);
        } else {
          setInProgressItems([...inProgressItems, { title }]);
        }
        if (parent === "ToDo") {
          setTodoItems([...todoItems.slice(0, index), ...todoItems.slice(index + 1)]);
        } else if (parent === "Done") {
          setDoneItems([...doneItems.slice(0, index), ...doneItems.slice(index + 1)]);
        } else if (parent === "Unassigned") {
          setuItems([...uItems.slice(0, index), ...uItems.slice(index + 1)]);
        } else {
          setInProgressItems([...inProgressItems.slice(0, index), ...inProgressItems.slice(index + 1)]);
        }
      }}
    >
      <div className="combo-grid-flex-column">
        {/* <AddCard addCard={addNewCard} /> */}
        <div className="combo-grid-flex-row">
          <BoardList title="ToDo" items={todoItems} />
          <BoardList title="In Progress" items={inProgressItems} />
          <BoardList title="Done" items={doneItems} />
          <BoardList title="Unassigned" items={uItems} />
        </div>
      </div>
    </DndContext>
  );
}

export default Board;
