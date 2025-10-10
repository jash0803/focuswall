"use client"

import { useState } from "react"
import type { Task } from "../types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { DragDropContext, Droppable, Draggable, type DropResult } from "react-beautiful-dnd"
import { Plus, Trash2, GripVertical } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface TaskListProps {
  tasks: Task[]
  onAddTask: (text: string, category: Task["category"], deadline?: string, time?: string) => void
  onRemoveTask: (id: string) => void
  onToggleTask: (id: string) => void
  onReorderTasks: (tasks: Task[]) => void
}

const categoryColors = {
  PERSONAL: "bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900 dark:text-blue-200",
  WORK: "bg-purple-100 text-purple-800 border-purple-300 dark:bg-purple-900 dark:text-purple-200",
  OTHERS: "bg-green-100 text-green-800 border-green-300 dark:bg-green-900 dark:text-green-200",
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

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleAddTask()
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
    <div className="space-y-6">
      {/* Add Task Input */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-gray-800 dark:to-gray-700 p-4 rounded-xl border-2 border-purple-200 dark:border-purple-700">
        <div className="flex flex-col md:flex-row gap-3">
          <Input
            type="text"
            value={newTaskText}
            onChange={(e) => setNewTaskText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="What needs to be done?"
            className="flex-grow border-2 focus:border-purple-500 dark:border-gray-600"
          />
          <Input
            type="time"
            value={newTaskTime}
            onChange={(e) => setNewTaskTime(e.target.value)}
            className="w-full md:w-32 border-2 dark:border-gray-600"
          />
          <Select value={newTaskCategory} onValueChange={(value: Task["category"]) => setNewTaskCategory(value)}>
            <SelectTrigger className="w-full md:w-[140px] border-2">
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
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add
          </Button>
        </div>
      </div>

      {/* Task Lists by Category */}
      <DragDropContext onDragEnd={onDragEnd}>
        {categories.map((category) => {
          const categoryTasks = tasks.filter((task) => task.category === category)
          
          if (categoryTasks.length === 0) return null

          return (
            <div
              key={category}
              className={`p-4 rounded-xl border-2 ${categoryColors[category]} bg-opacity-20`}
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-lg flex items-center">
                  {category}
                  <Badge className="ml-2" variant="secondary">
                    {categoryTasks.length}
                  </Badge>
                </h3>
              </div>
              <Droppable droppableId={category}>
                {(provided, snapshot) => (
                  <ul
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className={`space-y-2 min-h-[50px] ${snapshot.isDraggingOver ? 'bg-white/50 dark:bg-gray-700/50 rounded-lg p-2' : ''}`}
                  >
                    {categoryTasks.map((task, index) => (
                      <Draggable key={task.id} draggableId={task.id} index={index}>
                        {(provided, snapshot) => (
                          <li
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            className={`flex items-center space-x-3 bg-white dark:bg-gray-800 p-3 rounded-lg border-2 transition-all ${
                              snapshot.isDragging
                                ? 'border-purple-500 shadow-lg scale-105'
                                : 'border-gray-200 dark:border-gray-600 hover:border-purple-300 dark:hover:border-purple-500'
                            }`}
                          >
                            <div {...provided.dragHandleProps} className="cursor-grab active:cursor-grabbing">
                              <GripVertical className="w-5 h-5 text-gray-400" />
                            </div>
                            <Checkbox
                              checked={task.completed}
                              onCheckedChange={() => onToggleTask(task.id)}
                              className="border-2"
                            />
                            <div className="flex-grow">
                              <span
                                className={`text-sm md:text-base ${
                                  task.completed
                                    ? "line-through text-gray-400 dark:text-gray-500"
                                    : "text-gray-900 dark:text-white"
                                }`}
                              >
                                {task.text}
                              </span>
                              {task.time && (
                                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                  ⏰ {task.time}
                                </div>
                              )}
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => onRemoveTask(task.id)}
                              className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                            >
                              <Trash2 className="w-4 h-4" />
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
          )
        })}
      </DragDropContext>

      {tasks.length === 0 && (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          <p className="text-lg">No tasks yet. Add your first task to get started!</p>
        </div>
      )}
    </div>
  )
}
