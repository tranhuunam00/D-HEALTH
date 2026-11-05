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
          teal: '#1F7A8C',
          blue: '#2F6FDB',
          dark: '#0F6B7A',
          light: '#E0F2F1',
        },
        health: {
          goodBg: '#DCFCE7',
          goodFg: '#166534',
          goodDot: '#22C55E',
          warnBg: '#FEF3C7',
          warnFg: '#92400E',
          warnDot: '#F59E0B',
          alertBg: '#FEE2E2',
          alertFg: '#991B1B',
          alertDot: '#EF4444',
        },
        neutral: {
          bg: '#F8FAFC',
          card: '#FFFFFF',
          textMain: '#111827',
          textMuted: '#6B7280',
          border: '#E2E8F0',
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'sans-serif'],
      },
      borderRadius: {
        'card': '20px',
        'sheet': '28px',
      },
      spacing: {
        '4.5': '1.125rem',
      }
    },
  },
  plugins: [],
}
