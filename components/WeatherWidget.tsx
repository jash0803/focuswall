import { useWeather } from "../hooks/useWeather"

interface WeatherWidgetProps {
  opacity: number
  theme: "light" | "dark"
}

const getWeatherEmoji = (code: number): string => {
  // WMO Weather interpretation codes (WW)
  if (code === 0) return "☀️" // Clear sky
  if (code <= 3) return "🌤️" // Partly cloudy
  if (code <= 49) return "☁️" // Cloudy
  if (code <= 69) return "🌧️" // Rain
  if (code <= 79) return "🌨️" // Snow
  if (code <= 99) return "⛈️" // Thunderstorm
  return "❓"
}

export function WeatherWidget({ opacity, theme }: WeatherWidgetProps) {
  const { weatherData, error } = useWeather()

  if (error) {
    return (
      <div className="bg-white/80 backdrop-blur-md rounded-xl p-4 border-2 border-white/50">
        <p className="text-red-500">{error}</p>
      </div>
    )
  }

  if (!weatherData) {
    return (
      <div className="bg-white/80 backdrop-blur-md rounded-xl p-4 border-2 border-white/50">
        <p>Loading weather data...</p>
      </div>
    )
  }

  return (
    <div className="bg-white/80 backdrop-blur-md rounded-xl p-4 border-2 border-white/50">
      <h3 className="text-lg font-semibold text-purple-700 mb-4">7-Day Forecast</h3>
      <div className="grid grid-cols-7 gap-2">
        {weatherData.daily.time.map((date, index) => (
          <div key={date} className="text-center">
            <div className="text-sm text-purple-600 font-medium">
              {new Date(date).toLocaleDateString("en-US", { weekday: "short" })}
            </div>
            <div className="text-2xl my-1">{getWeatherEmoji(weatherData.daily.weathercode[index])}</div>
            <div className="text-sm font-medium">
              <span className="text-red-500">{Math.round(weatherData.daily.temperature_2m_max[index])}°</span>
              {" / "}
              <span className="text-blue-500">{Math.round(weatherData.daily.temperature_2m_min[index])}°</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
