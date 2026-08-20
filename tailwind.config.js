/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#0A0C13',
        surface: '#12151F',
        'surface-light': '#191D2A',
        border: '#232838',
        teal: {
          DEFAULT: '#2DD8C8',
          light: '#5EEAD4',
        },
        purple: {
          DEFAULT: '#8B5CF6',
        },
        gold: {
          DEFAULT: '#F5B93B',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
