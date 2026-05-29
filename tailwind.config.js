/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",  // ← ESTO ES CRÍTICO
  ],
  theme: {
    screens: {
      'xs': '390px',
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
      '3xl': '1920px',
    },
    extend: {
      colors: {
        // ── PALETA DE MARCA: #F7A13D como color base (brand amber) ──
        orange: {
          50:  '#FFF8EE',
          100: '#FEEFD6',
          200: '#FDDCAA',
          300: '#FCC578',
          400: '#F9B356',
          500: '#F7A13D', // ← Color de marca exacto
          600: '#E88A1E', // ← Tono oscuro principal (reemplaza ea580c)
          700: '#C46E10',
          800: '#9A5209',
          900: '#6B3605',
          950: '#3D1E02',
        },
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