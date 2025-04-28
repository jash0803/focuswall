"use client"

import { useState, useEffect } from "react"
import type { WeatherData, WeatherLocation } from "../types/weather"

export function useWeather() {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null)
  const [location, setLocation] = useState<WeatherLocation | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Get user's location
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          })
        },
        (error) => {
          setError("Unable to get location: " + error.message)
        },
      )
    } else {
      setError("Geolocation is not supported by your browser")
    }
  }, [])

  useEffect(() => {
    if (location) {
      const fetchWeather = async () => {
        try {
          const response = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${location.latitude}&longitude=${location.longitude}&daily=weathercode,temperature_2m_max,temperature_2m_min&timezone=auto`,
          )

          if (!response.ok) {
            throw new Error("Weather data fetch failed")
          }

          const data = await response.json()
          setWeatherData(data)
        } catch (err) {
          setError("Failed to fetch weather data")
        }
      }

      fetchWeather()
    }
  }, [location])

  return { weatherData, error }
}
