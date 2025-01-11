import { useState } from "react";
import { Task } from "../types/types";
import TrashIcon from "../icons/TrashIcon";
useState
TrashIcon

interface Props{
  task: Task;
}

function TaskCard({task}: Props) {
  const [mouseIsOver, setMouseIsOver] = useState(false);
  
  return (
    <div className="bg-mainBackgroundColor p-2.5 h-[100px] main-h-[100px] items-center flex text-left rounded-xl hover:ring-2 hover:ring-inset hover:ring-rose-500 cursor-grab relative" onMouseEnter={() => setMouseIsOver(true)} onMouseLeave={() => setMouseIsOver(false)}>
      {task.content}
      {mouseIsOver && (
        <button className="stroke-white absolute right-4 top-1/2 bg-columnBackgroundColor p-2 rounded">
          <TrashIcon />
        </button>
      )}
    </div>
  )
}
