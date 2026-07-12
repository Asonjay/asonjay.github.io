'use client'
import { useEffect, useState } from 'react'
import { reducedMotionRef } from '../../systems/reducedMotion'

// Reveals text character by character. `speed` is milliseconds per character.
// Under prefers-reduced-motion the full string shows immediately, and the full
// text is always exposed to assistive tech via aria-label.
export function TypewriterText({
  text,
  speed = 32,
}: {
  text: string
  speed?: number
}) {
  const [count, setCount] = useState(() =>
    reducedMotionRef.current ? text.length : 0
  )

  useEffect(() => {
    if (reducedMotionRef.current) {
      setCount(text.length)
      return
    }
    setCount(0)
    let i = 0
    const id = window.setInterval(() => {
      i += 1
      setCount(i)
      if (i >= text.length) window.clearInterval(id)
    }, speed)
    return () => window.clearInterval(id)
  }, [text, speed])

  return <span aria-label={text}>{text.slice(0, count)}</span>
}
