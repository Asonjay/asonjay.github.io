'use client'
import { useEffect, useReducer } from 'react'
import type { MutableRefObject } from 'react'

// Frame-sampled perf readouts, written by the in-canvas sampler (zero-alloc
// useFrame) and read here on a slow interval — never per frame, and never from
// the zustand store. Only mounted when the URL carries ?debug=1, so it costs
// nothing in normal play.
export type PerfStats = {
  fps: number
  dpr: number
  pxW: number
  pxH: number
}

// Small fixed-corner diagnostics box: 1s-average FPS, live dpr, physical canvas
// pixels, and the active sun-shadow tier. Repaints on a 500ms tick reading the
// shared ref; the governor owns the values, this only displays them.
export function DebugStats({
  statsRef,
  shadowMapSize,
}: {
  statsRef: MutableRefObject<PerfStats>
  shadowMapSize: number
}) {
  const [, repaint] = useReducer((n: number) => n + 1, 0)

  useEffect(() => {
    const id = window.setInterval(repaint, 500)
    return () => window.clearInterval(id)
  }, [])

  const s = statsRef.current
  const rows: [string, string][] = [
    ['FPS', String(s.fps)],
    ['DPR', s.dpr.toFixed(2)],
    ['PX', `${s.pxW}x${s.pxH}`],
    ['SHADOW', String(shadowMapSize)],
  ]

  return (
    <div
      className="gp-corners-lg gp-surface"
      aria-hidden="true"
      style={{
        position: 'fixed',
        top: 'calc(12px + env(safe-area-inset-top))',
        right: 'calc(12px + env(safe-area-inset-right))',
        zIndex: 40,
        padding: '7px 10px',
        display: 'grid',
        gridTemplateColumns: 'auto auto',
        columnGap: 10,
        rowGap: 2,
        fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
        fontSize: 11,
        lineHeight: 1.35,
        letterSpacing: '0.02em',
        color: 'var(--gp-text)',
        pointerEvents: 'none',
        userSelect: 'none',
      }}
    >
      {rows.map(([label, value]) => (
        <div key={label} style={{ display: 'contents' }}>
          <span style={{ color: 'var(--gp-accent-ink)' }}>{label}</span>
          <span style={{ textAlign: 'right' }}>{value}</span>
        </div>
      ))}
    </div>
  )
}
