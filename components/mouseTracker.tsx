'use client'

import { useEffect } from 'react'

export function MouseTracker() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let frameId = 0
    let x = 0
    let y = 0

    const handleMove = (e: MouseEvent) => {
      x = e.clientX
      y = e.clientY
      if (frameId) return
      frameId = requestAnimationFrame(() => {
        const root = document.documentElement
        root.style.setProperty('--mouse-x', `${x}px`)
        root.style.setProperty('--mouse-y', `${y}px`)
        root.style.setProperty('--mouse-x-norm', `${(x / window.innerWidth) * 2 - 1}`)
        root.style.setProperty('--mouse-y-norm', `${(y / window.innerHeight) * 2 - 1}`)
        frameId = 0
      })
    }

    window.addEventListener('mousemove', handleMove, { passive: true })
    return () => {
      window.removeEventListener('mousemove', handleMove)
      if (frameId) cancelAnimationFrame(frameId)
    }
  }, [])

  return null
}
