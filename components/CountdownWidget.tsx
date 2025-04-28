import type { CountdownEvent } from "../types"

interface CountdownWidgetProps {
  event?: CountdownEvent
}

export function CountdownWidget({ event }: CountdownWidgetProps) {
  if (!event) {
    return (
      <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border-4 border-black dark:border-white">
        <p className="text-lg font-semibold text-black dark:text-white">No upcoming events</p>
      </div>
    )
  }

  const calculateDaysLeft = () => {
    const today = new Date()
    const eventDate = new Date(event.date)
    const timeDiff = eventDate.getTime() - today.getTime()
    const daysLeft = Math.ceil(timeDiff / (1000 * 3600 * 24))
    return daysLeft
  }

  const daysLeft = calculateDaysLeft()

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border-4 border-black dark:border-white">
      <h3 className="text-lg font-semibold text-black dark:text-white mb-2">{event.title}</h3>
      <p className="text-3xl font-bold text-black dark:text-white">
        {daysLeft} {daysLeft === 1 ? "day" : "days"} left
      </p>
      <p className="text-sm text-gray-600 dark:text-gray-400">Until {event.date}</p>
    </div>
  )
}
