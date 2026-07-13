'use client'
import { useEffect, useState } from 'react'
import { AnimatePresence, m, useReducedMotion } from 'framer-motion'
import { useDarkMode } from '../../hooks/useDarkMode'
import { useInteraction } from './motion'
import { Sun20, Moon20 } from '../icons'

// Sun/moon toggle driving the site-wide useDarkMode() single source (the same
// hook the game owns). useDarkMode flips .dark/.light on <html>, which reswaps
// every .home-ui token, so this button is the whole home theme control. The icon
// cross-fades + rotates (~200ms) on swap; the button gets framer hover/tap.
export function HomeThemeToggle({ className }: { className?: string }) {
  const [isDark, setIsDark] = useDarkMode()
  const [mounted, setMounted] = useState(false)
  const reduce = useReducedMotion()
  const interaction = useInteraction('control')
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
    <m.button
      type="button"
      aria-label={dark ? 'Switch to light theme' : 'Switch to dark theme'}
      title={dark ? 'Light theme' : 'Dark theme'}
      onClick={() => setIsDark(!dark)}
      className={`home-corners home-lift home-motion${className ? ` ${className}` : ''}`}
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
      {...interaction}
    >
      {/* Fixed-size stage so the two icons cross-fade stacked — no layout shift. */}
      <span style={{ position: 'relative', width: 20, height: 20, display: 'inline-flex' }}>
        <AnimatePresence initial={false}>
          <m.span
            key={dark ? 'moon' : 'sun'}
            initial={reduce ? { opacity: 0 } : { opacity: 0, rotate: -90, scale: 0.6 }}
            animate={reduce ? { opacity: 1 } : { opacity: 1, rotate: 0, scale: 1 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, rotate: 90, scale: 0.6 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            style={{
              position: 'absolute',
              inset: 0,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {dark ? <Moon20 /> : <Sun20 />}
          </m.span>
        </AnimatePresence>
      </span>
    </m.button>
  )
}
