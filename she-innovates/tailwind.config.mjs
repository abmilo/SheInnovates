/** @type {import('tailwindcss').Config} */
export default {
    darkMode: ["class"],
    content: [
    "./app/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
  	extend: {
  		colors: {
  			pittBlue: 'var(--pittBlue)',
  			pittYellow: 'var(--pittYellow)'
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
}
