"use client"

import { useEffect, forwardRef } from "react"
import type { WallpaperSettings, Task, UserPreferences, CountdownEvent } from "../types"

interface WallpaperPreviewProps {
  settings: WallpaperSettings
  tasks: Task[]
  notes: string
  userPreferences: UserPreferences
  countdownEvents: CountdownEvent[]
}

const quotes = [
  { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
  { text: "Innovation distinguishes between a leader and a follower.", author: "Steve Jobs" },
  { text: "Your time is limited, don't waste it living someone else's life.", author: "Steve Jobs" },
  { text: "Strive not to be a success, but rather to be of value.", author: "Albert Einstein" },
  {
    text: "Two things are infinite: the universe and human stupidity; and I'm not sure about the universe.",
    author: "Albert Einstein",
  },
  { text: "I have no special talent. I am only passionately curious.", author: "Albert Einstein" },
  { text: "Stay hungry, stay foolish.", author: "Steve Jobs" },
  {
    text: "The greatest glory in living lies not in never falling, but in rising every time we fall.",
    author: "Nelson Mandela",
  },
  { text: "The way to get started is to quit talking and begin doing.", author: "Walt Disney" },
  {
    text: "Your work is going to fill a large part of your life, and the only way to be truly satisfied is to do what you believe is great work.",
    author: "Steve Jobs",
  },
]

const getDailyQuote = () => {
  const today = new Date()
  const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24))
  return quotes[dayOfYear % quotes.length]
}

