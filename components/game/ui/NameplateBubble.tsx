'use client'
import { useEffect, useRef, useState } from 'react'
import { nameplateRef } from '../systems/store'

// Screen-space hint that floats above the nearby station: display name + an "E"
// key cap. Position/opacity are driven straight from nameplateRef via rAF (no
// per-frame React state); only the label changes trigger a re-render. Plain
// styled div for now — Task 3's UI kit re-skins it.
const LABELS: Record<string, string> = {
  about: 'About',
  publications: 'Publications',
  news: 'News',
  projects: 'Projects',
  blog: 'Blog',
  music: 'Music',
  life: 'Life',
  contact: 'Contact',
  deadlines: 'Deadlines',
  classic: 'Classic Site',
  lamp: 'Lamp',
}

const pixelFont = "'Press Start 2P', ui-monospace, 'Courier New', monospace"

export function NameplateBubble() {
  const el = useRef<HTMLDivElement>(null)
  const [id, setId] = useState<string | null>(null)
  const lastId = useRef<string | null>(null)

  useEffect(() => {
    let raf = 0
    const tick = () => {
      raf = requestAnimationFrame(tick)
      const np = nameplateRef.current
      const node = el.current
      if (!node) return
      if (np.visible) {
        node.style.opacity = '1'
        node.style.transform = `translate(-50%, -100%) translate(${np.x}px, ${np.y}px)`
      } else {
        node.style.opacity = '0'
      }
      if (np.id !== lastId.current) {
        lastId.current = np.id
        setId(np.id)
      }
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <div
      ref={el}
      aria-hidden
      style={{
        position: 'absolute',
        left: 0,
        top: 0,
        opacity: 0,
        pointerEvents: 'none',
        transition: 'opacity 120ms ease',
        willChange: 'transform, opacity',
        zIndex: 20,
      }}
    >
      {id && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '6px 8px',
            borderRadius: 6,
            background: 'rgba(11, 14, 26, 0.86)',
            border: '2px solid rgba(124, 154, 255, 0.9)',
            boxShadow: '0 4px 14px rgba(0, 0, 0, 0.45)',
            color: '#f4f2ff',
            whiteSpace: 'nowrap',
          }}
        >
          <span style={{ fontFamily: pixelFont, fontSize: 10, letterSpacing: 0.5 }}>
            {LABELS[id] ?? id}
          </span>
          <span
            style={{
              fontFamily: pixelFont,
              fontSize: 9,
              lineHeight: 1,
              padding: '3px 5px',
              borderRadius: 3,
              background: 'rgba(124, 154, 255, 0.2)',
              border: '1px solid rgba(124, 154, 255, 0.9)',
            }}
          >
            E
          </span>
        </div>
      )}
    </div>
  )
}
