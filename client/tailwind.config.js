/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'casino-green': {
          DEFAULT: '#0a5c36',
          light: '#15803d',
          dark: '#064e3b',
        },
        'casino-red': {
          DEFAULT: '#991b1b',
          light: '#b91c1c',
          dark: '#7f1d1d',
        },
        'gold': {
          DEFAULT: '#fbbf24',
          light: '#fcd34d',
          dark: '#d97706',
          glow: '#fef3c7',
        },
        'felt': '#1a4731',
        'felt-dark': '#143827',
      },
      backgroundImage: {
        'felt-pattern': "radial-gradient(circle at center, #1a4731 0%, #0f291e 100%)",
        'card-gradient': "linear-gradient(135deg, #ffffff 0%, #f3f4f6 100%)",
      },
      boxShadow: {
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.15)',
        'card-hover': '0 10px 15px -3px rgba(0, 0, 0, 0.4), 0 4px 6px -2px rgba(0, 0, 0, 0.2)',
        'neon-gold': '0 0 10px rgba(251, 191, 36, 0.5), 0 0 20px rgba(251, 191, 36, 0.3)',
      },
      animation: {
        'deal': 'deal 0.5s ease-out forwards',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        deal: {
          '0%': { transform: 'translateY(-100vh) rotate(180deg)', opacity: '0' },
          '100%': { transform: 'translateY(0) rotate(0)', opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      }
    },
  },
  plugins: [],
}