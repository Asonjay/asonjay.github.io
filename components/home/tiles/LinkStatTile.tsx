'use client'
import Link from 'next/link'
import { m } from 'framer-motion'
import { useInteraction } from '../motion'

// Compact "N things →" link tile (Projects, Blog). The whole card is the link;
// the count comes from real data. Number-forward and text-only by design — keeps
// it dense and avoids coupling to the classic-theme icon colors. next/Link keeps
// client nav (legacyBehavior wraps the framer <a>); framer owns the card's
// hover/tap transform (.home-motion cancels the CSS .home-card translate).
export function LinkStatTile({
  area,
  label,
  count,
  singular,
  plural,
  href,
}: {
  area: string
  label: string
  count: number
  singular: string
  plural: string
  href: string
}) {
  const interaction = useInteraction('card')
  return (
    <Link href={href} passHref legacyBehavior>
      <m.a
        className={`home-surface home-corners-lg home-card home-motion home-area-${area}`}
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          gap: 14,
          minWidth: 0,
          minHeight: 108,
          padding: 16,
          textDecoration: 'none',
          color: 'var(--home-text)',
        }}
        {...interaction}
      >
        <span
          style={{
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: '0.09em',
            textTransform: 'uppercase',
            color: 'var(--home-accent-ink)',
          }}
        >
          {label}
        </span>
        <span style={{ display: 'flex', alignItems: 'baseline', gap: 7 }}>
          <span style={{ fontSize: 30, fontWeight: 700, lineHeight: 1 }}>{count}</span>
          <span className="home-muted" style={{ fontSize: 14 }}>
            {count === 1 ? singular : plural}
          </span>
          <span aria-hidden="true" style={{ marginLeft: 'auto', color: 'var(--home-accent-ink)', fontSize: 18 }}>
            →
          </span>
        </span>
      </m.a>
    </Link>
  )
}
