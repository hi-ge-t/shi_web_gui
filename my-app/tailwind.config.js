/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./public/index.html",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        orbitron: ['Orbitron', 'ui-sans-serif', 'system-ui'],
      },
    },
  },
  plugins: [],
};