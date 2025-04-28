"use client"

import { useState, useEffect } from "react"
import { FocusWall } from "../components/FocusWall"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Clock, Layout, Palette, Target } from "lucide-react"
import { SignIn } from "../components/SignIn"
import { useRouter } from "next/navigation"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

const features = [
  { icon: Calendar, title: "Task Management", description: "Organize your tasks efficiently" },
  { icon: Clock, title: "Time Tracking", description: "Monitor your productivity" },
  { icon: Layout, title: "Customizable Layout", description: "Arrange your workspace as you like" },
  { icon: Palette, title: "Personalized Themes", description: "Choose colors that inspire you" },
  { icon: Target, title: "Goal Setting", description: "Set and achieve your objectives" },
]

const stats = [
  { label: "Active Users", value: "10,000+" },
  { label: "Tasks Completed", value: "1,000,000+" },
]

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const supabase = createClientComponentClient()

  useEffect(() => {
    async function checkSession() {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession()
        setIsAuthenticated(!!session)
      } catch (error) {
        console.error("Error checking session:", error)
      } finally {
        setIsLoading(false)
      }
    }

    checkSession()
  }, [supabase.auth])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
      </div>
    )
  }

  if (isAuthenticated) {
    return <FocusWall />
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-200 to-yellow-400">
      <header className="bg-black text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-4xl font-bold">FocusWall</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <section className="text-center mb-12">
          <h2 className="text-5xl font-bold mb-4">Transform Your Productivity</h2>
          <p className="text-xl mb-8">Create beautiful, customized wallpapers that keep you focused and organized.</p>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Get Started with FocusWall</CardTitle>
            </CardHeader>
            <CardContent>
              <SignIn />
            </CardContent>
          </Card>
          <Card className="h-full">
            <CardHeader>
              <CardTitle>What People Are Saying</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-4 bg-gray-100 rounded-lg">
                <p className="italic">
                  "FocusWall has completely transformed how I organize my day. The visual reminders keep me on track!"
                </p>
                <p className="text-right mt-2">- Sarah J., Product Manager</p>
              </div>
              <div className="p-4 bg-gray-100 rounded-lg mt-4">
                <p className="italic">
                  "I love how I can customize my wallpaper to show exactly what I need. Game changer for productivity!"
                </p>
                <p className="text-right mt-2">- Michael T., Developer</p>
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="mb-12">
          <h3 className="text-3xl font-bold mb-6 text-center">Top Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {features.map((feature, index) => (
              <Card key={index}>
                <CardHeader>
                  <feature.icon className="w-8 h-8 mb-2" />
                  <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section>
          <h3 className="text-3xl font-bold mb-6 text-center">FocusWall by the Numbers</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {stats.map((stat, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle>{stat.label}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-4xl font-bold">{stat.value}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </main>

      <footer className="bg-black text-white p-4 mt-12">
        <div className="container mx-auto text-center">
          <p>&copy; 2023 FocusWall. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
