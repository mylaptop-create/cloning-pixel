/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          bg: '#0c0d0e',
          card: '#131517',
          border: '#222529',
          hover: '#1a1d21',
          text: '#ededed',
          muted: '#888888'
        },
        brand: {
          primary: '#9fe870',
          active: '#cdffad',
          dark: '#163300',
          accent: '#38c8ff'
        }
      }
    },
  },
  plugins: [],
}
