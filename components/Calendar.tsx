export function Calendar() {
  const today = new Date()
  const currentMonth = today.toLocaleString("default", { month: "long" })
  const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate()
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1).getDay()

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1)
  const weeks = []
  let week = Array(7).fill(null)

  // Fill in the first week
  for (let i = firstDayOfMonth; i < 7; i++) {
    week[i] = days.shift()
  }
  weeks.push(week)

  // Fill in the rest of the weeks
  while (days.length > 0) {
    week = Array(7).fill(null)
    for (let i = 0; i < 7 && days.length > 0; i++) {
      week[i] = days.shift()
    }
    weeks.push(week)
  }

  return (
    <div className="bg-white/80 backdrop-blur-md rounded-xl p-4 border-2 border-white/50">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-purple-700">{currentMonth.toUpperCase()}</h3>
      </div>
      <div className="grid grid-cols-7 gap-2">
        {["S", "M", "T", "W", "T", "F", "S"].map((day, i) => (
          <div key={i} className="text-center text-sm text-purple-600 font-medium">
            {day}
          </div>
        ))}
        {weeks.map((week, weekIndex) =>
          week.map((day, dayIndex) => (
            <div
              key={`${weekIndex}-${dayIndex}`}
              className={`
                text-center p-1 text-sm rounded-full
                ${day === today.getDate() ? "bg-purple-500 text-white" : "text-gray-600"}
                ${day === null ? "invisible" : ""}
              `}
            >
              {day}
            </div>
          )),
        )}
      </div>
    </div>
  )
}
