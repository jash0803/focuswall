export interface Task {
  id: string
  text: string
  category: "PERSONAL" | "WORK" | "OTHERS"
  deadline?: string
  time?: string
  completed: boolean
}

export interface WallpaperSettings {
  backgroundType: "image" | "gradient"
  backgroundImage: string
  theme: "light" | "dark"
  widgetTransparency: number
  showCalendar: boolean
  showWeather: boolean
  showNotes: boolean
  showTasks: boolean
  showQuote: boolean
  showCountdown: boolean
}

export interface UserPreferences {
  dateFormat: string
  timeFormat: string
  language: string
}

export interface CountdownEvent {
  id: string
  title: string
  date: string
}
