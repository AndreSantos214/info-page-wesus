/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        playfair: ["Playfair Display", "serif"],
        inter: ["Inter", "sans-serif"],
      },
      colors: {
        wesus: {
          DEFAULT: "#061325",
          dark: "#071326",
        },
        gold: {
          DEFAULT: "#c5a059",
          light: "#e8d08d",
          liquid: "#f5e3b5",
        },
      },
    },
  },
  plugins: [],
};
