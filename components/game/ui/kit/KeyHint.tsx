import type { ReactNode } from 'react'

// Tiny keycap for interaction hints ("E", "Esc"). Pixel font, accent outline.
export function KeyHint({ children }: { children: ReactNode }) {
  return (
    <kbd
      style={{
        display: 'inline-block',
        fontFamily: 'var(--font-pixel), ui-monospace, monospace',
        fontSize: 9,
        lineHeight: 1,
        padding: '3px 5px',
        color: 'var(--gp-accent)',
        border: '1px solid var(--gp-accent)',
        background: 'transparent',
        whiteSpace: 'nowrap',
      }}
    >
      {children}
    </kbd>
  )
}
