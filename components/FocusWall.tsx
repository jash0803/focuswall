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
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Download, LogOut, Moon, Sun, User, Loader2 } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useRouter } from "next/navigation"

export function FocusWall() {
  const { tasks, addTask, removeTask, toggleTask, setTasks } = useTasks()
  const [wallpaperSettings, setWallpaperSettings] = useState<WallpaperSettings>({
    backgroundType: "gradient",
    backgroundImage: "https://source.unsplash.com/random/1920x1080",
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
  const [user, setUser] = useState<any>(null)
  const [isDownloading, setIsDownloading] = useState(false)
  const supabase = createClientComponentClient()
  const router = useRouter()

  useEffect(() => {
    async function getUserProfile() {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser()
        setUser(user)
      } catch (error) {
        console.error("Error fetching user:", error)
      }
    }

    getUserProfile()
  }, [supabase.auth])

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

    try {
      const dataUrl = canvas.toDataURL("image/png")
      const downloadLink = document.createElement("a")
      downloadLink.href = dataUrl
      downloadLink.download = "focuswall.png"
      downloadLink.click()
    } catch (error) {
      console.error("Error downloading wallpaper:", error)
    } finally {
      setIsDownloading(false)
    }
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

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.refresh()
  }

  return (
    <div className="min-h-screen flex flex-col bg-yellow-200">
      <header className="bg-black text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-4xl font-bold">FocusWall</h1>
          <nav className="flex items-center space-x-4">
            <Button
              variant="outline"
              className="text-white border-white hover:bg-white hover:text-black"
              onClick={() => setShowProfile(!showProfile)}
            >
              <User className="w-4 h-4 mr-2" />
              {showProfile ? "Dashboard" : "Profile"}
            </Button>
            <Button
              variant="outline"
              className="text-white border-white hover:bg-white hover:text-black"
              onClick={toggleTheme}
            >
              {wallpaperSettings.theme === "light" ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </Button>
            <div className="flex items-center space-x-2">
              {user && (
                <div className="flex items-center">
                  <Avatar className="h-8 w-8 border border-white">
                    <AvatarImage
                      src={user.user_metadata?.avatar_url || ""}
                      alt={user.user_metadata?.full_name || user.email}
                    />
                    <AvatarFallback>{user.email?.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <span className="ml-2 text-sm hidden md:inline-block">
                    {user.user_metadata?.full_name || user.email}
                  </span>
                </div>
              )}
              <Button
                variant="outline"
                className="text-white border-white hover:bg-white hover:text-black"
                onClick={handleSignOut}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </nav>
        </div>
      </header>
      <main className="flex-grow container mx-auto p-4">
        {showProfile ? (
          <ProfilePage
            tasks={tasks}
            userPreferences={userPreferences}
            onUpdateUserPreferences={updateUserPreferences}
          />
        ) : (
          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Tasks</CardTitle>
                </CardHeader>
                <CardContent>
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
              <div className="space-y-8">
                <WallpaperCustomizer settings={wallpaperSettings} onUpdateSettings={updateWallpaperSettings} />
                <NotesWidget notes={notes} onUpdateNotes={setNotes} />
                <WidgetVisibility settings={wallpaperSettings} onUpdateSettings={updateWallpaperSettings} />
                <CountdownEvents
                  events={countdownEvents}
                  onAddEvent={handleAddCountdownEvent}
                  onRemoveEvent={handleRemoveCountdownEvent}
                />
              </div>
            </div>
            <Card>
              <CardHeader>
                <CardTitle>Wallpaper Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <WallpaperPreview
                  ref={canvasRef}
                  settings={wallpaperSettings}
                  tasks={tasks}
                  notes={notes}
                  userPreferences={userPreferences}
                  countdownEvents={countdownEvents}
                />
                <Button
                  onClick={generateWallpaper}
                  disabled={isDownloading}
                  className="mt-4 bg-yellow-400 hover:bg-yellow-500 text-black font-bold border-4 border-black dark:border-white dark:text-white dark:hover:text-black"
                >
                  {isDownloading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Downloading...
                    </>
                  ) : (
                    <>
                      <Download className="mr-2 h-4 w-4" /> Download Wallpaper
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
      <footer className="bg-black text-white p-4">
        <div className="container mx-auto text-center">
          <p>&copy; 2023 FocusWall. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
