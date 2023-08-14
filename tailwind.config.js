/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme');
module.exports = {
  content: ["./app/**/*.{js,ts,tsx,jsx}"],
  theme: {
    extend: {},
    screens: {
      'ld': '900px',
      ...defaultTheme.screens,
    },
    fontFamily: {
      roboto: ['Roboto'],
      inter: ['Inter']
    },
  },
  plugins: [],
}
