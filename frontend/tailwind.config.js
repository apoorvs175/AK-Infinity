/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "bg-primary": "#FFFFFF",
        "bg-secondary": "#F8FAFC",
        "bg-elevated": "#F1F5F9",
        "bg-card": "#FFFFFF",
        "text-primary": "#0F172A",
        "text-secondary": "#475569",
        "text-muted": "#64748B",
        "gold-primary": "#F4C542",
        "gold-hover": "#FFD95A",
        "gold-deep": "#E8A317",
        "blue-accent": "#38BDF8",
        "border-primary": "#E2E8F0",
        "divider-primary": "#E2E8F0",
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out',
        'slide-up': 'slideUp 0.6s ease-out',
        'pulse-gold': 'pulseGold 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow-gold': 'glowGold 2s ease-in-out infinite alternate',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseGold: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
        glowGold: {
          '0%': { boxShadow: '0 0 20px rgba(244, 197, 66, 0.2)' },
          '100%': { boxShadow: '0 0 40px rgba(244, 197, 66, 0.4)' },
        },
      },
    },
  },
  plugins: [],
}
