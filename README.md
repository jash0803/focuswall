# 🎨 FocusWall - Free Productivity Wallpaper Creator

Create beautiful, customized desktop wallpapers with your tasks, notes, calendar, and more - completely free, no authentication required!

## ✨ Features

### 🎯 **Task Management**
- Add, edit, and organize tasks across three categories (Personal, Work, Others)
- Set deadlines and times for each task
- Drag and drop to reorder tasks
- Check off completed tasks
- All tasks appear beautifully on your wallpaper

### 📝 **Quick Notes**
- Add notes that display on your wallpaper
- Perfect for reminders, inspirational quotes, or important information

### 📅 **Calendar Widget**
- Shows current month with today's date highlighted
- Automatically updates daily

### ⏰ **Countdown Events**
- Track important dates and deadlines
- See days remaining at a glance
- Perfect for project milestones, birthdays, or special events

### 💭 **Daily Motivational Quotes**
- Automatically rotates through inspiring quotes
- Different quote each day to keep you motivated

### 🎨 **Full Customization**
- **Background Options:**
  - Beautiful gradients (light/dark themes)
  - Custom image URLs
  - Upload your own images
- **Widget Control:**
  - Show/hide any widget
  - Adjust transparency for perfect readability
- **Theme Support:**
  - Light and dark modes
  - Smooth transitions

### 📊 **Profile & Analytics**
- Track completed vs pending tasks
- 7-day activity chart
- Completion rate percentage
- Customize date format, time format, and language

### 💾 **Local Storage**
- All your data is saved locally in your browser
- No account needed
- Privacy-first approach

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and pnpm (or npm)

### Installation

1. **Clone the repository:**
```bash
git clone <your-repo-url>
cd focuswall
```

2. **Install dependencies:**
```bash
pnpm install
# or
npm install
```

3. **Run the development server:**
```bash
pnpm dev
# or
npm run dev
```

4. **Open your browser:**
Navigate to [http://localhost:3000](http://localhost:3000)

## 🎯 How to Use

### Creating Your First Wallpaper

1. **Add Your Tasks:**
   - Click the "Tasks" section
   - Enter task name, optional time, and select category
   - Press Enter or click "Add" button

2. **Customize Your Wallpaper:**
   - Go to the "Settings" tab in the Customization panel
   - Choose background type (Gradient, Image URL, or Upload)
   - Select light or dark theme
   - Adjust widget transparency

3. **Add Notes & Events:**
   - Write quick notes in the "Quick Notes" widget
   - Add countdown events for important dates

4. **Toggle Widgets:**
   - Use the "Widgets" tab to show/hide specific widgets
   - Customize what appears on your wallpaper

5. **Download Your Wallpaper:**
   - Scroll to the preview section
   - Click "Download Wallpaper (1920x1080)"
   - Your custom wallpaper will download in HD quality!

### Tips for Best Results

- **Use High-Quality Images:** When uploading or linking images, use high-resolution images (1920x1080 or higher)
- **Adjust Transparency:** If text is hard to read, adjust widget transparency for better contrast
- **Organize Tasks:** Use the three categories to keep your tasks organized
- **Regular Updates:** Download a fresh wallpaper daily with updated tasks and quotes

## 🛠️ Tech Stack

- **Framework:** Next.js 15.2.4 (App Router)
- **UI Library:** React 19
- **Styling:** Tailwind CSS
- **UI Components:** Radix UI + Custom Components
- **Charts:** Recharts
- **Drag & Drop:** react-beautiful-dnd
- **Language:** TypeScript

## 📁 Project Structure

```
focuswall/
├── app/                    # Next.js app directory
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── FocusWall.tsx     # Main application component
│   ├── TaskList.tsx      # Task management
│   ├── WallpaperPreview.tsx  # Canvas wallpaper renderer
│   ├── WallpaperCustomizer.tsx
│   ├── NotesWidget.tsx
│   ├── CountdownEvents.tsx
│   ├── ProfilePage.tsx
│   ├── WidgetVisibility.tsx
│   └── ui/               # Reusable UI components
├── hooks/                # Custom React hooks
│   └── useTasks.ts
├── types/                # TypeScript type definitions
│   └── index.ts
└── public/               # Static assets
```

## 🎨 Customization Options

### Background Types

1. **Gradient** - Beautiful predefined gradients that match your theme
2. **Image URL** - Use any image URL (try Unsplash for free high-quality images)
3. **Upload** - Upload your own background image

### Widget Options

- ✅ Tasks Display
- 📅 Calendar
- 📝 Notes
- ⏳ Countdown Events
- 💭 Daily Quote

### Theme Options

- ☀️ Light Theme - Clean and bright
- 🌙 Dark Theme - Easy on the eyes

## 🔒 Privacy

FocusWall respects your privacy:
- **No Authentication Required** - Use freely without creating an account
- **Local Storage Only** - All data is stored in your browser
- **No Tracking** - We don't collect or track any user data
- **No Servers** - Everything runs client-side in your browser

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest new features
- Submit pull requests

## 📝 License

This project is free to use for personal and commercial purposes.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [Radix UI](https://www.radix-ui.com/)
- Icons from [Lucide](https://lucide.dev/)

## 📧 Support

For questions, issues, or feature requests, please open an issue on GitHub.

---

**Made with ❤️ for productivity enthusiasts everywhere**

Enjoy creating beautiful, functional wallpapers that keep you focused and organized! 🎉

