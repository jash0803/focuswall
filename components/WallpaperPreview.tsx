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
  { text: "Stay hungry, stay foolish.", author: "Steve Jobs" },
  { text: "The greatest glory in living lies not in never falling, but in rising every time we fall.", author: "Nelson Mandela" },
  { text: "The way to get started is to quit talking and begin doing.", author: "Walt Disney" },
  { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
  { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" },
]

const getDailyQuote = () => {
  const today = new Date()
  const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24))
  return quotes[dayOfYear % quotes.length]
}

export const WallpaperPreview = forwardRef<HTMLCanvasElement, WallpaperPreviewProps>(
  ({ settings, tasks, notes, userPreferences, countdownEvents }, ref) => {
    useEffect(() => {
      if (!ref || typeof ref === "function" || !ref.current) return

      const canvas = ref.current
      const ctx = canvas.getContext("2d", { alpha: false })
      if (!ctx) return

      canvas.width = 1920
      canvas.height = 1080

      const drawContent = () => {
        // Draw background
        if (settings.backgroundType === "image" && settings.backgroundImage) {
          const img = new Image()
          img.crossOrigin = "anonymous"
          img.onload = () => {
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
            drawWidgets()
          }
          img.onerror = () => {
            drawGradientBackground()
            drawWidgets()
          }
          img.src = settings.backgroundImage
        } else {
          drawGradientBackground()
          drawWidgets()
        }
      }

      const drawGradientBackground = () => {
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
        if (settings.theme === "light") {
          gradient.addColorStop(0, "#EEF2FF") // indigo-50
          gradient.addColorStop(0.5, "#FAF5FF") // purple-50
          gradient.addColorStop(1, "#FCE7F3") // pink-50
        } else {
          gradient.addColorStop(0, "#1E1B4B") // indigo-900
          gradient.addColorStop(0.5, "#581C87") // purple-900
          gradient.addColorStop(1, "#1F2937") // gray-800
        }
        ctx.fillStyle = gradient
        ctx.fillRect(0, 0, canvas.width, canvas.height)
      }

      const drawWidgets = () => {
        const opacity = (100 - settings.widgetTransparency) / 100
        const padding = 40
        const widgetGap = 30

        // Calculate layout
        const leftColumnWidth = 350
        const rightColumnWidth = 500
        const centerSpace = canvas.width - leftColumnWidth - rightColumnWidth - padding * 3

        let leftY = padding
        let rightY = padding

        // Draw tasks on the right (largest widget)
        if (settings.showTasks && tasks.length > 0) {
          const tasksHeight = Math.min(canvas.height - padding * 2, 900)
          drawTasksWidget(
            ctx,
            canvas.width - rightColumnWidth - padding,
            rightY,
            rightColumnWidth,
            tasksHeight,
            opacity,
          )
          rightY += tasksHeight + widgetGap
        }

        // Draw widgets on the left
        if (settings.showCalendar) {
          const calendarHeight = 300
          drawCalendar(ctx, padding, leftY, leftColumnWidth, calendarHeight, opacity)
          leftY += calendarHeight + widgetGap
        }

        if (settings.showCountdown && countdownEvents.length > 0) {
          const countdownHeight = 200
          if (leftY + countdownHeight <= canvas.height - padding) {
            drawCountdownWidget(ctx, padding, leftY, leftColumnWidth, countdownHeight, opacity)
            leftY += countdownHeight + widgetGap
          }
        }

        if (settings.showNotes && notes.trim() !== "") {
          const notesHeight = 250
          if (leftY + notesHeight <= canvas.height - padding) {
            drawNotesWidget(ctx, padding, leftY, leftColumnWidth, notesHeight, opacity)
            leftY += notesHeight + widgetGap
          }
        }

        // Draw quote at the bottom center
        if (settings.showQuote) {
          const quoteWidth = Math.max(600, centerSpace)
          const quoteHeight = 120
          drawQuoteWidget(
            ctx,
            canvas.width / 2,
            canvas.height - padding - quoteHeight / 2,
            quoteWidth,
            quoteHeight,
            opacity,
          )
        }
      }

      const drawRoundedRect = (
        ctx: CanvasRenderingContext2D,
        x: number,
        y: number,
        width: number,
        height: number,
        radius: number,
        fill: boolean = true,
        stroke: boolean = false
      ) => {
        ctx.beginPath()
        ctx.roundRect(x, y, width, height, radius)
        if (fill) ctx.fill()
        if (stroke) ctx.stroke()
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
        const currentMonth = today.toLocaleString("default", { month: "long", year: "numeric" })
        const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate()
        const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1).getDay()

        // Background with gradient
        const gradient = ctx.createLinearGradient(x, y, x, y + height)
        if (settings.theme === "light") {
          gradient.addColorStop(0, `rgba(255, 255, 255, ${opacity})`)
          gradient.addColorStop(1, `rgba(249, 250, 251, ${opacity})`)
        } else {
          gradient.addColorStop(0, `rgba(31, 41, 55, ${opacity})`)
          gradient.addColorStop(1, `rgba(17, 24, 39, ${opacity})`)
        }
        ctx.fillStyle = gradient
        drawRoundedRect(ctx, x, y, width, height, 20)

        // Month title
        ctx.font = 'bold 24px "Inter", -apple-system, sans-serif'
        ctx.fillStyle = settings.theme === "light" ? "#1F2937" : "#F9FAFB"
        ctx.textAlign = "center"
        ctx.fillText(currentMonth, x + width / 2, y + 40)

        // Day headers
        const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
        ctx.font = 'bold 14px "Inter", -apple-system, sans-serif'
        ctx.fillStyle = settings.theme === "light" ? "#6B7280" : "#9CA3AF"

        const cellWidth = (width - 40) / 7
        const startX = x + 20

        days.forEach((day, index) => {
          ctx.fillText(day, startX + cellWidth * index + cellWidth / 2, y + 70)
        })

        // Calendar grid
        ctx.font = '16px "Inter", -apple-system, sans-serif'
        const cellHeight = (height - 100) / 6
        let currentDay = 1
        let currentX = startX + (firstDayOfMonth * cellWidth)
        let currentY = y + 90

        for (let week = 0; week < 6 && currentDay <= daysInMonth; week++) {
          for (let day = (week === 0 ? firstDayOfMonth : 0); day < 7 && currentDay <= daysInMonth; day++) {
            const isToday = currentDay === today.getDate()
            
            if (isToday) {
              // Highlight today
              ctx.fillStyle = "#8B5CF6" // purple-500
              ctx.beginPath()
              ctx.arc(currentX + cellWidth / 2, currentY + cellHeight / 2, cellWidth / 3, 0, 2 * Math.PI)
              ctx.fill()
              ctx.fillStyle = "#FFFFFF"
            } else {
              ctx.fillStyle = settings.theme === "light" ? "#1F2937" : "#F9FAFB"
            }

            ctx.textAlign = "center"
            ctx.fillText(currentDay.toString(), currentX + cellWidth / 2, currentY + cellHeight / 2 + 6)
            
            currentDay++
            currentX += cellWidth
          }
          currentX = startX
          currentY += cellHeight
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
        // Background with gradient
        const gradient = ctx.createLinearGradient(x, y, x, y + height)
        if (settings.theme === "light") {
          gradient.addColorStop(0, `rgba(255, 255, 255, ${opacity})`)
          gradient.addColorStop(1, `rgba(249, 250, 251, ${opacity})`)
        } else {
          gradient.addColorStop(0, `rgba(31, 41, 55, ${opacity})`)
          gradient.addColorStop(1, `rgba(17, 24, 39, ${opacity})`)
        }
        ctx.fillStyle = gradient
        drawRoundedRect(ctx, x, y, width, height, 20)

        // Title
        ctx.font = 'bold 28px "Inter", -apple-system, sans-serif'
        ctx.fillStyle = settings.theme === "light" ? "#1F2937" : "#F9FAFB"
        ctx.textAlign = "left"
        ctx.fillText("📋 My Tasks", x + 30, y + 45)

        const categories: { name: Task["category"]; color: string; emoji: string }[] = [
          { name: "PERSONAL", color: "#3B82F6", emoji: "👤" },
          { name: "WORK", color: "#8B5CF6", emoji: "💼" },
          { name: "OTHERS", color: "#10B981", emoji: "📌" },
        ]

        let currentY = y + 80
        const maxTasksPerCategory = 8
        const taskHeight = 45
        const categorySpacing = 20

        categories.forEach((category) => {
          const categoryTasks = tasks.filter((task) => task.category === category.name)
          if (categoryTasks.length === 0) return

          // Category header
          ctx.font = 'bold 20px "Inter", -apple-system, sans-serif'
          ctx.fillStyle = category.color
          ctx.fillText(`${category.emoji} ${category.name}`, x + 30, currentY)
          currentY += 35

          // Draw tasks
          const displayTasks = categoryTasks.slice(0, maxTasksPerCategory)
          displayTasks.forEach((task, index) => {
            if (currentY + taskHeight > y + height - 20) return

            // Task background
            ctx.fillStyle = settings.theme === "light" 
              ? "rgba(243, 244, 246, 0.8)" 
              : "rgba(55, 65, 81, 0.8)"
            drawRoundedRect(ctx, x + 30, currentY - 20, width - 60, taskHeight - 5, 10)

            // Checkbox
            const checkboxSize = 20
            const checkboxX = x + 45
            const checkboxY = currentY - 15
            
            ctx.strokeStyle = category.color
            ctx.lineWidth = 2
            ctx.strokeRect(checkboxX, checkboxY, checkboxSize, checkboxSize)
            
            if (task.completed) {
              ctx.fillStyle = category.color
              ctx.fillRect(checkboxX + 3, checkboxY + 3, checkboxSize - 6, checkboxSize - 6)
            }

            // Task text
            ctx.font = '16px "Inter", -apple-system, sans-serif'
            ctx.fillStyle = task.completed 
              ? (settings.theme === "light" ? "#9CA3AF" : "#6B7280")
              : (settings.theme === "light" ? "#1F2937" : "#F9FAFB")
            ctx.textAlign = "left"
            
            const taskText = task.text.length > 35 ? task.text.substring(0, 35) + "..." : task.text
            ctx.fillText(taskText, checkboxX + 30, currentY)

            // Time indicator
            if (task.time) {
              ctx.font = '14px "Inter", -apple-system, sans-serif'
              ctx.fillStyle = settings.theme === "light" ? "#6B7280" : "#9CA3AF"
              ctx.textAlign = "right"
              ctx.fillText(`⏰ ${task.time}`, x + width - 45, currentY)
            }

            currentY += taskHeight
          })

          if (categoryTasks.length > maxTasksPerCategory) {
            ctx.font = '14px "Inter", -apple-system, sans-serif'
            ctx.fillStyle = settings.theme === "light" ? "#6B7280" : "#9CA3AF"
            ctx.textAlign = "left"
            ctx.fillText(`+${categoryTasks.length - maxTasksPerCategory} more...`, x + 45, currentY)
            currentY += 30
          }

          currentY += categorySpacing
        })

        // Empty state
        if (tasks.length === 0) {
          ctx.font = '18px "Inter", -apple-system, sans-serif'
          ctx.fillStyle = settings.theme === "light" ? "#9CA3AF" : "#6B7280"
          ctx.textAlign = "center"
          ctx.fillText("No tasks yet. Start adding tasks!", x + width / 2, y + height / 2)
        }
      }

      const drawNotesWidget = (
        ctx: CanvasRenderingContext2D,
        x: number,
        y: number,
        width: number,
        height: number,
        opacity: number,
      ) => {
        const gradient = ctx.createLinearGradient(x, y, x, y + height)
        if (settings.theme === "light") {
          gradient.addColorStop(0, `rgba(255, 255, 255, ${opacity})`)
          gradient.addColorStop(1, `rgba(254, 252, 232, ${opacity})`)
        } else {
          gradient.addColorStop(0, `rgba(31, 41, 55, ${opacity})`)
          gradient.addColorStop(1, `rgba(30, 41, 59, ${opacity})`)
        }
        ctx.fillStyle = gradient
        drawRoundedRect(ctx, x, y, width, height, 20)

        ctx.font = 'bold 22px "Inter", -apple-system, sans-serif'
        ctx.fillStyle = settings.theme === "light" ? "#1F2937" : "#F9FAFB"
        ctx.textAlign = "left"
        ctx.fillText("📝 Notes", x + 25, y + 40)

        ctx.font = '16px "Inter", -apple-system, sans-serif'
        ctx.fillStyle = settings.theme === "light" ? "#4B5563" : "#D1D5DB"
        
        const maxWidth = width - 50
        const lineHeight = 24
        const words = notes.split(" ")
        let line = ""
        let noteY = y + 75

        for (let i = 0; i < words.length; i++) {
          const testLine = line + words[i] + " "
          const metrics = ctx.measureText(testLine)

          if (metrics.width > maxWidth && i > 0) {
            ctx.fillText(line, x + 25, noteY)
            line = words[i] + " "
            noteY += lineHeight
            if (noteY > y + height - 30) {
              ctx.fillText("...", x + 25, noteY)
              break
            }
          } else {
            line = testLine
          }
        }
        if (noteY <= y + height - 30) {
          ctx.fillText(line, x + 25, noteY)
        }
      }

      const drawCountdownWidget = (
        ctx: CanvasRenderingContext2D,
        x: number,
        y: number,
        width: number,
        height: number,
        opacity: number,
      ) => {
        const gradient = ctx.createLinearGradient(x, y, x + width, y + height)
        if (settings.theme === "light") {
          gradient.addColorStop(0, `rgba(254, 243, 199, ${opacity})`)
          gradient.addColorStop(1, `rgba(252, 231, 243, ${opacity})`)
        } else {
          gradient.addColorStop(0, `rgba(30, 41, 59, ${opacity})`)
          gradient.addColorStop(1, `rgba(88, 28, 135, ${opacity})`)
        }
        ctx.fillStyle = gradient
        drawRoundedRect(ctx, x, y, width, height, 20)

        if (countdownEvents.length === 0) return

        const event = countdownEvents[0]
        const daysLeft = calculateDaysLeft(event.date)

        ctx.font = 'bold 20px "Inter", -apple-system, sans-serif'
        ctx.fillStyle = settings.theme === "light" ? "#1F2937" : "#F9FAFB"
        ctx.textAlign = "center"
        ctx.fillText("⏳ " + event.title, x + width / 2, y + 40)

        ctx.font = 'bold 48px "Inter", -apple-system, sans-serif'
        ctx.fillStyle = "#F59E0B" // amber-500
        ctx.fillText(`${daysLeft}`, x + width / 2, y + 110)

        ctx.font = '18px "Inter", -apple-system, sans-serif'
        ctx.fillStyle = settings.theme === "light" ? "#6B7280" : "#D1D5DB"
        ctx.fillText(`${daysLeft === 1 ? "day" : "days"} remaining`, x + width / 2, y + 145)
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

        const gradient = ctx.createLinearGradient(x - width / 2, y - height / 2, x + width / 2, y + height / 2)
        if (settings.theme === "light") {
          gradient.addColorStop(0, `rgba(255, 255, 255, ${opacity * 0.95})`)
          gradient.addColorStop(1, `rgba(243, 244, 246, ${opacity * 0.95})`)
        } else {
          gradient.addColorStop(0, `rgba(31, 41, 55, ${opacity * 0.95})`)
          gradient.addColorStop(1, `rgba(17, 24, 39, ${opacity * 0.95})`)
        }
        ctx.fillStyle = gradient
        drawRoundedRect(ctx, x - width / 2, y - height / 2, width, height, 20)

        ctx.font = 'italic 20px "Inter", -apple-system, sans-serif'
        ctx.fillStyle = settings.theme === "light" ? "#1F2937" : "#F9FAFB"
        ctx.textAlign = "center"
        
        const maxWidth = width - 60
        const words = text.split(" ")
        let line = ""
        let quoteY = y - 20

        for (let i = 0; i < words.length; i++) {
          const testLine = line + words[i] + " "
          const metrics = ctx.measureText(testLine)

          if (metrics.width > maxWidth && i > 0) {
            ctx.fillText(`"${line.trim()}"`, x, quoteY)
            line = words[i] + " "
            quoteY += 28
          } else {
            line = testLine
          }
        }
        ctx.fillText(`"${line.trim()}"`, x, quoteY)

        ctx.font = 'normal 16px "Inter", -apple-system, sans-serif'
        ctx.fillStyle = settings.theme === "light" ? "#6B7280" : "#9CA3AF"
        ctx.fillText(`— ${author}`, x, y + 35)
      }

      const calculateDaysLeft = (dateString: string) => {
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        const eventDate = new Date(dateString)
        eventDate.setHours(0, 0, 0, 0)
        const timeDiff = eventDate.getTime() - today.getTime()
        return Math.ceil(timeDiff / (1000 * 3600 * 24))
      }

      drawContent()
    }, [settings, tasks, notes, userPreferences, countdownEvents, ref])

    return <canvas ref={ref} className="w-full h-auto rounded-xl border-4 border-white/30 shadow-2xl" />
  },
)

WallpaperPreview.displayName = "WallpaperPreview"
