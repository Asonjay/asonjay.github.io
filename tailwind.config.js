const { fontFamily } = require('tailwindcss/defaultTheme')

module.exports = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './content/**/*.mdx',
  ],
  theme: {
    extend: {
      colors: {
        accent: 'var(--color-accent)',
        'accent-secondary': 'var(--color-accent-secondary)',
        fore: {
          primary: 'var(--color-fore-primary)',
          secondary: 'var(--color-fore-secondary)',
          subtle: 'var(--color-fore-subtle)',
        },
        back: {
          primary: 'var(--color-back-primary)',
          secondary: 'var(--color-back-secondary)',
          subtle: 'var(--color-back-subtle)',
          accent: 'var(--color-back-accent)',
        },
        border: 'var(--color-border)',
      },
      fontFamily: {
        sans: [
          'var(--font-inter)',
          'Inter',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'sans-serif',
        ],
        heading: [
          'var(--font-space-grotesk)',
          'Space Grotesk',
          'ui-sans-serif',
          'system-ui',
          'sans-serif',
        ],
        'mono-label': [
          'var(--font-space-mono)',
          'Space Mono',
          'monospace',
        ],
        mono: [
          'var(--font-fira-code)',
          'Fira Code',
          'Monaco',
          'monospace',
        ],
      },
      animation: {
        'orb-float': 'orb-float 20s infinite alternate ease-in-out',
        'orb-morph': 'orb-morph 15s infinite alternate ease-in-out',
      },
      keyframes: {
        'orb-float': {
          '0%': { transform: 'translate(0, 0) scale(1)' },
          '100%': { transform: 'translate(5%, 5%) scale(1.1)' },
        },
        'orb-morph': {
          '0%': {
            borderRadius: '40% 60% 70% 30% / 40% 50% 60% 50%',
            transform: 'rotate(-15deg) scale(1)',
          },
          '100%': {
            borderRadius: '70% 30% 50% 50% / 30% 30% 70% 70%',
            transform: 'rotate(5deg) scale(1.1)',
          },
        },
      },
    },
  },
}
