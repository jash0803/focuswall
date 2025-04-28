"use client"
import type { Task, UserPreferences } from "../types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"

interface ProfilePageProps {
  tasks: Task[]
  userPreferences: UserPreferences
  onUpdateUserPreferences: (preferences: Partial<UserPreferences>) => void
}

export function ProfilePage({ tasks, userPreferences, onUpdateUserPreferences }: ProfilePageProps) {
  const completedTasks = tasks.filter((task) => task.completed)
  const pendingTasks = tasks.filter((task) => !task.completed)

  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - i)
    return d.toISOString().split("T")[0]
  }).reverse()

  const chartData = last7Days.map((date) => ({
    date,
    completed: completedTasks.filter((task) => task.deadline === date).length,
  }))

  const handleFeedback = () => {
    // Implement feedback logic here
    console.log("Feedback clicked")
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-black dark:text-white">Profile</h2>
        <div className="space-x-4">
          <Button onClick={handleFeedback}>Feedback</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Task Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Pending Tasks: {pendingTasks.length}</p>
            <p>Completed Tasks: {completedTasks.length}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tasks Completed (Last 7 Days)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <XAxis dataKey="date" />
                <YAxis />
                <Bar dataKey="completed" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>User Preferences</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span>Date Format:</span>
              <Select
                value={userPreferences.dateFormat}
                onValueChange={(value) => onUpdateUserPreferences({ dateFormat: value })}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select date format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                  <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                  <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between">
              <span>Time Format:</span>
              <Select
                value={userPreferences.timeFormat}
                onValueChange={(value) => onUpdateUserPreferences({ timeFormat: value })}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select time format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="12">12-hour</SelectItem>
                  <SelectItem value="24">24-hour</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between">
              <span>Language:</span>
              <Select
                value={userPreferences.language}
                onValueChange={(value) => onUpdateUserPreferences({ language: value })}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="es">Español</SelectItem>
                  <SelectItem value="fr">Français</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
