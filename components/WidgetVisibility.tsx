import { Switch } from "@/components/ui/switch"
import type { WallpaperSettings } from "../types"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface WidgetVisibilityProps {
  settings: WallpaperSettings
  onUpdateSettings: (settings: Partial<WallpaperSettings>) => void
}

export function WidgetVisibility({ settings, onUpdateSettings }: WidgetVisibilityProps) {
  return (
    <Card className="bg-white dark:bg-gray-800 p-4 rounded-xl border-4 border-black dark:border-white">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-black dark:text-white">Widget Visibility</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="showCalendar" className="text-black dark:text-white">
            Show Calendar
          </Label>
          <Switch
            id="showCalendar"
            checked={settings.showCalendar}
            onCheckedChange={(checked) => onUpdateSettings({ showCalendar: checked })}
          />
        </div>
        <div className="flex items-center justify-between">
          <Label htmlFor="showWeather" className="text-black dark:text-white">
            Show Weather
          </Label>
          <Switch
            id="showWeather"
            checked={settings.showWeather}
            onCheckedChange={(checked) => onUpdateSettings({ showWeather: checked })}
          />
        </div>
        <div className="flex items-center justify-between">
          <Label htmlFor="showNotes" className="text-black dark:text-white">
            Show Notes
          </Label>
          <Switch
            id="showNotes"
            checked={settings.showNotes}
            onCheckedChange={(checked) => onUpdateSettings({ showNotes: checked })}
          />
        </div>
        <div className="flex items-center justify-between">
          <Label htmlFor="showTasks" className="text-black dark:text-white">
            Show Tasks
          </Label>
          <Switch
            id="showTasks"
            checked={settings.showTasks}
            onCheckedChange={(checked) => onUpdateSettings({ showTasks: checked })}
          />
        </div>
        <div className="flex items-center justify-between">
          <Label htmlFor="showQuote" className="text-black dark:text-white">
            Show Quote
          </Label>
          <Switch
            id="showQuote"
            checked={settings.showQuote}
            onCheckedChange={(checked) => onUpdateSettings({ showQuote: checked })}
          />
        </div>
        <div className="flex items-center justify-between">
          <Label htmlFor="showCountdown" className="text-black dark:text-white">
            Show Countdown
          </Label>
          <Switch
            id="showCountdown"
            checked={settings.showCountdown}
            onCheckedChange={(checked) => onUpdateSettings({ showCountdown: checked })}
          />
        </div>
      </CardContent>
    </Card>
  )
}
