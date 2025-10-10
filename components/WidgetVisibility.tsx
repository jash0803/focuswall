import { Switch } from "@/components/ui/switch"
import type { WallpaperSettings } from "../types"
import { Label } from "@/components/ui/label"
import { Calendar, Cloud, FileText, CheckSquare, Quote, Clock } from "lucide-react"

interface WidgetVisibilityProps {
  settings: WallpaperSettings
  onUpdateSettings: (settings: Partial<WallpaperSettings>) => void
}

const widgets = [
  { key: "showTasks", label: "Tasks", icon: CheckSquare },
  { key: "showCalendar", label: "Calendar", icon: Calendar },
  { key: "showNotes", label: "Notes", icon: FileText },
  { key: "showCountdown", label: "Countdown", icon: Clock },
  { key: "showQuote", label: "Daily Quote", icon: Quote },
]

export function WidgetVisibility({ settings, onUpdateSettings }: WidgetVisibilityProps) {
  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
        Toggle which widgets appear on your wallpaper
      </p>
      {widgets.map((widget) => {
        const Icon = widget.icon
        return (
          <div
            key={widget.key}
            className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <Label htmlFor={widget.key} className="flex items-center cursor-pointer">
              <Icon className="w-4 h-4 mr-2 text-purple-500" />
              {widget.label}
            </Label>
            <Switch
              id={widget.key}
              checked={settings[widget.key as keyof WallpaperSettings] as boolean}
              onCheckedChange={(checked) => onUpdateSettings({ [widget.key]: checked })}
            />
          </div>
        )
      })}
    </div>
  )
}
