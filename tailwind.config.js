/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'background': '#ffffff', // Pure white background
        'surface': '#f8f9fa',    // Slightly off-white for cards/sections
        'primary': '#0d9488',    // A strong, elegant teal for accents
        'text-primary': '#1f2937',  // A dark slate for main text
        'text-secondary': '#6b7280', // A medium gray for supporting text
      },
    },
  },
  plugins: [],
}

