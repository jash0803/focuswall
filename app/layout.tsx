import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'FocusWall - Create Beautiful Productivity Wallpapers',
  description: 'Free productivity wallpaper creator with tasks, notes, calendar, and countdown widgets. Design your perfect focus wallpaper.',
  keywords: 'productivity, wallpaper, focus, tasks, todo, calendar, notes, countdown',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  )
}
