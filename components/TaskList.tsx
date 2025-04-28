"use client"

import { useState } from "react"
import type { Task } from "../types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { DragDropContext, Droppable, Draggable, type DropResult } from "react-beautiful-dnd"

interface TaskListProps {
  tasks: Task[]
  onAddTask: (text: string, category: Task["category"], deadline?: string, time?: string) => void
  onRemoveTask: (id: string) => void
  onToggleTask: (id: string) => void
  onReorderTasks: (tasks: Task[]) => void
}

export function TaskList({ tasks, onAddTask, onRemoveTask, onToggleTask, onReorderTasks }: TaskListProps) {
  const [newTaskText, setNewTaskText] = useState("")
  const [newTaskCategory, setNewTaskCategory] = useState<Task["category"]>("PERSONAL")
  const [newTaskTime, setNewTaskTime] = useState("")

  const handleAddTask = () => {
    if (newTaskText.trim()) {
      const today = new Date().toISOString().split("T")[0]
      onAddTask(newTaskText.trim(), newTaskCategory, today, newTaskTime)
      setNewTaskText("")
      setNewTaskTime("")
    }
  }

  const categories: Task["category"][] = ["PERSONAL", "WORK", "OTHERS"]

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) {
      return
    }

    const items = Array.from(tasks)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    onReorderTasks(items)
  }

  return (
    <div className="space-y-4 bg-white dark:bg-gray-800 p-4 rounded-xl border-4 border-black">
      <div className="flex space-x-2">
        <Input
          type="text"
          value={newTaskText}
          onChange={(e) => setNewTaskText(e.target.value)}
          placeholder="Add a new task"
          className="flex-grow border-4 border-black dark:border-white dark:text-white dark:placeholder-gray-400"
        />
        <Input
          type="time"
          value={newTaskTime}
          onChange={(e) => setNewTaskTime(e.target.value)}
          className="w-32 border-4 border-black dark:border-white dark:text-white"
        />
        <Select value={newTaskCategory} onValueChange={(value: Task["category"]) => setNewTaskCategory(value)}>
          <SelectTrigger className="w-[120px] border-4 border-black">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button
          onClick={handleAddTask}
          className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold border-4 border-black dark:border-white dark:text-white dark:hover:text-black"
        >
          Add Task
        </Button>
      </div>
      <DragDropContext onDragEnd={onDragEnd}>
        {categories.map((category) => (
          <div key={category} className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg border-4 border-black">
            <h3 className="font-bold mb-2 text-black dark:text-white">{category}</h3>
            <Droppable droppableId={category}>
              {(provided) => (
                <ul {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
                  {tasks
                    .filter((task) => task.category === category)
                    .map((task, index) => (
                      <Draggable key={task.id} draggableId={task.id} index={index}>
                        {(provided) => (
                          <li
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="flex items-center space-x-2 bg-white dark:bg-gray-600 p-2 rounded border-2 border-black dark:border-white"
                          >
                            <Checkbox
                              checked={task.completed}
                              onCheckedChange={() => onToggleTask(task.id)}
                              className="border-2 border-black dark:border-white"
                            />
                            <span
                              className={`flex-grow text-black dark:text-white ${task.completed ? "line-through" : ""}`}
                            >
                              {task.text}
                            </span>
                            {task.deadline && (
                              <span className="text-sm text-gray-600 dark:text-gray-300">
                                {task.deadline} {task.time}
                              </span>
                            )}
                            <Button
                              variant="ghost"
                              onClick={() => onRemoveTask(task.id)}
                              className="text-red-500 hover:text-red-600 border-2 border-black dark:border-white dark:text-red-400 dark:hover:text-red-300"
                            >
                              Remove
                            </Button>
                          </li>
                        )}
                      </Draggable>
                    ))}
                  {provided.placeholder}
                </ul>
              )}
            </Droppable>
          </div>
        ))}
      </DragDropContext>
    </div>
  )
}
