/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: '#0B0F19',
        surface: {
          DEFAULT: '#111827',
          card: '#1E293B',
          hover: '#334155',
          border: 'rgba(255, 255, 255, 0.08)'
        },
        cyan: {
          400: '#38BDF8',
          500: '#06B6D4',
           glowing: '#00F0FF'
        },
        danger: {
          DEFAULT: '#EF4444',
          glow: '#FF2E54'
        },
        warning: {
          DEFAULT: '#F59E0B',
          glow: '#FFB800'
        },
        success: {
          DEFAULT: '#10B981',
          glow: '#00FF9D'
        }
      },
      fontFamily: {
        sans: ['Inter', 'Outfit', 'sans-serif'],
        mono: ['Fira Code', 'monospace']
      },
      boxShadow: {
        'glow-cyan': '0 0 20px rgba(0, 240, 255, 0.25)',
        'glow-danger': '0 0 20px rgba(239, 68, 68, 0.3)',
        'glow-warning': '0 0 20px rgba(245, 158, 11, 0.3)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)'
      },
      backgroundImage: {
        'hero-gradient': 'radial-gradient(ellipse at top, rgba(6, 182, 212, 0.15), transparent 70%)',
        'card-gradient': 'linear-gradient(135deg, rgba(30, 41, 59, 0.7) 0%, rgba(15, 23, 42, 0.8) 100%)'
      }
    },
  },
  plugins: [],
}
