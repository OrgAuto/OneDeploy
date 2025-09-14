/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // Adjust if you have other file types like tsx
  ],
  theme: {
    extend: {
      colors: {
        // Optional: You can extend your color palette to match the design
        violet: {
          50: '#F5F3FF',
          100: '#D3C7FF',
          200: '#9F8BFF',
          300: '#7B4EFF',
          400: '#5A2BFF',
          500: '#3F1EFF',
          600: '#3200E5',
          700: '#2900B8',
          800: '#1D006F',
          900: '#13004A',
        }
      },
    },
  },
  plugins: [],
}
