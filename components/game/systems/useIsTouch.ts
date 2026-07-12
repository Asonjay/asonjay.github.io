'use client'
import { useState } from 'react'

// Single touch-capability probe, evaluated once. The whole game is client-only
// (GameLoader is a dynamic import with ssr:false), so reading window/navigator
// in the lazy initializer is safe and avoids a first-paint flip between the
// desktop hotbar and the mobile chrome. Every consumer (Joystick, InteractButton,
// HotbarSheet, Hotbar, NameplateBubble, VoxelHome) calls this so they all agree.
function detectTouch(): boolean {
  if (typeof window === 'undefined') return false
  return (
    'ontouchstart' in window ||
    (typeof navigator !== 'undefined' && navigator.maxTouchPoints > 0)
  )
}

export function useIsTouch(): boolean {
  const [isTouch] = useState(detectTouch)
  return isTouch
}
