import type { CSSProperties } from 'react'

// Thin rounded hairline. Horizontal by default (separating panel sections); the
// vertical variant separates clusters inside a horizontal bar (the hotbar). Color
// is the softened border token, so it reads as a quiet rule.
export function UiDivider({
  className,
  orientation = 'horizontal',
}: {
  className?: string
  orientation?: 'horizontal' | 'vertical'
}) {
  const vertical = orientation === 'vertical'
  const style: CSSProperties = vertical
    ? {
        width: 1,
        height: 24,
        margin: '0 3px',
        borderRadius: 999,
        background: 'var(--gp-border)',
      }
    : {
        height: 1,
        margin: '12px 0',
        borderRadius: 999,
        background: 'var(--gp-border)',
      }
  return (
    <div
      role="separator"
      aria-orientation={orientation}
      className={className}
      style={style}
    />
  )
}
