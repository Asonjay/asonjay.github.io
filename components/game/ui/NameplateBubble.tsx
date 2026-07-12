'use client'
import { useEffect, useRef, useState } from 'react'
import { nameplateRef } from '../systems/store'
import { Nameplate } from './kit/Nameplate'
import { KeyHint } from './kit/KeyHint'

// Screen-space hint that floats above the nearby station: the station name plate
// + an "E" key cap, both from the UI kit. Position/opacity are driven straight
// from nameplateRef via rAF (no per-frame React state); only the label change
// triggers a re-render.
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
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Nameplate>{LABELS[id] ?? id}</Nameplate>
          <KeyHint>E</KeyHint>
        </div>
      )}
    </div>
  )
}
