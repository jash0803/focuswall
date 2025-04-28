"use client"
import type { WallpaperSettings } from "../types"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"

interface WallpaperCustomizerProps {
  settings: WallpaperSettings
  onUpdateSettings: (updates: Partial<WallpaperSettings>) => void
}

export function WallpaperCustomizer({ settings, onUpdateSettings }: WallpaperCustomizerProps) {
  return (
    <div className="space-y-4 bg-white dark:bg-gray-800 p-4 rounded-xl border-4 border-black dark:border-white">
      <div>
        <Label htmlFor="backgroundType" className="block text-sm font-medium text-black dark:text-white">
          Background Type
        </Label>
        <Select
          value={settings.backgroundType}
          onValueChange={(value: "image" | "gradient" | "upload") => onUpdateSettings({ backgroundType: value })}
        >
          <SelectTrigger
            id="backgroundType"
            className="w-full mt-1 border-4 border-black dark:border-white dark:text-white"
          >
            <SelectValue placeholder="Select background type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="image">Image URL</SelectItem>
            <SelectItem value="upload">Upload Image</SelectItem>
            <SelectItem value="gradient">Gradient</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {settings.backgroundType === "image" && (
        <div>
          <Label htmlFor="backgroundImage" className="block text-sm font-medium text-black dark:text-white">
            Background Image URL
          </Label>
          <Input
            type="text"
            id="backgroundImage"
            value={settings.backgroundImage}
            onChange={(e) => onUpdateSettings({ backgroundImage: e.target.value })}
            placeholder="Enter image URL"
            className="mt-1 border-4 border-black dark:border-white dark:text-white dark:placeholder-gray-400"
          />
        </div>
      )}
      {settings.backgroundType === "upload" && (
        <div>
          <Label htmlFor="backgroundUpload" className="block text-sm font-medium text-black dark:text-white">
            Upload Background Image
          </Label>
          <Input
            type="file"
            id="backgroundUpload"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) {
                const reader = new FileReader()
                reader.onload = (event) => {
                  onUpdateSettings({ backgroundImage: event.target?.result as string })
                }
                reader.readAsDataURL(file)
              }
            }}
            className="mt-1 border-4 border-black dark:border-white dark:text-white"
          />
        </div>
      )}
      <div>
        <Label htmlFor="theme" className="block text-sm font-medium text-black dark:text-white">
          Theme
        </Label>
        <Select value={settings.theme} onValueChange={(value: "light" | "dark") => onUpdateSettings({ theme: value })}>
          <SelectTrigger id="theme" className="w-full mt-1 border-4 border-black dark:border-white dark:text-white">
            <SelectValue placeholder="Select theme" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="light">Light</SelectItem>
            <SelectItem value="dark">Dark</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="widgetTransparency" className="block text-sm font-medium text-black dark:text-white">
          Widget Transparency
        </Label>
        <Slider
          id="widgetTransparency"
          min={0}
          max={100}
          step={1}
          value={[settings.widgetTransparency]}
          onValueChange={([value]) => onUpdateSettings({ widgetTransparency: value })}
          className="mt-2"
        />
        <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">{settings.widgetTransparency}%</div>
      </div>
    </div>
  )
}
