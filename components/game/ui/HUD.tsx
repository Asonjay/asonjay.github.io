'use client'
import { useEffect, useState } from 'react'
import { reducedMotionRef } from '../systems/reducedMotion'

// Persistent top-left plate: the room's title plus a one-line orientation hint.
// The hint eases down to 40% opacity after 8s so it recedes once the player has
// their bearings; under reduced motion it starts dim with no transition.
export function HUD() {
  const [dim, setDim] = useState(() => reducedMotionRef.current)

  useEffect(() => {
    if (reducedMotionRef.current) return
    const t = window.setTimeout(() => setDim(true), 8000)
    return () => window.clearTimeout(t)
  }, [])

  return (
    <div
      style={{
        position: 'fixed',
        top: 'calc(12px + env(safe-area-inset-top))',
        left: 'calc(12px + env(safe-area-inset-left))',
        zIndex: 25,
        pointerEvents: 'none',
        userSelect: 'none',
      }}
    >
      <div
        className="gp-corners gp-surface"
        style={{ display: 'inline-flex', flexDirection: 'column', gap: 5, padding: '8px 11px' }}
      >
        <span
          style={{
            fontFamily: 'var(--font-pixel), ui-monospace, monospace',
            fontSize: 11,
            lineHeight: 1.1,
            letterSpacing: '0.04em',
            color: 'var(--gp-accent)',
          }}
        >
          {"JASON'S VOXEL STUDY"}
        </span>
        <span
          style={{
            fontFamily: 'var(--font-barlow), sans-serif',
            fontSize: 12,
            lineHeight: 1.3,
            color: 'var(--gp-text)',
            opacity: dim ? 0.4 : 1,
            transition: reducedMotionRef.current ? 'none' : 'opacity 1200ms ease',
          }}
        >
          Walk up to a glowing spot to interact.
        </span>
      </div>
    </div>
  )
}
