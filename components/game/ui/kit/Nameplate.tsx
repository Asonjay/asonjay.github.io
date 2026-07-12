import type { ReactNode } from 'react'

// Small pixel-font tab: a bg plate with an accent border, used as a panel's
// title plate and by the world-space station bubble. Press Start 2P is reserved
// for exactly these small labels.
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
        fontFamily: 'var(--font-pixel), ui-monospace, monospace',
        fontSize: 10,
        lineHeight: 1,
        letterSpacing: '0.05em',
        padding: '6px 9px',
        background: 'var(--gp-bg)',
        color: 'var(--gp-text)',
        boxShadow: 'inset 0 0 0 2px var(--gp-accent)',
        whiteSpace: 'nowrap',
      }}
    >
      {children}
    </span>
  )
}
