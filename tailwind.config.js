/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
          950: '#052e16',
        },
        aberdares: {
          dark: '#0f291e',
          forest: '#1a4d36',
          deep: '#235e43',
          emerald: '#2e7d56',
          sage: '#529b74',
          mint: '#a3cfbb',
          light: '#eef6f2',
          coral: '#d9534f',
          warm: '#e28743',
          earth: '#8d6e63',
          sand: '#fbf9f5',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 10px 30px -10px rgba(15, 41, 30, 0.08)',
        'elevated': '0 20px 40px -15px rgba(15, 41, 30, 0.12)',
      }
    },
  },
  plugins: [],
}
