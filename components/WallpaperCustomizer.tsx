"use client"
import type { WallpaperSettings } from "../types"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Image, Upload, Palette } from "lucide-react"

interface WallpaperCustomizerProps {
  settings: WallpaperSettings
  onUpdateSettings: (updates: Partial<WallpaperSettings>) => void
}

export function WallpaperCustomizer({ settings, onUpdateSettings }: WallpaperCustomizerProps) {
  return (
    <div className="space-y-5">
      <div>
        <Label htmlFor="backgroundType" className="flex items-center text-sm font-medium mb-2">
          <Palette className="w-4 h-4 mr-2" />
          Background Type
        </Label>
        <Select
          value={settings.backgroundType}
          onValueChange={(value: "image" | "gradient" | "upload") => onUpdateSettings({ backgroundType: value })}
        >
          <SelectTrigger id="backgroundType" className="w-full border-2">
            <SelectValue placeholder="Select background type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="gradient">🎨 Gradient</SelectItem>
            <SelectItem value="image">🔗 Image URL</SelectItem>
            <SelectItem value="upload">📤 Upload Image</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {settings.backgroundType === "image" && (
        <div>
          <Label htmlFor="backgroundImage" className="flex items-center text-sm font-medium mb-2">
            <Image className="w-4 h-4 mr-2" />
            Image URL
          </Label>
          <Input
            type="text"
            id="backgroundImage"
            value={settings.backgroundImage}
            onChange={(e) => onUpdateSettings({ backgroundImage: e.target.value })}
            placeholder="https://example.com/image.jpg"
            className="border-2 focus:border-purple-500"
          />
          <p className="text-xs text-gray-500 mt-1">Try Unsplash for free images!</p>
        </div>
      )}

      {settings.backgroundType === "upload" && (
        <div>
          <Label htmlFor="backgroundUpload" className="flex items-center text-sm font-medium mb-2">
            <Upload className="w-4 h-4 mr-2" />
            Upload Image
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
            className="border-2 cursor-pointer"
          />
          <p className="text-xs text-gray-500 mt-1">Upload your own background image</p>
        </div>
      )}

      <div>
        <Label htmlFor="theme" className="block text-sm font-medium mb-2">
          Color Theme
        </Label>
        <Select value={settings.theme} onValueChange={(value: "light" | "dark") => onUpdateSettings({ theme: value })}>
          <SelectTrigger id="theme" className="w-full border-2">
            <SelectValue placeholder="Select theme" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="light">☀️ Light Theme</SelectItem>
            <SelectItem value="dark">🌙 Dark Theme</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="widgetTransparency" className="block text-sm font-medium mb-2">
          Widget Transparency: {settings.widgetTransparency}%
        </Label>
        <Slider
          id="widgetTransparency"
          min={0}
          max={100}
          step={5}
          value={[settings.widgetTransparency]}
          onValueChange={([value]) => onUpdateSettings({ widgetTransparency: value })}
          className="mt-2"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>Opaque</span>
          <span>Transparent</span>
        </div>
      </div>
    </div>
  )
}
