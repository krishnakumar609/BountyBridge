/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#778873', // Moss Green
          dark: '#5a6b57',
        },
        secondary: {
          DEFAULT: '#A1BC98', // Sage Green
          dark: '#85a07c',
        },
        accent: {
          DEFAULT: '#DCCFC0', // Warm Stone
          dark: '#c4b5a3',
        },
        background: {
          DEFAULT: '#FDF6ED', // Cream Background
          dark: '#f6ebd9',
        },
        charcoal: '#2D2D2D', // Soft dark text
        'surface-container-low': '#f6f3f2',
        'surface-container': '#f0eded',
        'surface-variant': '#e4e2e1',
        'outline-variant': '#c4c8bf',
      },
      fontFamily: {
        script: ['"Hipster Script Pro"', '"Great Vibes"', 'Pacifico', 'cursive'],
        sans: ['"Breadley Sans"', '"Plus Jakarta Sans"', 'sans-serif'],
      },
      boxShadow: {
        card: '0px 4px 20px rgba(45, 45, 45, 0.04)',
        'card-hover': '0px 12px 32px rgba(45, 45, 45, 0.08)',
      }
    },
  },
  plugins: [],
}
