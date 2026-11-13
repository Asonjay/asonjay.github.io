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
        // Manrope carries the whole site; Barlow is kept for the name mark.
        sans: [
          'var(--font-manrope)',
          'Manrope',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'sans-serif',
        ],
        heading: [
          'var(--font-manrope)',
          'Manrope',
          'ui-sans-serif',
          'system-ui',
          'sans-serif',
        ],
        brand: [
          'var(--font-barlow)',
          'Barlow',
          'var(--font-manrope)',
          'sans-serif',
        ],
        'mono-label': [
          'var(--font-manrope)',
          'Manrope',
          'ui-sans-serif',
          'system-ui',
          'sans-serif',
        ],
        mono: [
          'var(--font-jetbrains-mono)',
          'JetBrains Mono',
          'Monaco',
          'monospace',
        ],
      },
    },
  },
}
