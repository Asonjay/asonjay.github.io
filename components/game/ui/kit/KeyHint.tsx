import type { ReactNode } from 'react'

// Tiny pill keycap for interaction hints ("E", "Esc", "TAP"). Barlow, a softened
// border, and a soft bottom shadow so it reads as a physical key. Accent-ink text
// keeps contrast on the surface in both day and night.
export function KeyHint({ children }: { children: ReactNode }) {
  return (
    <kbd
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: 18,
        fontFamily: 'var(--font-barlow), sans-serif',
        fontSize: 11,
        fontWeight: 600,
        lineHeight: 1,
        letterSpacing: '0.02em',
        padding: '3px 6px',
        color: 'var(--gp-accent-ink)',
        background: 'var(--gp-bg)',
        border: '1px solid var(--gp-border)',
        borderRadius: 'var(--gp-radius-pill)',
        boxShadow: '0 2px 3px rgba(0, 0, 0, 0.14)',
        whiteSpace: 'nowrap',
      }}
    >
      {children}
    </kbd>
  )
}
