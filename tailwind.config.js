import { heroui } from "@heroui/theme";

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        drafting: "#F8FAFC",
        ink: "#0F172A",
        blueprint: "#2563EB",
        plaster: "#F1F5F9",
        arch: "#94A3B8",
        highlight: "#FBBF24",
      },
      fontFamily: {
        display: ["var(--font-space-grotesk)", "sans-serif"],
        sans: ["var(--font-inter)", "sans-serif"],
        mono: ["var(--font-space-mono)", "monospace"],
      }
    },
  },
  darkMode: "class",
  plugins: [heroui()],
};
