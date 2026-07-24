/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#09090B',
        'bg-secondary': '#111827',
        surface: { 
          DEFAULT: '#12121e', 
          card: '#18181B', 
          hover: '#27272A',
          glass: 'rgba(24, 24, 27, 0.6)'
        },
        border: 'rgba(255, 255, 255, 0.08)',
        'border-hover': 'rgba(255, 255, 255, 0.16)',
        primary: {
          DEFAULT: '#6366F1',
          hover: '#4F46E5',
          glow: 'rgba(99, 102, 241, 0.3)'
        },
        accent: { 
          DEFAULT: '#22D3EE', 
          hover: '#06B6D4', 
          glow: 'rgba(34, 211, 238, 0.3)' 
        },
        purple: {
          DEFAULT: '#9333EA',
          glow: 'rgba(147, 51, 234, 0.3)'
        },
        pink: '#EC4899',
        teal: '#0EA5E9',
        muted: '#A1A1AA',
        'muted-dark': '#71717A',
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'slide-up': 'slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'aurora-slow': 'aurora 18s ease-in-out infinite alternate',
        'aurora-reverse': 'auroraReverse 22s ease-in-out infinite alternate',
        'float-slow': 'float 8s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 2.5s ease-in-out infinite',
        'shimmer': 'shimmer 2s infinite linear',
        'scanline': 'scanline 3s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        aurora: {
          '0%': { transform: 'translate(0%, 0%) scale(1) rotate(0deg)' },
          '50%': { transform: 'translate(15%, 10%) scale(1.2) rotate(90deg)' },
          '100%': { transform: 'translate(-10%, -15%) scale(0.9) rotate(180deg)' },
        },
        auroraReverse: {
          '0%': { transform: 'translate(0%, 0%) scale(1.1) rotate(0deg)' },
          '50%': { transform: 'translate(-15%, 12%) scale(0.85) rotate(-90deg)' },
          '100%': { transform: 'translate(10%, -10%) scale(1.25) rotate(-180deg)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 15px rgba(99, 102, 241, 0.25)' },
          '50%': { boxShadow: '0 0 35px rgba(34, 211, 238, 0.45)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(1000%)' },
        }
      },
    },
  },
  plugins: [],
};
