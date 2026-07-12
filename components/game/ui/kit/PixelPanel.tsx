'use client'
import { useEffect, useRef } from 'react'
import type { ReactNode } from 'react'
import { Nameplate } from './Nameplate'
import { IconClose } from './icons'

// The kit's modal surface. An unclipped wrapper carries the pop-in, the soft
// glow, and the two elements that overhang the frame (the title plate and the
// close button); the clipped surface inside is the actual dialog. Focus moves to
// the surface on open and is restored to the previously focused element (or the
// body) on close.
export function PixelPanel({
  title,
  onClose,
  children,
}: {
  title: string
  onClose: () => void
  children: ReactNode
}) {
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

  return (
    <div
      className="gp-pop"
      style={{
        position: 'relative',
        width: '100%',
        maxWidth: '42rem',
        boxShadow: '0 12px 44px -10px var(--gp-glow)',
      }}
    >
      <div style={{ position: 'absolute', top: -12, left: 14, zIndex: 2 }}>
        <Nameplate id={titleId}>{title}</Nameplate>
      </div>

      <button
        type="button"
        onClick={onClose}
        aria-label="Close panel"
        className="gp-corners"
        style={{
          position: 'absolute',
          top: -10,
          right: 10,
          zIndex: 2,
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 30,
          height: 26,
          fontSize: 15,
          padding: 0,
          cursor: 'pointer',
          border: 'none',
          background: 'var(--gp-bg)',
          color: 'var(--gp-text)',
          boxShadow: 'inset 0 0 0 2px var(--gp-border)',
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
        className="gp-surface gp-corners"
        style={{ outline: 'none' }}
      >
        <div
          style={{
            padding: '24px 20px 20px',
            maxHeight: '78vh',
            overflowY: 'auto',
            fontSize: 14.5,
            lineHeight: 1.6,
          }}
        >
          {children}
        </div>
      </div>
    </div>
  )
}
