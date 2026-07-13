'use client'
import { useEffect, useRef } from 'react'
import type { ReactNode } from 'react'
import { Nameplate } from './Nameplate'
import { IconClose } from './icons'

// The kit's modal surface. A wrapper carries the pop-in, a soft accent glow, and
// the two elements that overhang the frame (the title plate and the close
// button); the rounded surface inside is the actual dialog. Focus moves to the
// surface on open and is restored to the previously focused element (or the body)
// on close.
export function UiPanel({
  title,
  onClose,
  children,
}: {
  title: string
  onClose: () => void
  children: ReactNode
}) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const surfaceRef = useRef<HTMLDivElement>(null)
  const titleId = `gp-panel-${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`

  useEffect(() => {
    const prev = document.activeElement as HTMLElement | null
    surfaceRef.current?.focus()
    return () => {
      if (prev && document.contains(prev) && typeof prev.focus === 'function') {
        prev.focus()
      } else {
        document.body?.focus?.()
      }
    }
  }, [])

  // Focus trap: keep Tab / Shift+Tab cycling within the panel (a modal dialog).
  // The dialog surface itself (tabIndex -1) is the initial focus, so a first Tab
  // from it, or a Tab off either end, wraps to the other end. Panels with no
  // focusable content keep focus on the surface. Small manual handler — no lib.
  const onTrapKey = (e: React.KeyboardEvent) => {
    if (e.key !== 'Tab') return
    const root = wrapRef.current
    if (!root) return
    const focusables = Array.from(
      root.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
      )
    )
    if (focusables.length === 0) {
      e.preventDefault()
      surfaceRef.current?.focus()
      return
    }
    const first = focusables[0]
    const last = focusables[focusables.length - 1]
    const active = document.activeElement
    const onSurface = active === surfaceRef.current || !root.contains(active)
    if (e.shiftKey) {
      if (active === first || onSurface) {
        e.preventDefault()
        last.focus()
      }
    } else if (active === last || onSurface) {
      e.preventDefault()
      first.focus()
    }
  }

  return (
    <div
      ref={wrapRef}
      onKeyDown={onTrapKey}
      className="gp-pop gp-panel-surface"
      style={{ boxShadow: '0 14px 40px -16px var(--gp-glow)' }}
    >
      <div style={{ position: 'absolute', top: -12, left: 14, zIndex: 2 }}>
        <Nameplate id={titleId}>{title}</Nameplate>
      </div>

      <button
        type="button"
        onClick={onClose}
        aria-label="Close panel"
        className="gp-corners gp-lift"
        style={{
          position: 'absolute',
          top: -10,
          right: 10,
          zIndex: 2,
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 30,
          height: 28,
          fontSize: 16,
          padding: 0,
          cursor: 'pointer',
          background: 'var(--gp-bg)',
          color: 'var(--gp-text)',
          border: '1px solid var(--gp-border)',
        }}
      >
        <IconClose />
      </button>

      <div
        ref={surfaceRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className="gp-surface gp-corners-lg"
        style={{ outline: 'none' }}
      >
        <div className="gp-panel-body">{children}</div>
      </div>
    </div>
  )
}
