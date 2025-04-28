"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

interface LayoutProps {
  children: React.ReactNode
  showProfile: boolean
  setShowProfile: (show: boolean) => void
  theme: "light" | "dark"
  toggleTheme: () => void
}

export function Layout({ children, showProfile, setShowProfile, theme, toggleTheme }: LayoutProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const authStatus = localStorage.getItem("isAuthenticated")
    if (authStatus !== "true") {
      router.push("/")
    } else {
      setIsAuthenticated(true)
    }
  }, [router])

  if (!isAuthenticated) {
    return null // or a loading spinner
  }

  return (
    <div className="min-h-screen flex flex-col bg-yellow-200">
      <main className="flex-grow container mx-auto p-4">{children}</main>
    </div>
  )
}
