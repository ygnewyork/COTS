/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Capital One-esque Color Overrides
        purple: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#D22E1E', // CapOne Red (Primary Accent)
          600: '#b91c1c',
          700: '#991b1b',
          800: '#7f1d1d',
          900: '#450a0a',
        },
        blue: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#004977', // CapOne Navy (Primary Brand)
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        // Bright / Capital One Theme
        'clarity': {
          'dark': '#F9FAFB',    // Light Gray (Gray-50)
          'darker': '#FFFFFF',  // White
          'card': '#FFFFFF',    // White
          'border': '#E5E7EB',  // Gray-200
          'text': '#0f172a',    // Slate-900 (Main Text)
          'purple': '#D22E1E',  
          'blue': '#004977',
          'cyan': '#0073BB',
          'green': '#10b981',
          'yellow': '#f59e0b',
          'red': '#D22E1E',
          'pink': '#ec4899',
        }
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'glow-purple': 'radial-gradient(circle at center, rgba(139, 92, 246, 0.15) 0%, transparent 70%)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
