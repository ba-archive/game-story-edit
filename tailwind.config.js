/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      boxShadow: {
        'y-upper': '0px -2px 5px #e5e6eb1a',
      }
    },
  },
  plugins: [],
}

