'use client'
import { useEffect, useState } from 'react'
import { useDarkMode } from '../../hooks/useDarkMode'
import { Sun20, Moon20 } from '../icons'

// Sun/moon toggle driving the site-wide useDarkMode() single source (the same
// hook the game owns). useDarkMode flips .dark/.light on <html>, which reswaps
// every .home-ui token, so this button is the whole home theme control.
export function HomeThemeToggle({ className }: { className?: string }) {
  const [isDark, setIsDark] = useDarkMode()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  // Until mounted, render a same-size placeholder: the server renders the
  // default (dark) theme, but the real state is only known after the client
  // reads localStorage, so committing to an icon now risks a hydration mismatch.
  if (!mounted) {
    return (
      <span
        className={className}
        style={{ width: 34, height: 34, display: 'inline-block' }}
        aria-hidden="true"
      />
    )
  }

  const dark = Boolean(isDark)
  return (
    <button
      type="button"
      aria-label={dark ? 'Switch to light theme' : 'Switch to dark theme'}
      title={dark ? 'Light theme' : 'Dark theme'}
      onClick={() => setIsDark(!dark)}
      className={`home-corners home-lift${className ? ` ${className}` : ''}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 34,
        height: 34,
        background: 'var(--home-bg)',
        color: 'var(--home-text)',
        border: '1px solid var(--home-border)',
        cursor: 'pointer',
      }}
    >
      {dark ? <Moon20 /> : <Sun20 />}
    </button>
  )
}
