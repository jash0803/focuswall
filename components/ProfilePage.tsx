"use client"
import type { Task, UserPreferences } from "../types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { CheckCircle2, Clock, TrendingUp, Settings, MessageSquare } from "lucide-react"

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

  const chartData = last7Days.map((date) => {
    const dateObj = new Date(date)
    const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'short' })
    return {
      date: dayName,
      completed: completedTasks.filter((task) => task.deadline === date).length,
      pending: pendingTasks.filter((task) => task.deadline === date).length,
    }
  })

  const handleFeedback = () => {
    window.open('https://github.com', '_blank')
  }

  const completionRate = tasks.length > 0 
    ? Math.round((completedTasks.length / tasks.length) * 100) 
    : 0

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Your Profile
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Track your productivity and customize your preferences
          </p>
        </div>
        <Button 
          onClick={handleFeedback}
          variant="outline"
          className="border-2 hover:bg-purple-50 dark:hover:bg-purple-900/20"
        >
          <MessageSquare className="w-4 h-4 mr-2" />
          Send Feedback
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-2 border-green-200 dark:border-green-700 shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-lg">
              <CheckCircle2 className="w-5 h-5 mr-2 text-green-500" />
              Completed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-green-600 dark:text-green-400">{completedTasks.length}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Tasks done</p>
          </CardContent>
        </Card>

        <Card className="border-2 border-orange-200 dark:border-orange-700 shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-lg">
              <Clock className="w-5 h-5 mr-2 text-orange-500" />
              Pending
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-orange-600 dark:text-orange-400">{pendingTasks.length}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Tasks remaining</p>
          </CardContent>
        </Card>

        <Card className="border-2 border-purple-200 dark:border-purple-700 shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-lg">
              <TrendingUp className="w-5 h-5 mr-2 text-purple-500" />
              Completion Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-purple-600 dark:text-purple-400">{completionRate}%</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Overall progress</p>
          </CardContent>
        </Card>
      </div>

      {/* Chart */}
      <Card className="border-2 border-blue-200 dark:border-blue-700 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-t-lg">
          <CardTitle>📊 7-Day Activity</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          {tasks.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="date" 
                  stroke="#6b7280"
                  style={{ fontSize: '12px' }}
                />
                <YAxis 
                  stroke="#6b7280"
                  style={{ fontSize: '12px' }}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                  }}
                />
                <Bar dataKey="completed" fill="#10b981" radius={[8, 8, 0, 0]} />
                <Bar dataKey="pending" fill="#f59e0b" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-gray-500 dark:text-gray-400">
              <p>No task data available yet. Start adding tasks to see your progress!</p>
            </div>
          )}
          <div className="flex justify-center gap-6 mt-4">
            <div className="flex items-center">
              <div className="w-4 h-4 bg-green-500 rounded mr-2"></div>
              <span className="text-sm text-gray-600 dark:text-gray-400">Completed</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-orange-500 rounded mr-2"></div>
              <span className="text-sm text-gray-600 dark:text-gray-400">Pending</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Preferences */}
      <Card className="border-2 border-indigo-200 dark:border-indigo-700 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-t-lg">
          <CardTitle className="flex items-center">
            <Settings className="w-5 h-5 mr-2" />
            Preferences
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="dateFormat" className="text-sm font-medium">
                📅 Date Format
              </Label>
              <Select
                value={userPreferences.dateFormat}
                onValueChange={(value) => onUpdateUserPreferences({ dateFormat: value })}
              >
                <SelectTrigger id="dateFormat" className="border-2">
                  <SelectValue placeholder="Select date format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                  <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                  <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="timeFormat" className="text-sm font-medium">
                🕐 Time Format
              </Label>
              <Select
                value={userPreferences.timeFormat}
                onValueChange={(value) => onUpdateUserPreferences({ timeFormat: value })}
              >
                <SelectTrigger id="timeFormat" className="border-2">
                  <SelectValue placeholder="Select time format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="12">12-hour</SelectItem>
                  <SelectItem value="24">24-hour</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="language" className="text-sm font-medium">
                🌍 Language
              </Label>
              <Select
                value={userPreferences.language}
                onValueChange={(value) => onUpdateUserPreferences({ language: value })}
              >
                <SelectTrigger id="language" className="border-2">
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="es">Español</SelectItem>
                  <SelectItem value="fr">Français</SelectItem>
                  <SelectItem value="de">Deutsch</SelectItem>
                  <SelectItem value="ja">日本語</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
