import React, { useMemo } from 'react'
import PlusIcon from '../icons/PlusIcon';
import { useState } from 'react';
import { Column, Id, Task } from '../types/types';
import ColumnContainer from './ColumnContainer';
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext } from '@dnd-kit/sortable';
import { createPortal } from 'react-dom';

export default function KanbanBoard() {
  const [columns, setColumns] = useState<Column[]>([]);
  const columnsId = useMemo(() => columns.map((col) => col.id), [columns]);
  const [activeColumn, setActiveColumn] = useState<Column | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const sensors = useSensors(
    useSensor(
      PointerSensor,{
        activationConstraint: {distance: 3, //3px
       },
      }
    )
  );
  
  return (
    <section>
      <div className="m-auto flex min-h-screen w-full items-center overflow-x-auto overflow-y-hidden px-[40px]">
        <DndContext
          sensors={sensors}
          onDragStart={handleDragStart}
          onDragEnd={onDragEnd}
        >
          <div className="m-auto flex gap-4">
            <div className="flex gap-4">
              <SortableContext items={columnsId}>
                {columns.map((col) => (
                  <ColumnContainer
                    key={col.id}
                    column={col}
                    deleteColumn={deleteColumn}
                    updateColumn={updateColumn}
                    createTask={createTask}
                    tasks={tasks.filter((task) => task.columnId === col.id)}
                  />
                ))}
              </SortableContext>
            </div>
            <button
              className="h-[60px] w-[350px] min-w-[350px] cursor-pointer rounded-lg bg-mainBackgroundColor border-2 border-columnBackgroundColor p-4 ring-rose-500 hover:ring-2 flex gap-2"
              onClick={CreateNewColumn}
            >
              <PlusIcon />
              Add Column
            </button>
          </div>
          {createPortal(
            <DragOverlay>
              {activeColumn && (
                <ColumnContainer
                  column={activeColumn}
                  deleteColumn={deleteColumn}
                  updateColumn={updateColumn}
                  createTask={createTask}
                  tasks={tasks}
                />
              )}
            </DragOverlay>,
            document.body
          )}
        </DndContext>
      </div>
    </section>
  );

  function CreateNewColumn() {
    const columnToAdd: Column = {
      id : generatedId(),
      title: `Column ${columns.length + 1}`,
    };
    setColumns([...columns, columnToAdd]);
  }

  function deleteColumn(id: Id) {
    const filteredColumn = columns.filter((col) => col.id !== id);
    setColumns(filteredColumn);
  }

  function updateColumn(id: Id, title: string) {
    const newColumns = columns.map((col) => {
      if (col.id !== id) {
        return { ...col, title };
      }
      return col;
    });
    setColumns(newColumns);
  }

  function generatedId() {
    // generate random number 0-100
    return Math.floor(Math.random()*10001);
  }

  function handleDragStart(event:DragStartEvent) {
    if (event.active.data.current?.type === "Column") {
      setActiveColumn(event.active.data.current.column);
      return;
    }
  }

  function onDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over) return;

    const activeColumnId = active.id;
    const overColumnId = over.id;

    if (activeColumnId === overColumnId) return;
    setColumns(columns => {
      const activeColumnIndex = columns.findIndex(col => col.id === activeColumnId);
      const overColumnIndex = columns.findIndex(col => col.id === overColumnId);
      return arrayMove(columns, activeColumnIndex, overColumnIndex);
    })
  }

  function createTask(columnId: Id) {
    const newTask: Task = {
      id: generatedId(),
      content: `Task ${tasks.length + 1}`,
      columnId,
    };
    setTasks([...tasks, newTask]);
  }
}
