export interface WeatherData {
  daily: {
    time: string[]
    temperature_2m_max: number[]
    temperature_2m_min: number[]
    weathercode: number[]
  }
}

export interface WeatherLocation {
  latitude: number
  longitude: number
}
