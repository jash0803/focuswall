"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import type { CountdownEvent } from "../types"
import { Label } from "@/components/ui/label"
import { Plus, Trash2, Calendar as CalendarIcon } from "lucide-react"

interface CountdownEventsProps {
  events: CountdownEvent[]
  onAddEvent: (event: CountdownEvent) => void
  onRemoveEvent: (id: string) => void
}

export function CountdownEvents({ events, onAddEvent, onRemoveEvent }: CountdownEventsProps) {
  const [newEventTitle, setNewEventTitle] = useState("")
  const [newEventDate, setNewEventDate] = useState("")

  const handleAddEvent = () => {
    if (newEventTitle && newEventDate) {
      onAddEvent({
        id: Date.now().toString(),
        title: newEventTitle,
        date: newEventDate,
      })
      setNewEventTitle("")
      setNewEventDate("")
    }
  }

  const calculateDaysLeft = (dateString: string) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const eventDate = new Date(dateString)
    eventDate.setHours(0, 0, 0, 0)
    const timeDiff = eventDate.getTime() - today.getTime()
    return Math.ceil(timeDiff / (1000 * 3600 * 24))
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleAddEvent()
    }
  }

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        <div>
          <Label htmlFor="eventTitle" className="flex items-center text-sm font-medium mb-2">
            <CalendarIcon className="w-4 h-4 mr-2" />
            Event Title
          </Label>
          <Input
            id="eventTitle"
            placeholder="e.g., Project Deadline, Birthday..."
            value={newEventTitle}
            onChange={(e) => setNewEventTitle(e.target.value)}
            onKeyPress={handleKeyPress}
            className="border-2 focus:border-amber-500"
          />
        </div>
        <div>
          <Label htmlFor="eventDate" className="block text-sm font-medium mb-2">
            Target Date
          </Label>
          <Input
            id="eventDate"
            type="date"
            value={newEventDate}
            onChange={(e) => setNewEventDate(e.target.value)}
            onKeyPress={handleKeyPress}
            className="border-2 focus:border-amber-500"
          />
        </div>
        <Button
          onClick={handleAddEvent}
          className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Event
        </Button>
      </div>

      {events.length > 0 && (
        <div className="space-y-2 max-h-64 overflow-y-auto">
          <p className="text-xs text-gray-500 dark:text-gray-400">Active Countdowns</p>
          {events.map((event) => {
            const daysLeft = calculateDaysLeft(event.date)
            return (
              <div
                key={event.id}
                className="flex items-center justify-between bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 p-3 rounded-lg border-2 border-amber-200 dark:border-amber-700"
              >
                <div className="flex-grow">
                  <p className="font-medium text-sm text-gray-900 dark:text-white">{event.title}</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {event.date} • {daysLeft} {daysLeft === 1 ? "day" : "days"} left
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onRemoveEvent(event.id)}
                  className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            )
          })}
        </div>
      )}

      {events.length === 0 && (
        <div className="text-center py-6 text-gray-500 dark:text-gray-400">
          <p className="text-sm">No countdown events yet</p>
        </div>
      )}
    </div>
  )
}
