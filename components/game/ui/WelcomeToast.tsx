'use client'
import { useEffect, useRef, useState } from 'react'
import { useGameStore } from '../systems/store'
import { useIsTouch } from '../systems/useIsTouch'

// First-visit controls hint. Shows once per browser (localStorage), sitting just
// above the hotbar; auto-dismisses after 6s or on the player's first move/interact
// input, whichever comes first. The slide-in is gated to a fade under reduced
// motion by the .gp-toast rule in tokens.css.
const STORAGE_KEY = 'voxel-welcome-seen'
const AUTO_MS = 6000
const INTERACT_KEYS = new Set([
  'w', 'a', 's', 'd',
  'arrowup', 'arrowdown', 'arrowleft', 'arrowright',
  'e', 'enter',
])

export function WelcomeToast() {
  const isTouch = useIsTouch()
  const markWelcomeSeen = useGameStore((s) => s.markWelcomeSeen)
  const [visible, setVisible] = useState(false)
  const dismissedRef = useRef(false)

  // First-visit decision, client-only (localStorage). If it's been seen, sync the
  // store flag and stay hidden.
  useEffect(() => {
    let seen = false
    try {
      seen = window.localStorage.getItem(STORAGE_KEY) != null
    } catch {
      seen = false
    }
    if (seen) {
      markWelcomeSeen()
      return
    }
    setVisible(true)
  }, [markWelcomeSeen])

  // While shown, arm the dismissers: 6s timer, first movement/interact key, first
  // canvas pointerdown. Any one persists the flag so the toast never returns.
  useEffect(() => {
    if (!visible) return

    const dismiss = () => {
      if (dismissedRef.current) return
      dismissedRef.current = true
      try {
        window.localStorage.setItem(STORAGE_KEY, '1')
      } catch {
        /* private mode / storage disabled — the flag just won't persist */
      }
      markWelcomeSeen()
      setVisible(false)
    }

    const timer = window.setTimeout(dismiss, AUTO_MS)
    const onKey = (e: KeyboardEvent) => {
      if (INTERACT_KEYS.has(e.key.toLowerCase())) dismiss()
    }
    const canvas = document.querySelector('.game-ui canvas') as HTMLElement | null
    const target: EventTarget = canvas ?? window
    window.addEventListener('keydown', onKey)
    target.addEventListener('pointerdown', dismiss)

    return () => {
      window.clearTimeout(timer)
      window.removeEventListener('keydown', onKey)
      target.removeEventListener('pointerdown', dismiss)
    }
  }, [visible, markWelcomeSeen])

  if (!visible) return null

  const text = isTouch
    ? 'Drag the joystick to walk · tap ! to interact'
    : 'WASD / arrows to walk · E to interact'

  return (
    <div
      className="gp-corners-lg gp-surface gp-toast"
      role="status"
      style={{
        position: 'fixed',
        left: '50%',
        bottom: 'calc(84px + env(safe-area-inset-bottom))',
        transform: 'translateX(-50%)',
        zIndex: 35,
        maxWidth: 'calc(100vw - 32px)',
        padding: '9px 14px',
        textAlign: 'center',
        fontFamily: 'var(--font-barlow), sans-serif',
        fontSize: 13,
        fontWeight: 600,
        letterSpacing: '0.01em',
        color: 'var(--gp-text)',
        pointerEvents: 'none',
      }}
    >
      {text}
    </div>
  )
}
