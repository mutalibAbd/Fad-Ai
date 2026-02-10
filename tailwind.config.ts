import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Primary FAD-AI Blue
        primary: {
          DEFAULT: '#2B59FF',
          50: '#F0F4FF',
          100: '#E0E9FF',
          200: '#C1D3FF',
          300: '#A2BDFF',
          400: '#6B8EFF',
          500: '#2B59FF',
          600: '#1F3FD6',
          700: '#1428A0',
          800: '#0E176D',
          900: '#080D3A',
        },
        // Background Off-white
        background: {
          DEFAULT: '#FBFBFB',
          light: '#F5F5F7',
        },
        // Text colors
        text: {
          primary: '#1D1D1F',
          secondary: '#86868B',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      letterSpacing: {
        tight: '-0.01em',
        tighter: '-0.02em',
      },
      boxShadow: {
        // Xiaomi-style card shadows
        'sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'md': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'card': '0 2px 8px rgba(0, 0, 0, 0.08)',
        'card-hover': '0 8px 16px rgba(0, 0, 0, 0.12)',
      },
      transitionDuration: {
        '300': '300ms',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
