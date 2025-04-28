"use client"

import { useState, useCallback } from "react"
import type { Task } from "../types"

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([])

  const addTask = useCallback((text: string, category: Task["category"], deadline?: string, time?: string) => {
    setTasks((prevTasks) => [
      ...prevTasks,
      { id: Date.now().toString(), text, category, deadline, time, completed: false },
    ])
  }, [])

  const removeTask = useCallback((id: string) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id))
  }, [])

  const toggleTask = useCallback((id: string) => {
    setTasks((prevTasks) => prevTasks.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task)))
  }, [])

  const updateTask = useCallback((id: string, updates: Partial<Omit<Task, "id">>) => {
    setTasks((prevTasks) => prevTasks.map((task) => (task.id === id ? { ...task, ...updates } : task)))
  }, [])

  return { tasks, setTasks, addTask, removeTask, toggleTask, updateTask }
}
