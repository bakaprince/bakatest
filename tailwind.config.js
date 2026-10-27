/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        exam: {
          bg: '#f8f9fa',
          surface: '#ffffff',
          border: '#e5e7eb',
          subtle: '#f3f4f6',
          text: {
            primary: '#111827',
            secondary: '#4b5563',
            muted: '#6b7280',
          },
          accent: '#2563eb',
          success: '#16a34a',
          danger: '#dc2626',
          warning: '#d97706',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      }
    },
  },
  plugins: [],
}
