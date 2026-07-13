'use client'
import type { CSSProperties, ReactNode } from 'react'
import { KeyHint } from './KeyHint'

// Square hotbar/action slot: an icon centered in a rounded plate with an
// accessible label, an optional hotkey badge, and an active highlight. The icon
// is decorative; the accessible name comes from `label`.
type Base = {
  icon: ReactNode
  label: string
  active?: boolean
  hotkey?: string
  className?: string
}
type Clickable = Base & { onClick: () => void; href?: never }
type Linkable = Base & { href: string; onClick?: never }

function slotStyle(active: boolean): CSSProperties {
  return {
    position: 'relative',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 44,
    height: 44,
    fontSize: 20,
    cursor: 'pointer',
    background: active ? 'var(--gp-accent)' : 'var(--gp-bg)',
    color: active ? '#111321' : 'var(--gp-text)',
    border: `1px solid var(--gp-${active ? 'accent' : 'border'})`,
  }
}

function Badge({ hotkey }: { hotkey?: string }) {
  if (!hotkey) return null
  return (
    <span style={{ position: 'absolute', top: -8, right: -6 }}>
      <KeyHint>{hotkey}</KeyHint>
    </span>
  )
}

export function IconSlot(props: Clickable | Linkable) {
  const { icon, label, active = false, hotkey, className } = props
  const cls = `gp-corners gp-lift${className ? ` ${className}` : ''}`
  const style = slotStyle(active)

  if ('href' in props && props.href !== undefined) {
    const external = /^(https?:|mailto:)/.test(props.href)
    return (
      <a
        href={props.href}
        aria-label={label}
        title={label}
        className={cls}
        style={style}
        target={external ? '_blank' : undefined}
        rel={external ? 'noopener noreferrer' : undefined}
      >
        {icon}
        <Badge hotkey={hotkey} />
      </a>
    )
  }

  return (
    <button
      type="button"
      onClick={props.onClick}
      aria-label={label}
      title={label}
      aria-pressed={active}
      className={cls}
      style={style}
    >
      {icon}
      <Badge hotkey={hotkey} />
    </button>
  )
}
