/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui']
      },
      colors: {
        brand: {
          blue: '#1D4ED8',
          green: '#22C55E',
          red: '#EF4444',
          yellow: '#FBBF24',
          darkgreen: '#14532D',
          brown: '#854D0E',
          darkred: '#991B1B'
        }
      }
    }
  },
  plugins: []
}