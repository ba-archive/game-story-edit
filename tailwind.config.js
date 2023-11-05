/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      boxShadow: {
        "y-upper": "0px 8px 20px #e5e6eb",
      },
    },
  },
  plugins: [],
};
