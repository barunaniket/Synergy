/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'background': '#ffffff',
        'surface': '#f8f9fa',
        'primary': '#0d9488',
        'text-primary': '#1f2937',
        'text-secondary': '#6b7280',
        
        // Add these for dark mode
        'dark-background': '#000000',
        'dark-surface': '#111111',
        'dark-text-primary': '#f8f9fa',
        'dark-text-secondary': '#a1a1aa',
      },
    },
  },
  plugins: [],
}