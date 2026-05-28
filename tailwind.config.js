/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        surface: {
          0: '#0a0e1a',
          1: '#0f1524',
          2: '#141c30',
          3: '#1a2340',
          4: '#202b4e',
        },
        border: {
          subtle: '#1e2d4a',
          muted: '#243554',
          default: '#2d4270',
        },
        accent: {
          DEFAULT: '#3b82f6',
          hover: '#60a5fa',
          muted: 'rgba(59,130,246,0.12)',
        },
        success: {
          DEFAULT: '#22c55e',
          muted: 'rgba(34,197,94,0.12)',
        },
        danger: {
          DEFAULT: '#ef4444',
          muted: 'rgba(239,68,68,0.12)',
        },
        warn: {
          DEFAULT: '#f59e0b',
          muted: 'rgba(245,158,11,0.12)',
        },
        text: {
          primary: '#e2e8f0',
          secondary: '#94a3b8',
          muted: '#64748b',
        },
      },
      fontFamily: {
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
    },
  },
  plugins: [],
}
