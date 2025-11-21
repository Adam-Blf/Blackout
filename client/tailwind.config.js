/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'casino-green': '#0a5c36',
        'casino-red': '#8a1c1c',
        'gold': '#ffd700',
      }
    },
  },
  plugins: [],
}