'use client'
import { useEffect } from 'react'
import { useGameStore } from './store'

// Screen-relative WASD/arrows for the fixed iso camera (offset 20,20,20 → 45°
// yaw): up-screen (W) = (-1,0,-1)/√2, right-screen (D) = (1,0,-1)/√2. We build
// the raw direction and normalize, so the shared 1/√2 factor drops out.
export function useInput() {
  useEffect(() => {
    const pressed = new Set<string>()
    const has = (k: string) => pressed.has(k)

    const isMoveKey = (k: string) =>
      k === 'w' || k === 'a' || k === 's' || k === 'd' ||
      k === 'arrowup' || k === 'arrowdown' || k === 'arrowleft' || k === 'arrowright'

    const apply = () => {
      const store = useGameStore.getState()
      if (store.openPanelId !== null) {
        store.setMoveVector({ x: 0, z: 0 })
        return
      }
      const fwd = (has('w') || has('arrowup') ? 1 : 0) - (has('s') || has('arrowdown') ? 1 : 0)
      const right = (has('d') || has('arrowright') ? 1 : 0) - (has('a') || has('arrowleft') ? 1 : 0)
      const x = right - fwd
      const z = -right - fwd
      const len = Math.hypot(x, z)
      // Any real movement input takes over from (and cancels) an active auto-walk.
      if (len > 0 && store.autoWalk) store.setAutoWalk(null)
      store.setMoveVector(len > 0 ? { x: x / len, z: z / len } : { x: 0, z: 0 })
    }

    // Losing focus mid-keypress (alt-tab, minimize) never delivers the keyup, so
    // clear all held keys and stop the player rather than letting it walk on.
    const clearKeys = () => {
      pressed.clear()
      useGameStore.getState().setMoveVector({ x: 0, z: 0 })
    }
    const onVisibility = () => {
      if (document.visibilityState === 'hidden') clearKeys()
    }

    const onDown = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase()
      if (!isMoveKey(k)) return
      pressed.add(k)
      apply()
    }
    const onUp = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase()
      if (!isMoveKey(k)) return
      pressed.delete(k)
      apply()
    }

    window.addEventListener('keydown', onDown)
    window.addEventListener('keyup', onUp)
    window.addEventListener('blur', clearKeys)
    document.addEventListener('visibilitychange', onVisibility)
    return () => {
      window.removeEventListener('keydown', onDown)
      window.removeEventListener('keyup', onUp)
      window.removeEventListener('blur', clearKeys)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [])
}
