/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",  // ← ESTO ES CRÍTICO
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#F5F7FA',
          100: '#E4E9F2',
          200: '#C9D3E5',
          300: '#9FB3D4',
          400: '#6B8EC7',
          500: '#4A6FA5',
          600: '#3A5687',
          700: '#2E436B',
          800: '#1F2D47',
          900: '#0F1823',
        },
        accent: {
          400: '#FF6B35',
          500: '#FF5722',
          600: '#E64A19',
        },
        dark: {
          50: '#F8F9FA',
          100: '#E9ECEF',
          200: '#DEE2E6',
          300: '#CED4DA',
          400: '#ADB5BD',
          500: '#6C757D',
          600: '#495057',
          700: '#343A40',
          800: '#212529',
          900: '#0D1117',
          950: '#010409',
        }
      },
      fontFamily: {
        display: ['Outfit', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}