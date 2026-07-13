'use client'
import type { CSSProperties, ReactNode } from 'react'

// Rounded button. `solid` fills with the accent (dark ink on top, which reads on
// both the night-blue and day-orange accents); `ghost` is a bg plate with a
// softened border. Both get the shared lift on hover (.gp-lift). Renders an <a>
// when given href (external links get target/rel), otherwise a <button>.
type Common = {
  children: ReactNode
  variant?: 'solid' | 'ghost'
  className?: string
  title?: string
  'aria-label'?: string
}
// `newTab` forces target=_blank for same-origin links (e.g. a local PDF) that the
// external-URL check below would otherwise open in the current tab.
type AsLink = Common & { href: string; onClick?: never; newTab?: boolean }
type AsButton = Common & { onClick: () => void; href?: never }

const SOLID_INK = '#111321'

function styleFor(variant: 'solid' | 'ghost'): CSSProperties {
  const solid = variant === 'solid'
  return {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    fontFamily: 'var(--font-barlow), sans-serif',
    fontSize: 13,
    fontWeight: 600,
    letterSpacing: '0.02em',
    padding: '7px 12px',
    cursor: 'pointer',
    userSelect: 'none',
    textDecoration: 'none',
    background: solid ? 'var(--gp-accent)' : 'var(--gp-bg)',
    color: solid ? SOLID_INK : 'var(--gp-text)',
    border: `1px solid var(--gp-${solid ? 'accent' : 'border'})`,
  }
}

export function UiButton(props: AsLink | AsButton) {
  const { children, variant = 'ghost', className, title } = props
  const cls = `gp-corners gp-lift${className ? ` ${className}` : ''}`
  const style = styleFor(variant)
  const label = props['aria-label']

  if ('href' in props && props.href !== undefined) {
    const openNew = props.newTab === true || /^(https?:|mailto:)/.test(props.href)
    return (
      <a
        href={props.href}
        className={cls}
        style={style}
        title={title}
        aria-label={label}
        target={openNew ? '_blank' : undefined}
        rel={openNew ? 'noopener noreferrer' : undefined}
      >
        {children}
      </a>
    )
  }

  return (
    <button
      type="button"
      onClick={props.onClick}
      className={cls}
      style={style}
      title={title}
      aria-label={label}
    >
      {children}
    </button>
  )
}
