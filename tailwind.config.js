/** @type {import('tailwindcss').Config} */
const colors = require('./data.ts').colors;
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors,
      fontSize: {

      },
      container: {
        padding: '1.5rem'
      },
    }
  },
  plugins: [],
}
