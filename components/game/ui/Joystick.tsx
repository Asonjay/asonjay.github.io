'use client'
import { useEffect, useRef } from 'react'
import { useGameStore } from '../systems/store'
import { useIsTouch } from '../systems/useIsTouch'

// Fixed bottom-left virtual joystick (pointer events, no library). Writes through
// the SAME store path the keyboard uses (setMoveVector + auto-walk cancel), so
// the existing panel-open input lock and auto-walk-cancel-on-manual-input apply
// unchanged. The thumb is moved by direct DOM writes (no per-move React state).
//
// moveVector is a screen-relative iso direction whose MAGNITUDE scales speed
// (Player multiplies it by MOVE_SPEED): keyboard emits unit vectors (full speed);
// the stick emits 0..1 so a partial tilt walks slower. The screen->world mapping
// mirrors systems/useInput: right = +dx, up = -dy, world = (right-fwd, -right-fwd).
const BASE = 120
const THUMB = 48
const RADIUS = (BASE - THUMB) / 2 // travel radius keeps the thumb inside the base
const DEADZONE = 0.15

export function Joystick() {
  const isTouch = useIsTouch()
  const baseRef = useRef<HTMLDivElement>(null)
  const thumbRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isTouch) return
    const base = baseRef.current
    const thumb = thumbRef.current
    if (!base || !thumb) return

    let pointerId: number | null = null
    let cx = 0
    let cy = 0

    const setThumb = (dx: number, dy: number) => {
      thumb.style.transform = `translate(${dx}px, ${dy}px)`
    }
    const zeroMove = () => useGameStore.getState().setMoveVector({ x: 0, z: 0 })

    const onMove = (e: PointerEvent) => {
      if (e.pointerId !== pointerId) return
      const store = useGameStore.getState()
      // A panel opening mid-drag must lock movement exactly as useInput does.
      if (store.openPanelId !== null) {
        setThumb(0, 0)
        zeroMove()
        return
      }
      const dx = e.clientX - cx
      const dy = e.clientY - cy
      const len = Math.hypot(dx, dy)
      const clamped = Math.min(len, RADIUS)
      const ux = len > 0 ? dx / len : 0
      const uy = len > 0 ? dy / len : 0
      setThumb(ux * clamped, uy * clamped)

      const pushFrac = RADIUS > 0 ? clamped / RADIUS : 0
      if (pushFrac < DEADZONE) {
        zeroMove()
        return
      }
      const mag = (pushFrac - DEADZONE) / (1 - DEADZONE)
      const right = ux // screen right
      const fwd = -uy // screen up
      let wx = right - fwd
      let wz = -right - fwd
      const inv = 1 / Math.hypot(wx, wz) // normalize to a unit direction, then scale
      wx *= inv
      wz *= inv
      if (store.autoWalk) store.setAutoWalk(null)
      store.setMoveVector({ x: wx * mag, z: wz * mag })
    }

    const onDown = (e: PointerEvent) => {
      if (pointerId !== null) return // one finger owns the stick (multi-touch safe)
      if (useGameStore.getState().openPanelId !== null) return
      pointerId = e.pointerId
      const rect = base.getBoundingClientRect()
      cx = rect.left + rect.width / 2
      cy = rect.top + rect.height / 2
      base.setPointerCapture(e.pointerId)
      e.preventDefault()
      onMove(e)
    }

    const onUp = (e: PointerEvent) => {
      if (e.pointerId !== pointerId) return
      pointerId = null
      setThumb(0, 0)
      zeroMove()
    }

    base.addEventListener('pointerdown', onDown)
    base.addEventListener('pointermove', onMove)
    base.addEventListener('pointerup', onUp)
    base.addEventListener('pointercancel', onUp)
    return () => {
      base.removeEventListener('pointerdown', onDown)
      base.removeEventListener('pointermove', onMove)
      base.removeEventListener('pointerup', onUp)
      base.removeEventListener('pointercancel', onUp)
      zeroMove()
    }
  }, [isTouch])

  if (!isTouch) return null

  return (
    <div
      ref={baseRef}
      aria-hidden
      style={{
        position: 'fixed',
        left: 'calc(20px + env(safe-area-inset-left))',
        bottom: 'calc(20px + env(safe-area-inset-bottom))',
        width: BASE,
        height: BASE,
        borderRadius: '50%',
        zIndex: 30,
        touchAction: 'none',
        userSelect: 'none',
        background: 'var(--gp-bg)',
        border: '1px solid var(--gp-border)',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.18)',
        display: 'grid',
        placeItems: 'center',
      }}
    >
      <div
        ref={thumbRef}
        style={{
          width: THUMB,
          height: THUMB,
          borderRadius: '50%',
          background: 'var(--gp-accent)',
          boxShadow: '0 2px 8px -2px var(--gp-glow)',
          willChange: 'transform',
          pointerEvents: 'none',
        }}
      />
    </div>
  )
}
