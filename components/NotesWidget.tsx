"use client"

import { useState, useEffect } from "react"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Save, Check } from "lucide-react"

interface NotesWidgetProps {
  notes: string
  onUpdateNotes: (notes: string) => void
}

export function NotesWidget({ notes, onUpdateNotes }: NotesWidgetProps) {
  const [editableNotes, setEditableNotes] = useState(notes)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    setEditableNotes(notes)
  }, [notes])

  const handleSave = () => {
    onUpdateNotes(editableNotes)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="space-y-3">
      <Textarea
        value={editableNotes}
        onChange={(e) => setEditableNotes(e.target.value)}
        className="w-full h-32 border-2 focus:border-blue-500 dark:border-gray-600 resize-none"
        placeholder="Add your quick notes here... They'll appear on your wallpaper!"
      />
      <Button
        onClick={handleSave}
        className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white"
      >
        {saved ? (
          <>
            <Check className="w-4 h-4 mr-2" />
            Saved!
          </>
        ) : (
          <>
            <Save className="w-4 h-4 mr-2" />
            Save Notes
          </>
        )}
      </Button>
    </div>
  )
}
