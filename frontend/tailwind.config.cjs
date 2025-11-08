/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'page-bg': '#e6f5f2', // <-- ADDED THIS LINE
        'navy': {
          'light': '#3a5a8a',
          'DEFAULT': '#2c4a75',
          'dark': '#1e3a60',
        },
        'sky': {
          'light': '#a0d8f0',
          'DEFAULT': '#7bc8e8',
          'dark': '#52b8e0',
        },
        'compliance-green': '#10b981',
        'compliance-red': '#ef4444',
      }
    },
  },
  plugins: [],
}