/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eef4ff",
          100: "#d9e6ff",
          500: "#3b5bdb",
          600: "#2f49b0",
          700: "#243a8a",
        },
      },
    },
  },
  plugins: [],
};
