import type { ReactNode } from 'react'

// Small rounded title plate: a near-solid plate with a softened border and a soft
// shadow, used as a panel's title plate and by the world-space station bubble.
// Barlow 600 — the kit's title weight.
export function Nameplate({
  children,
  id,
  className,
}: {
  children: ReactNode
  id?: string
  className?: string
}) {
  return (
    <span
      id={id}
      className={`gp-corners${className ? ` ${className}` : ''}`}
      style={{
        display: 'inline-block',
        fontFamily: 'var(--font-barlow), sans-serif',
        fontSize: 15,
        fontWeight: 600,
        lineHeight: 1.2,
        letterSpacing: '0.01em',
        padding: '5px 11px',
        background: 'var(--gp-bg)',
        color: 'var(--gp-text)',
        border: '1px solid var(--gp-border)',
        boxShadow: 'var(--gp-shadow-btn)',
        whiteSpace: 'nowrap',
      }}
    >
      {children}
    </span>
  )
}
