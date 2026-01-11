/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        // Primary - Warm Leaf Green (자연스러운 잎사귀 그린)
        primary: {
          50: '#f6fff0',
          100: '#e8ffd9',
          200: '#d1ffb3',
          300: '#a8f06b',
          400: '#7ed942',
          500: '#5cb82f',
          600: '#479424',
          700: '#37711c',
          800: '#2d5a1a',
          900: '#274c19',
        },
        // Accent - Warm Sunset Orange (포인트 색상)
        accent: {
          50: '#fff8ed',
          100: '#ffefd4',
          200: '#ffdba8',
          300: '#ffc170',
          400: '#ff9f38',
          500: '#ff8211',
          600: '#f06806',
          700: '#c74d07',
          800: '#9e3d0e',
          900: '#7f340f',
        },
        // Surface - Warm Cream (배경)
        cream: {
          50: '#fffef7',
          100: '#fffbeb',
          200: '#fff5d6',
          300: '#ffe9b3',
        },
        // Earth - 자연스러운 브라운 (보조)
        earth: {
          100: '#faf5ef',
          200: '#f0e6d8',
          300: '#e0d0bd',
          400: '#c9b69e',
          500: '#a89274',
        },
      },
    },
  },
  plugins: [],
};
