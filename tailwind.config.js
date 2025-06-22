/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'poppins': ['Poppins', 'sans-serif'],
        'helvetica': ['Helvetica', 'Arial', 'sans-serif'],
      },
      colors: {
        'custom': '#fb9548',
        'ivory-50': '#fefefe',
      },
      maxWidth: {
        '8xl': '88rem',
      },
      borderRadius: {
        'button': '0.375rem',
      },
    },
  },
  plugins: [],
} 