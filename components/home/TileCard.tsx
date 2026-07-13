import type { CSSProperties, ReactNode } from 'react'

// Shared bento tile: a rounded surface with the soft panel shadow, a subtle
// hover lift (.home-card), and an optional labeled header. `area` maps to a
// grid-area helper class from home-tokens.css so the same tile lands in the
// right cell at every breakpoint. Tiles render their own body + footer links.
export function TileCard({
  area,
  label,
  headerRight,
  children,
  pad = 18,
  className,
  style,
}: {
  area: string
  label?: string
  headerRight?: ReactNode
  children: ReactNode
  pad?: number
  className?: string
  style?: CSSProperties
}) {
  return (
    <section
      className={`home-surface home-corners-lg home-card home-area-${area}${
        className ? ` ${className}` : ''
      }`}
      style={{
        padding: pad,
        display: 'flex',
        flexDirection: 'column',
        minWidth: 0,
        ...style,
      }}
    >
      {label ? (
        <header
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 10,
            marginBottom: 12,
          }}
        >
          <h2
            style={{
              margin: 0,
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: '0.09em',
              textTransform: 'uppercase',
              color: 'var(--home-accent-ink)',
            }}
          >
            {label}
          </h2>
          {headerRight}
        </header>
      ) : null}
      {children}
    </section>
  )
}
