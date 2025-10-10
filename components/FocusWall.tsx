"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import { useTasks } from "../hooks/useTasks"
import { TaskList } from "./TaskList"
import { WallpaperCustomizer } from "./WallpaperCustomizer"
import { WallpaperPreview } from "./WallpaperPreview"
import type { WallpaperSettings, Task, UserPreferences, CountdownEvent } from "../types"
import { Button } from "@/components/ui/button"
import { DragDropContext } from "react-beautiful-dnd"
import { NotesWidget } from "./NotesWidget"
import { ProfilePage } from "./ProfilePage"
import { WidgetVisibility } from "./WidgetVisibility"
import { CountdownEvents } from "./CountdownEvents"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Download, Moon, Sun, User, Loader2, Layout, Settings, Calendar as CalendarIcon, FileText } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function FocusWall() {
  const { tasks, addTask, removeTask, toggleTask, setTasks } = useTasks()
  const [wallpaperSettings, setWallpaperSettings] = useState<WallpaperSettings>({
    backgroundType: "gradient",
    backgroundImage: "https://images.unsplash.com/photo-1557683316-973673baf926",
    theme: "light",
    widgetTransparency: 20,
    showCalendar: true,
    showWeather: true,
    showNotes: true,
    showTasks: true,
    showQuote: true,
    showCountdown: true,
  })
  const [userPreferences, setUserPreferences] = useState<UserPreferences>({
    dateFormat: "MM/DD/YYYY",
    timeFormat: "12",
    language: "en",
  })
  const [notes, setNotes] = useState("")
  const [showProfile, setShowProfile] = useState(false)
  const [countdownEvents, setCountdownEvents] = useState<CountdownEvent[]>([])
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDownloading, setIsDownloading] = useState(false)
  const [activeTab, setActiveTab] = useState("tasks")

  useEffect(() => {
    // Load saved data from localStorage
    const savedTasks = localStorage.getItem("focuswall-tasks")
    const savedNotes = localStorage.getItem("focuswall-notes")
    const savedSettings = localStorage.getItem("focuswall-settings")
    const savedEvents = localStorage.getItem("focuswall-events")

    if (savedTasks) setTasks(JSON.parse(savedTasks))
    if (savedNotes) setNotes(savedNotes)
    if (savedSettings) setWallpaperSettings(JSON.parse(savedSettings))
    if (savedEvents) setCountdownEvents(JSON.parse(savedEvents))
  }, [setTasks])

  useEffect(() => {
    // Save data to localStorage
    localStorage.setItem("focuswall-tasks", JSON.stringify(tasks))
  }, [tasks])

  useEffect(() => {
    localStorage.setItem("focuswall-notes", notes)
  }, [notes])

  useEffect(() => {
    localStorage.setItem("focuswall-settings", JSON.stringify(wallpaperSettings))
  }, [wallpaperSettings])

  useEffect(() => {
    localStorage.setItem("focuswall-events", JSON.stringify(countdownEvents))
  }, [countdownEvents])

  const updateWallpaperSettings = useCallback((updates: Partial<WallpaperSettings>) => {
    setWallpaperSettings((prev) => ({ ...prev, ...updates }))
  }, [])

  const updateUserPreferences = useCallback((updates: Partial<UserPreferences>) => {
    setUserPreferences((prev) => ({ ...prev, ...updates }))
  }, [])

  const handleAddTask = useCallback(
    (text: string, category: Task["category"], deadline?: string, time?: string) => {
      addTask(text, category, deadline, time)
    },
    [addTask],
  )

  const handleReorderTasks = useCallback(
    (reorderedTasks: Task[]) => {
      setTasks(reorderedTasks)
    },
    [setTasks],
  )

  const generateWallpaper = useCallback(() => {
    setIsDownloading(true)
    const canvas = canvasRef.current
    if (!canvas) {
      setIsDownloading(false)
      return
    }

    setTimeout(() => {
      try {
        // Create a new canvas for the full-size wallpaper
        const fullCanvas = document.createElement("canvas")
        fullCanvas.width = 1920
        fullCanvas.height = 1080
        const fullCtx = fullCanvas.getContext("2d")
        
        if (!fullCtx) {
          throw new Error("Could not get canvas context")
        }

        // Draw the current canvas content to the full-size canvas
        fullCtx.drawImage(canvas, 0, 0, 1920, 1080)

        // Convert to blob for better quality
        fullCanvas.toBlob((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob)
            const downloadLink = document.createElement("a")
            downloadLink.href = url
            downloadLink.download = `focuswall-${Date.now()}.png`
            document.body.appendChild(downloadLink)
            downloadLink.click()
            document.body.removeChild(downloadLink)
            URL.revokeObjectURL(url)
          }
          setIsDownloading(false)
        }, "image/png", 1.0)
      } catch (error) {
        console.error("Error downloading wallpaper:", error)
        setIsDownloading(false)
      }
    }, 100) // Small delay to ensure canvas is fully rendered
  }, [])

  const toggleTheme = useCallback(() => {
    updateWallpaperSettings({ theme: wallpaperSettings.theme === "light" ? "dark" : "light" })
    document.documentElement.classList.toggle("dark")
  }, [wallpaperSettings.theme, updateWallpaperSettings])

  const handleAddCountdownEvent = useCallback((event: CountdownEvent) => {
    setCountdownEvents((prev) => [...prev, event])
  }, [])

  const handleRemoveCountdownEvent = useCallback((id: string) => {
    setCountdownEvents((prev) => prev.filter((event) => event.id !== id))
  }, [])

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-900 dark:to-indigo-900">
      <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-2 rounded-lg">
              <Layout className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              FocusWall
            </h1>
          </div>
          <nav className="flex items-center space-x-3">
            <Button
              variant="outline"
              size="sm"
              className="border-2 hover:bg-purple-50 dark:hover:bg-purple-900/20"
              onClick={() => setShowProfile(!showProfile)}
            >
              <User className="w-4 h-4 mr-2" />
              {showProfile ? "Dashboard" : "Profile"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="border-2 hover:bg-purple-50 dark:hover:bg-purple-900/20"
              onClick={toggleTheme}
            >
              {wallpaperSettings.theme === "light" ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </Button>
          </nav>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8">
        {showProfile ? (
          <ProfilePage
            tasks={tasks}
            userPreferences={userPreferences}
            onUpdateUserPreferences={updateUserPreferences}
          />
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              {/* Left Column - Controls */}
              <div className="xl:col-span-1 space-y-6">
                <Card className="border-2 border-purple-200 dark:border-purple-700 shadow-lg">
                  <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-t-lg">
                    <CardTitle className="flex items-center">
                      <Settings className="w-5 h-5 mr-2" />
                      Customization
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <Tabs value={activeTab} onValueChange={setActiveTab}>
                      <TabsList className="grid w-full grid-cols-3 mb-4">
                        <TabsTrigger value="settings" className="text-xs">Settings</TabsTrigger>
                        <TabsTrigger value="widgets" className="text-xs">Widgets</TabsTrigger>
                        <TabsTrigger value="events" className="text-xs">Events</TabsTrigger>
                      </TabsList>
                      <TabsContent value="settings" className="space-y-4">
                        <WallpaperCustomizer settings={wallpaperSettings} onUpdateSettings={updateWallpaperSettings} />
                      </TabsContent>
                      <TabsContent value="widgets" className="space-y-4">
                        <WidgetVisibility settings={wallpaperSettings} onUpdateSettings={updateWallpaperSettings} />
                      </TabsContent>
                      <TabsContent value="events" className="space-y-4">
                        <CountdownEvents
                          events={countdownEvents}
                          onAddEvent={handleAddCountdownEvent}
                          onRemoveEvent={handleRemoveCountdownEvent}
                        />
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>

                <Card className="border-2 border-blue-200 dark:border-blue-700 shadow-lg">
                  <CardHeader className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-t-lg">
                    <CardTitle className="flex items-center">
                      <FileText className="w-5 h-5 mr-2" />
                      Quick Notes
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <NotesWidget notes={notes} onUpdateNotes={setNotes} />
                  </CardContent>
                </Card>
              </div>

              {/* Right Column - Tasks and Preview */}
              <div className="xl:col-span-2 space-y-6">
                <Card className="border-2 border-green-200 dark:border-green-700 shadow-lg">
                  <CardHeader className="bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-t-lg">
                    <CardTitle className="flex items-center">
                      <CalendarIcon className="w-5 h-5 mr-2" />
                      Task Manager
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <DragDropContext onDragEnd={() => {}}>
                      <TaskList
                        tasks={tasks}
                        onAddTask={handleAddTask}
                        onRemoveTask={removeTask}
                        onToggleTask={toggleTask}
                        onReorderTasks={handleReorderTasks}
                      />
                    </DragDropContext>
                  </CardContent>
                </Card>

                <Card className="border-2 border-orange-200 dark:border-orange-700 shadow-lg">
                  <CardHeader className="bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-t-lg">
                    <CardTitle>Wallpaper Preview</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
                      <WallpaperPreview
                        ref={canvasRef}
                        settings={wallpaperSettings}
                        tasks={tasks}
                        notes={notes}
                        userPreferences={userPreferences}
                        countdownEvents={countdownEvents}
                      />
                    </div>
                    <div className="mt-6 flex flex-col sm:flex-row gap-3">
                      <Button
                        onClick={generateWallpaper}
                        disabled={isDownloading}
                        className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-6 text-lg shadow-lg"
                        size="lg"
                      >
                        {isDownloading ? (
                          <>
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Generating...
                          </>
                        ) : (
                          <>
                            <Download className="mr-2 h-5 w-5" /> Download Wallpaper (1920x1080)
                          </>
                        )}
                      </Button>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-3 text-center">
                      Click the button above to download your customized wallpaper in full HD quality
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-t border-gray-200 dark:border-gray-700 py-6 mt-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-600 dark:text-gray-400">
            &copy; 2025 FocusWall. Free productivity wallpaper creator for everyone.
          </p>
        </div>
      </footer>
    </div>
  )
}
