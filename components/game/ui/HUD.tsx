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
        className="gp-corners-lg gp-surface"
        style={{ display: 'inline-flex', flexDirection: 'column', gap: 5, padding: '8px 12px' }}
      >
        <span
          style={{
            fontFamily: 'var(--font-barlow), sans-serif',
            fontSize: 13,
            fontWeight: 600,
            lineHeight: 1.2,
            letterSpacing: '0.03em',
            color: 'var(--gp-accent-ink)',
          }}
        >
          {"Jason's Voxel Study"}
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
