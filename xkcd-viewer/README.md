# XKCD Viewer

A modern web application for browsing XKCD comics with a sleek UI and smooth user experience.

## Features

- Browse XKCD comics with an elegant interface
- Navigate between comics (previous, next, first, latest)
- Dark/light theme toggle with persistent settings
- Comic list panel for quick navigation
- Interactive 3D comic viewing experience
- Like functionality with local storage persistence
- Responsive design for all device sizes
- Zoom in/out capability for detailed viewing
- Additional comic information (transcript, news, etc.)

## Getting Started

First, install the dependencies:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

- `app/page.tsx` - Main page component with XKCD viewer UI
- `app/api/xkcd/[comicId]/route.ts` - API route for fetching XKCD comics
- `types/xkcd.ts` - TypeScript interfaces for XKCD comic data
- `app/globals.css` - Global styles and theme definitions

## Technical Details

This application is built with:

- [Next.js 15](https://nextjs.org/) - React framework with App Router
- [React 19](https://reactjs.org/) - UI library
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework

The app fetches XKCD comic data from the official XKCD JSON API and provides a rich browsing experience with features like:

- Smooth theme transitions between light and dark modes
- 3D comic viewing with mouse movement interaction
- Persistent user preferences (theme, likes) in local storage
- Responsive design for mobile and desktop
- Comic list panel with dynamic loading

## Learn More

To learn more about the technologies used in this project:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API
- [React Documentation](https://reactjs.org/docs/getting-started.html) - learn about React concepts
- [TypeScript Documentation](https://www.typescriptlang.org/docs/) - learn about TypeScript
- [Tailwind CSS Documentation](https://tailwindcss.com/docs) - learn about Tailwind CSS

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
