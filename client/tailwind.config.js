// /client/tailwind.config.js

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-dark': '#2E3A23', // Dark olive green
        'brand-light': '#F5F0E6', // Muted beige
        'brand-primary': '#5A7D4B', // Softer green
        'brand-secondary': '#4A4A4A', // Dark gray
        'brand-accent': '#B8860B', // Gold/Brass accent
      },
      fontFamily: {
        // Using a clean, modern sans-serif
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'), // A plugin for better form styling
  ],
}