import type { CSSProperties, ReactNode } from 'react'

// Rounded button, mirroring the game kit's UiButton (copied, not imported, so
// the home tree stays free of game deps). `solid` fills with the accent (dark
// ink on top, which reads on both the night-blue and day-amber accents);
// `ghost` is a surface plate with a softened border. Both get the shared hover
// lift (.home-lift). Renders an <a> when given href (external links open in a
// new tab), otherwise a <button>.
type Common = {
  children: ReactNode
  variant?: 'solid' | 'ghost'
  size?: 'sm' | 'md'
  className?: string
  title?: string
  'aria-label'?: string
}
// `newTab` forces target=_blank for same-origin links; `download` renders a
// download link (used by the CV button on a local PDF).
type AsLink = Common & {
  href: string
  onClick?: never
  newTab?: boolean
  download?: boolean
}
type AsButton = Common & { onClick: () => void; href?: never }

const SOLID_INK = '#111321'

function styleFor(variant: 'solid' | 'ghost', size: 'sm' | 'md'): CSSProperties {
  const solid = variant === 'solid'
  const sm = size === 'sm'
  return {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    fontFamily: 'var(--font-barlow), sans-serif',
    fontSize: sm ? 12 : 13,
    fontWeight: 600,
    letterSpacing: '0.02em',
    padding: sm ? '4px 9px' : '7px 12px',
    cursor: 'pointer',
    userSelect: 'none',
    textDecoration: 'none',
    whiteSpace: 'nowrap',
    background: solid ? 'var(--home-accent)' : 'var(--home-bg)',
    color: solid ? SOLID_INK : 'var(--home-text)',
    border: `1px solid var(--home-${solid ? 'accent' : 'border'})`,
  }
}

export function HomeButton(props: AsLink | AsButton) {
  const { children, variant = 'ghost', size = 'md', className, title } = props
  const cls = `home-corners home-lift${className ? ` ${className}` : ''}`
  const style = styleFor(variant, size)
  const label = props['aria-label']

  if ('href' in props && props.href !== undefined) {
    const external = /^(https?:|mailto:)/.test(props.href)
    const openNew = props.newTab === true || external
    return (
      <a
        href={props.href}
        className={cls}
        style={style}
        title={title}
        aria-label={label}
        download={props.download}
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
