'use client'
import Link from 'next/link'
import { Fragment } from 'react'
import { m, useReducedMotion } from 'framer-motion'
import { HomeThemeToggle } from './HomeThemeToggle'

// Destinations shown in the nav. All internal routes (Study + Classic included).
const NAV_LINKS: { href: string; label: string }[] = [
  { href: '/publications', label: 'Publications' },
  { href: '/projects', label: 'Projects' },
  { href: '/blog', label: 'Blog' },
  { href: '/study', label: 'Study' },
  { href: '/classic', label: 'Classic' },
]

const linkStyle = {
  color: 'var(--home-text)',
  textDecoration: 'none',
  fontSize: 14,
  fontWeight: 500,
} as const

// Slim sticky header: wordmark left, the full link row + theme toggle right.
// Per the owner's rule the inline links only show at lg+; below lg they drop to
// a compact second line (no hamburger). The wordmark and toggle stay put.
export function HomeNav() {
  const reduce = useReducedMotion()
  return (
    <header
      className="home-ui-nav"
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 20,
        background: 'var(--home-page-bg)',
        borderBottom: '1px solid var(--home-border)',
      }}
    >
      {/* The entrance transform lives on this inner row, never on the sticky
          <header> — a transform on the sticky element's ancestor chain would
          break its stickiness. Fades in first (before the tile cascade). */}
      <m.div
        className="home-anim mx-auto"
        style={{ maxWidth: 1100, padding: '10px 16px' }}
        initial={{ opacity: 0, y: reduce ? 0 : -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 12,
          }}
        >
          <Link
            href="/"
            style={{
              color: 'var(--home-text)',
              textDecoration: 'none',
              fontWeight: 700,
              fontSize: 16,
              letterSpacing: '-0.01em',
              whiteSpace: 'nowrap',
            }}
          >
            Zexin (Jason) Xu
          </Link>

          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            {/* Inline links: lg and up only. */}
            <nav
              className="hidden lg:flex"
              aria-label="Primary"
              style={{ alignItems: 'center', gap: 10 }}
            >
              {NAV_LINKS.map((l, i) => (
                <Fragment key={l.href}>
                  {i > 0 ? (
                    <span aria-hidden="true" className="home-muted" style={{ fontSize: 13 }}>
                      ·
                    </span>
                  ) : null}
                  <Link href={l.href} className="home-nav-link" style={linkStyle}>
                    {l.label}
                  </Link>
                </Fragment>
              ))}
            </nav>
            <HomeThemeToggle />
          </div>
        </div>

        {/* Compact link row: below lg only (tablets + phones). Wraps instead of
            collapsing into a menu. */}
        <nav
          className="flex lg:hidden"
          aria-label="Primary"
          style={{
            flexWrap: 'wrap',
            gap: '4px 14px',
            marginTop: 8,
          }}
        >
          {NAV_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="home-nav-link"
              style={{ ...linkStyle, fontSize: 13 }}
            >
              {l.label}
            </Link>
          ))}
        </nav>
      </m.div>
    </header>
  )
}
