/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        aws: {
          navy: '#0f1b2a',
          dark: '#161e2e',
          card: '#1e293b',
          border: '#334155',
          orange: '#ff9900',
          orangeHover: '#ec8b00',
          blue: '#0073bb',
          cyan: '#00a4e4',
          accent: '#232f3e'
        }
      }
    },
  },
  plugins: [],
}
