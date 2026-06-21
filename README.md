# Harbor & Key - Client

This is the Next.js frontend for the Harbor & Key Property Rental & Booking Platform.

## 🚀 Built With

- **Next.js (App Router)** - The React framework for production.
- **HeroUI** - Beautiful, fast, and modern React UI library.
- **Tailwind CSS** - A utility-first CSS framework for rapid UI development.
- **Framer Motion** - An open source motion library for React.
- **Recharts** - A composable charting library built on React components.
- **Better Auth** - Comprehensive authentication.

## 🏃‍♂️ Getting Started

1. Set up the environment variables:
   ```bash
   cp .env.example .env.local
   ```
   Fill in the required variables (`NEXT_PUBLIC_API_URL`, `BETTER_AUTH_URL`).

2. Run the development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📁 Directory Structure

- `src/app` - App Router pages and layouts.
- `src/components` - Reusable UI components.
- `src/lib` - Utility functions, fetchers, and authentication config.
