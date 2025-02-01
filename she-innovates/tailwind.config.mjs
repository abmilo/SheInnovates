/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        pittBlue: 'var(--pittBlue)',
        pittYellow: 'var(--pittYellow)',
      },
    },
  },
  plugins: [],
}
