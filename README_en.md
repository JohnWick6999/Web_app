# XKCD Viewer Application

A modern XKCD comic browser application with smooth user experience and rich interactive features.

## Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Development Guide](#development-guide)
- [API Interface](#api-interface)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## Features

### Core Features
- 📖 Browse XKCD Comics: Fetch and display XKCD comics via official API
- 🔍 Navigation Controls: Support navigation to first, previous, next, and latest comics
- 🔢 Custom Navigation: Jump to a specific comic by entering its number
- 💾 Data Persistence: Save user preferences using localStorage

### User Interface
- 🌗 Dark/Light Theme Toggle: Switch interface themes with one click and auto-save settings
- 🔍 Comic Zooming: Support zooming in/out for better viewing experience
- 🔄 3D Interactive Effects: Create stereoscopic rotation effects on mouse hover
- 📱 Responsive Design: Adapt to various screen sizes, including mobile devices
- 📋 Comic List Panel: Sidebar showing comic list for quick navigation

### Social Features
- ❤️ Like System: Like your favorite comics and track like counts
- ℹ️ Additional Information: Display detailed information such as publication date, news, and transcripts

## Tech Stack

This project uses the following technologies and tools:

| Category | Technology |
|----------|------------|
| Framework | [Next.js 15](https://nextjs.org/) (App Router) |
| Language | [React 19](https://reactjs.org/), [TypeScript](https://www.typescriptlang.org/) |
| Styling | [Tailwind CSS](https://tailwindcss.com/), CSS Modules |
| Fonts | [Geist Font Family](https://vercel.com/font) |
| Build Tool | Turbopack |
| Package Manager | npm |

## Project Structure

```
xkcd-viewer/
├── app/                    # Application source code
│   ├── api/               # API routes
│   │   └── xkcd/
│   │       └── [comicId]/ # Comic API endpoint
│   │           └── route.ts
│   ├── layout.tsx         # Root layout component
│   └── page.tsx           # Main page component
├── public/                # Static assets
├── types/                 # TypeScript type definitions
│   └── xkcd.ts           # XKCD comic data interface
├── README.md             # Project documentation
├── next.config.ts        # Next.js configuration file
├── tailwind.config.ts    # Tailwind configuration file
└── tsconfig.json         # TypeScript configuration file
```

## Getting Started

### Requirements
- Node.js 18.17 or higher
- npm or yarn package manager

### Installation Steps

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd xkcd-viewer
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Visit [http://localhost:3000](http://localhost:3000) in your browser

### Production Build

```bash
# Build for production
npm run build

# Start production server
npm run start
```

## Development Guide

### Component Architecture

The main application component is located at [app/page.tsx](./xkcd-viewer/app/page.tsx), which contains all UI logic and state management:

- **State Management**: Using React's native useState and useReducer for state management
- **Side Effects**: Handling component lifecycle events through useEffect
- **Data Fetching**: Using fetch API to call internal API routes to get comic data

### Styling System

The project combines Tailwind CSS with custom CSS:

- Global styles defined in [app/globals.css](./xkcd-viewer/app/globals.css)
- Responsive design implemented through Tailwind's breakpoint system
- Dark mode implemented via CSS variables and class name switching

### Theme Switching

The application supports dark and light themes:

1. Theme switches when user clicks the theme toggle button
2. User preferences are saved in localStorage
3. Saved theme settings are checked and applied on page load

### 3D Interactive Effects

Comic images feature 3D interactive effects:

1. Rotation effects are created when the mouse moves over the comic
2. Clicking the "Zoom In" button enlarges the comic
3. All effects are implemented through CSS transform properties

## API Interface

### Fetch Comic Data

```
GET /api/xkcd/[comicId]
```

Parameters:
- `comicId`: Comic ID or "latest" for the latest comic

Response Example:
```json
{
  "month": "10",
  "num": 2999,
  "link": "",
  "year": "2025",
  "news": "",
  "safe_title": "Future Tech",
  "transcript": "",
  "alt": "In the future, all tech support will be handled by AI that speaks only in haikus.",
  "img": "https://imgs.xkcd.com/comics/future_tech.png",
  "title": "Future Tech",
  "day": "15"
}
```

## Deployment

### Vercel (Recommended)

Since this project is based on Next.js, the easiest deployment method is using [Vercel](https://vercel.com/new):

1. Push code to GitHub/GitLab/Bitbucket
2. Import project in Vercel
3. Set environment variables (if needed)
4. Click deploy

### Other Platforms

You can also deploy to other platforms that support Node.js:

```bash
# Install dependencies
npm install

# Build the application
npm run build

# Start production server
npm run start
```

## Contributing

Issues and Pull Requests are welcome to help improve this project!

### Development Workflow

1. Fork this repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Code Standards

- Write type-safe code using TypeScript
- Follow the existing code style in the project
- Add appropriate comments to explain complex logic
- Ensure all tests pass

## License

This project is for learning and reference purposes only.

---

Created by Peter Sun, with special thanks to Tim's guidance.