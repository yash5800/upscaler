/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#0b0b12',
        surface: { DEFAULT: '#12121e', card: '#181825', hover: '#1e1e30' },
        border: '#2a2a3e',
        accent: { DEFAULT: '#6c5ce7', hover: '#7d6ff0', glow: 'rgba(108,92,231,0.25)' },
        teal: '#00cec9',
        amber: '#fdcb6e',
        coral: '#ff6b6b',
        muted: '#8888a8',
        'muted-dark': '#55556a',
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'slide-up': 'slideUp 0.4s ease-out forwards',
        'shimmer': 'shimmer 2s infinite linear',
        'pulse-glow': 'pulseGlow 2s infinite',
        'spin-slow': 'spin 3s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 8px rgba(108,92,231,0.2)' },
          '50%': { boxShadow: '0 0 20px rgba(108,92,231,0.4)' },
        },
      },
    },
  },
  plugins: [],
};
