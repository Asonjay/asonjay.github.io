import type { CSSProperties } from 'react'

// Dashed pixel rule. Horizontal by default (separating panel sections); the
// vertical variant separates clusters inside a horizontal bar (the hotbar).
export function PixelDivider({
  className,
  orientation = 'horizontal',
}: {
  className?: string
  orientation?: 'horizontal' | 'vertical'
}) {
  const vertical = orientation === 'vertical'
  const style: CSSProperties = vertical
    ? {
        width: 2,
        height: 26,
        margin: '0 2px',
        opacity: 0.55,
        background:
          'repeating-linear-gradient(0deg, var(--gp-border) 0 6px, transparent 6px 10px)',
      }
    : {
        height: 2,
        margin: '12px 0',
        opacity: 0.55,
        background:
          'repeating-linear-gradient(90deg, var(--gp-border) 0 6px, transparent 6px 10px)',
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
