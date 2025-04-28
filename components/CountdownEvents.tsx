"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import type { CountdownEvent } from "../types"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

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

  return (
    <Card className="bg-white dark:bg-gray-800 p-4 rounded-xl border-4 border-black dark:border-white">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-black dark:text-white">Countdown Events</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="eventTitle" className="text-black dark:text-white">
              Event Title
            </Label>
            <Input
              id="eventTitle"
              placeholder="Enter event title"
              value={newEventTitle}
              onChange={(e) => setNewEventTitle(e.target.value)}
              className="border-2 border-black dark:border-white dark:text-white dark:bg-gray-700"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="eventDate" className="text-black dark:text-white">
              Event Date
            </Label>
            <Input
              id="eventDate"
              type="date"
              value={newEventDate}
              onChange={(e) => setNewEventDate(e.target.value)}
              className="border-2 border-black dark:border-white dark:text-white dark:bg-gray-700"
            />
          </div>
        </div>
        <Button
          onClick={handleAddEvent}
          className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-bold border-4 border-black dark:border-white dark:text-white dark:hover:text-black"
        >
          Add Event
        </Button>
        <div className="space-y-2">
          {events.map((event) => (
            <div
              key={event.id}
              className="flex items-center justify-between bg-gray-100 dark:bg-gray-700 p-2 rounded border-2 border-black dark:border-white"
            >
              <span className="text-black dark:text-white">
                {event.title} - {event.date}
              </span>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => onRemoveEvent(event.id)}
                className="border-2 border-black dark:border-white"
              >
                Remove
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