export const WallpaperPreview = forwardRef<HTMLCanvasElement, WallpaperPreviewProps>(
  ({ settings, tasks, notes, userPreferences, countdownEvents }, ref) => {
    useEffect(() => {
      // Check if ref exists and is not null
      if (!ref || typeof ref === "function" || !ref.current) return

      const canvas = ref.current
      const ctx = canvas.getContext("2d")
      if (!ctx) return

      canvas.width = 1920
      canvas.height = 1080

      const drawContent = () => {
        if (settings.backgroundType === "image") {
          const img = new Image()
          img.crossOrigin = "anonymous"
          img.onload = () => {
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
            drawWidgets()
          }
          img.src = settings.backgroundImage
        } else {
          const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
          gradient.addColorStop(0, settings.theme === "light" ? "#F0F4F8" : "#1A202C")
          gradient.addColorStop(1, settings.theme === "light" ? "#D1D5DB" : "#2D3748")
          ctx.fillStyle = gradient
          ctx.fillRect(0, 0, canvas.width, canvas.height)
          drawWidgets()
        }
      }

      const drawWidgets = () => {
        const opacity = (100 - settings.widgetTransparency) / 100
        const widgets = [
          { name: "calendar", draw: drawCalendar, visible: settings.showCalendar },
          { name: "weather", draw: drawWeatherWidget, visible: settings.showWeather },
          { name: "notes", draw: drawNotesWidget, visible: settings.showNotes && notes.trim() !== "" },
          {
            name: "countdown",
            draw: drawCountdownWidget,
            visible: settings.showCountdown && countdownEvents.length > 0,
          },
        ]

        const leftColumnWidth = 300
        const rightColumnWidth = 400
        const padding = 20

        // Draw tasks on the right side
        if (settings.showTasks) {
          drawTasksWidget(
            ctx,
            canvas.width - rightColumnWidth - padding,
            padding,
            rightColumnWidth,
            canvas.height - padding * 2,
            opacity,
          )
        }

        // Draw other widgets on the left side of tasks
        let y = padding
        widgets.forEach((widget) => {
          if (widget.visible) {
            const widgetHeight = 200
            if (y + widgetHeight <= canvas.height - padding) {
              widget.draw(
                ctx,
                canvas.width - rightColumnWidth - leftColumnWidth - padding * 2,
                y,
                leftColumnWidth,
                widgetHeight,
                opacity,
              )
              y += widgetHeight + padding
            }
          }
        })

        if (settings.showQuote) {
          const quoteWidth = canvas.width - leftColumnWidth - rightColumnWidth - padding * 4
          drawQuoteWidget(
            ctx,
            (canvas.width - rightColumnWidth - leftColumnWidth - padding * 2) / 2,
            canvas.height - 60,
            quoteWidth,
            80,
            opacity,
          )
        }
      }

      const drawCalendar = (
        ctx: CanvasRenderingContext2D,
        x: number,
        y: number,
        width: number,
        height: number,
        opacity: number,
      ) => {
        const today = new Date()
        const currentMonth = today.toLocaleString("default", { month: "long" })
        const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate()
        const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1).getDay()

        ctx.fillStyle = settings.theme === "light" ? `rgba(255, 255, 255, ${opacity})` : `rgba(45, 55, 72, ${opacity})`
        ctx.beginPath()
        ctx.roundRect(x, y, width, height, 20)
        ctx.fill()

        ctx.font = 'bold 18px "Inter", sans-serif'
        ctx.fillStyle = settings.theme === "light" ? "#1A202C" : "#F7FAFC"
        ctx.textAlign = "center"
        ctx.fillText(currentMonth.toUpperCase(), x + width / 2, y + 30)

        const days = ["S", "M", "T", "W", "T", "F", "S"]
        ctx.font = '12px "Inter", sans-serif'
        ctx.fillStyle = settings.theme === "light" ? "#4A5568" : "#A0AEC0"

        const cellWidth = width / 7
        const cellHeight = (height - 40) / 7 // Subtract 40 for the month name and padding

        days.forEach((day, index) => {
          ctx.fillText(day, x + cellWidth * index + cellWidth / 2, y + 50)
        })

        ctx.font = '14px "Inter", sans-serif'
        ctx.textAlign = "center"
        let currentX = x
        let currentY = y + 70
        let dayOfWeek = firstDayOfMonth

        for (let i = 1; i <= daysInMonth; i++) {
          if (i === today.getDate()) {
            ctx.fillStyle = "#4299E1"
            ctx.beginPath()
            ctx.arc(currentX + cellWidth / 2, currentY + cellHeight / 2 - 2, cellWidth / 3, 0, 2 * Math.PI)
            ctx.fill()
            ctx.fillStyle = "#FFFFFF"
          } else {
            ctx.fillStyle = settings.theme === "light" ? "#1A202C" : "#F7FAFC"
          }
          ctx.fillText(i.toString(), currentX + cellWidth / 2, currentY + cellHeight / 2 + 4)
          currentX += cellWidth
          dayOfWeek++
          if (dayOfWeek === 7) {
            dayOfWeek = 0
            currentX = x
            currentY += cellHeight
          }
        }
      }

      const drawWeatherWidget = (
        ctx: CanvasRenderingContext2D,
        x: number,
        y: number,
        width: number,
        height: number,
        opacity: number,
      ) => {
        ctx.fillStyle = settings.theme === "light" ? `rgba(255, 255, 255, ${opacity})` : `rgba(45, 55, 72, ${opacity})`
        ctx.beginPath()
        ctx.roundRect(x, y, width, height, 20)
        ctx.fill()

        ctx.font = 'bold 24px "Inter", sans-serif'
        ctx.fillStyle = settings.theme === "light" ? "#1A202C" : "#F7FAFC"
        ctx.textAlign = "center"
        ctx.fillText("7-DAY FORECAST", x + width / 2, y + 30)

        ctx.font = '18px "Inter", sans-serif'
        ctx.fillStyle = settings.theme === "light" ? "#4A5568" : "#A0AEC0"
        ctx.fillText("Weather data loading...", x + width / 2, y + height / 2)
      }

      const drawNotesWidget = (
        ctx: CanvasRenderingContext2D,
        x: number,
        y: number,
        width: number,
        height: number,
        opacity: number,
      ) => {
        ctx.fillStyle = settings.theme === "light" ? `rgba(255, 255, 255, ${opacity})` : `rgba(45, 55, 72, ${opacity})`
        ctx.beginPath()
        ctx.roundRect(x, y, width, height, 20)
        ctx.fill()

        ctx.font = 'bold 24px "Inter", sans-serif'
        ctx.fillStyle = settings.theme === "light" ? "#1A202C" : "#F7FAFC"
        ctx.textAlign = "center"
        ctx.fillText("Notes", x + width / 2, y + 30)

        ctx.font = '16px "Inter", sans-serif'
        ctx.fillStyle = settings.theme === "light" ? "#4A5568" : "#A0AEC0"
        ctx.textAlign = "left"
        const maxNotesWidth = width - 40
        const notesWords = notes.split(" ")
        let notesLine = ""
        let notesY = y + 60

        for (let i = 0; i < notesWords.length; i++) {
          const testLine = notesLine + notesWords[i] + " "
          const metrics = ctx.measureText(testLine)
          const testWidth = metrics.width

          if (testWidth > maxNotesWidth && i > 0) {
            ctx.fillText(notesLine, x + 20, notesY)
            notesLine = notesWords[i] + " "
            notesY += 24
            if (notesY > y + height - 20) {
              ctx.fillText("...", x + 20, notesY)
              break
            }
          } else {
            notesLine = testLine
          }
        }
        if (notesY <= y + height - 20) {
          ctx.fillText(notesLine, x + 20, notesY)
        }
      }

      const drawTasksWidget = (
        ctx: CanvasRenderingContext2D,
        x: number,
        y: number,
        width: number,
        height: number,
        opacity: number,
      ) => {
        ctx.fillStyle = settings.theme === "light" ? `rgba(255, 255, 255, ${opacity})` : `rgba(45, 55, 72, ${opacity})`
        ctx.beginPath()
        ctx.roundRect(x, y, width, height, 20)
        ctx.fill()

        ctx.font = 'bold 24px "Inter", sans-serif'
        ctx.fillStyle = settings.theme === "light" ? "#1A202C" : "#F7FAFC"
        ctx.textAlign = "center"
        ctx.fillText("Tasks", x + width / 2, y + 30)

        const categories: Task["category"][] = ["PERSONAL", "WORK", "OTHERS"]
        let currentY = y + 60

        categories.forEach((category) => {
          const categoryTasks = tasks.filter((task) => task.category === category)
          if (categoryTasks.length > 0) {
            ctx.font = 'bold 18px "Inter", sans-serif'
            ctx.fillStyle = settings.theme === "light" ? "#2D3748" : "#E2E8F0"
            ctx.textAlign = "left"
            ctx.fillText(category, x + 20, currentY)
            currentY += 30

            ctx.font = '16px "Inter", sans-serif'
            ctx.fillStyle = settings.theme === "light" ? "#4A5568" : "#A0AEC0"
            categoryTasks.forEach((task, index) => {
              if (currentY < y + height - 20) {
                const taskText = `${index + 1}. ${task.text.substring(0, 30)}${task.text.length > 30 ? "..." : ""}`
                ctx.fillText(taskText, x + 20, currentY)
                currentY += 24
              }
            })

            currentY += 10 // Add some space between categories
          }
        })
      }

      const drawCountdownWidget = (
        ctx: CanvasRenderingContext2D,
        x: number,
        y: number,
        width: number,
        height: number,
        opacity: number,
      ) => {
        ctx.fillStyle = settings.theme === "light" ? `rgba(255, 255, 255, ${opacity})` : `rgba(45, 55, 72, ${opacity})`
        ctx.beginPath()
        ctx.roundRect(x, y, width, height, 20)
        ctx.fill()

        if (countdownEvents.length === 0) {
          ctx.font = 'bold 20px "Inter", sans-serif'
          ctx.fillStyle = settings.theme === "light" ? "#1A202C" : "#F7FAFC"
          ctx.textAlign = "center"
          ctx.fillText("No upcoming events", x + width / 2, y + height / 2)
          return
        }

        const event = countdownEvents[0]
        const daysLeft = calculateDaysLeft(event.date)

        ctx.font = 'bold 20px "Inter", sans-serif'
        ctx.fillStyle = settings.theme === "light" ? "#1A202C" : "#F7FAFC"
        ctx.textAlign = "center"
        ctx.fillText(event.title, x + width / 2, y + 30)

        ctx.font = 'bold 36px "Inter", sans-serif'
        ctx.fillText(`${daysLeft}`, x + width / 2, y + 90)

        ctx.font = '18px "Inter", sans-serif'
        ctx.fillText(`${daysLeft === 1 ? "day" : "days"} left`, x + width / 2, y + 120)

        ctx.font = '14px "Inter", sans-serif'
        ctx.fillStyle = settings.theme === "light" ? "#4A5568" : "#A0AEC0"
        ctx.fillText(`Until ${formatDate(event.date, userPreferences.dateFormat)}`, x + width / 2, y + 150)
      }

      const drawQuoteWidget = (
        ctx: CanvasRenderingContext2D,
        x: number,
        y: number,
        width: number,
        height: number,
        opacity: number,
      ) => {
        const { text, author } = getDailyQuote()

        ctx.fillStyle = settings.theme === "light" ? `rgba(255, 255, 255, ${opacity})` : `rgba(45, 55, 72, ${opacity})`
        ctx.beginPath()
        ctx.roundRect(x - width / 2, y - height / 2, width, height, 20)
        ctx.fill()

        ctx.font = 'italic 18px "Inter", sans-serif'
        ctx.fillStyle = settings.theme === "light" ? "#1A202C" : "#F7FAFC"
        ctx.textAlign = "center"
        const maxQuoteWidth = width - 40
        const words = text.split(" ")
        let line = ""
        let quoteY = y - height / 2 + 25

        for (let i = 0; i < words.length; i++) {
          const testLine = line + words[i] + " "
          const metrics = ctx.measureText(testLine)
          const testWidth = metrics.width

          if (testWidth > maxQuoteWidth && i > 0) {
            ctx.fillText(line, x, quoteY)
            line = words[i] + " "
            quoteY += 24
          } else {
            line = testLine
          }
        }
        ctx.fillText(line, x, quoteY)

        ctx.font = 'normal 14px "Inter", sans-serif'
        ctx.fillText(`- ${author}`, x, y + height / 2 - 15)
      }

      const formatDate = (dateString: string, format: string) => {
        const date = new Date(dateString)
        const day = date.getDate().toString().padStart(2, "0")
        const month = (date.getMonth() + 1).toString().padStart(2, "0")
        const year = date.getFullYear()

        switch (format) {
          case "MM/DD/YYYY":
            return `${month}/${day}/${year}`
          case "DD/MM/YYYY":
            return `${day}/${month}/${year}`
          case "YYYY-MM-DD":
            return `${year}-${month}-${day}`
          default:
            return dateString
        }
      }

      const calculateDaysLeft = (dateString: string) => {
        const today = new Date()
        const eventDate = new Date(dateString)
        const timeDiff = eventDate.getTime() - today.getTime()
        return Math.ceil(timeDiff / (1000 * 3600 * 24))
      }

      drawContent()
    }, [settings, tasks, notes, userPreferences, countdownEvents, ref])

    return <canvas ref={ref} className="w-full h-auto rounded-xl border-2 border-white/50" />
  },
)

WallpaperPreview.displayName = "WallpaperPreview"
