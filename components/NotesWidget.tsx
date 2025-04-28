"use client"

import { useState } from "react"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"

interface NotesWidgetProps {
  notes: string
  onUpdateNotes: (notes: string) => void
}

export function NotesWidget({ notes, onUpdateNotes }: NotesWidgetProps) {
  const [editableNotes, setEditableNotes] = useState(notes)

  const handleSave = () => {
    onUpdateNotes(editableNotes)
  }

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border-4 border-black dark:border-white">
      <h3 className="text-lg font-semibold text-black dark:text-white mb-2">Notes</h3>
      <Textarea
        value={editableNotes}
        onChange={(e) => setEditableNotes(e.target.value)}
        className="w-full h-32 mb-2 border-2 border-black dark:border-white dark:text-white dark:bg-gray-700"
        placeholder="Add your notes here..."
      />
      <Button
        onClick={handleSave}
        className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold border-4 border-black dark:border-white dark:text-white dark:hover:text-black"
      >
        Save Notes
      </Button>
    </div>
  )
}
