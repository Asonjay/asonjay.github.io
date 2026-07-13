'use client'
import dynamic from 'next/dynamic'
import { useEffect, useRef, useState } from 'react'
import { useIsTouch } from '../game/systems/useIsTouch'

// three/r3f live ONLY in this async chunk. next/dynamic defers the import until
// <VoxelTile /> first renders, which the gate below withholds until the tile is
// near the viewport AND the browser is idle — so the homepage's initial paint and
// hydration never touch three. The poster underneath is the loading state. This
// module itself stays three-free (only react + next/dynamic + the touch hook,
// which imports nothing heavy), so it adds nothing meaningful to First-Load.
const VoxelTile = dynamic(() => import('../game/VoxelTile'), {
  ssr: false,
  loading: () => null,
})

const MD_QUERY = '(min-width: 768px)'

// Exact mirror of GameTile's VoxelMark + screen gradient (Task 13). It is the
// poster shown while the chunk loads and whenever the fallback matrix keeps the
// canvas off — kept byte-faithful so the live tile never regresses the placeholder.
function Poster() {
  return (
    <div
      aria-hidden="true"
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background:
          'radial-gradient(circle at 50% 42%, rgba(124,154,255,0.16), transparent 60%), radial-gradient(rgba(124,154,255,0.16) 1px, transparent 1px)',
        backgroundSize: 'auto, 14px 14px',
      }}
    >
      <svg
        width="46"
        height="46"
        viewBox="0 0 48 48"
        fill="none"
        stroke="#7c9aff"
        strokeWidth="1.6"
        strokeLinejoin="round"
        aria-hidden="true"
        style={{ opacity: 0.85 }}
      >
        <path d="M24 6 42 16 42 32 24 42 6 32 6 16Z" />
        <path d="M24 6 24 24 42 16" />
        <path d="M24 24 24 42" />
        <path d="M24 24 6 16" />
      </svg>
    </div>
  )
}

// The live voxel canvas that fills GameTile's preview "screen". Slots into the
// Task-13 children seam; the grid and every other tile are untouched.
export function GameTileLive() {
  const rootRef = useRef<HTMLDivElement>(null)
  const isTouch = useIsTouch()
  const [shouldLoad, setShouldLoad] = useState(false)
  const [activeCanvas, setActiveCanvas] = useState(false)
  // Bumping this asks VoxelTile (async chunk) to fire one wave. Kept as a prop
  // rather than a store call so this module never imports the game store — the
  // store (and its worldLayout deps) stay out of the homepage's sync bundle.
  const [waveNonce, setWaveNonce] = useState(0)
  // Latches on WebGL context loss so we fall back to the poster and don't thrash
  // re-mounting the canvas.
  const disabledRef = useRef(false)

  // Load gate + visibility pause. Everything here is client-only (browser APIs),
  // so it runs in an effect, never during SSR / the first hydration render.
  useEffect(() => {
    const el = rootRef.current
    if (!el) return

    // Fallback matrix — any hit keeps the poster and never loads three.
    const prefersReduced =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const belowMd =
      typeof window.matchMedia === 'function' && !window.matchMedia(MD_QUERY).matches
    const conn = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection
    const saveData = conn?.saveData === true
    if (isTouch || belowMd || prefersReduced || saveData) return

    let near = false
    let idle = false

    const recomputeActive = () => setActiveCanvas(near && !document.hidden)
    const maybeLoad = () => {
      if (near && idle && !disabledRef.current) setShouldLoad(true)
    }

    // (a) viewport proximity — 200px margin so the chunk is fetched just before
    //     the tile scrolls in, and drives the pause/resume of the canvas.
    const io = new IntersectionObserver(
      (entries) => {
        near = entries[0]?.isIntersecting ?? false
        maybeLoad()
        recomputeActive()
      },
      { rootMargin: '200px' }
    )
    io.observe(el)

    // (b) idle — never during initial paint/hydration; 1.5s timeout fallback.
    const w = window as Window & {
      requestIdleCallback?: (cb: () => void) => number
      cancelIdleCallback?: (id: number) => void
    }
    const onIdle = () => {
      idle = true
      maybeLoad()
    }
    const usedRic = typeof w.requestIdleCallback === 'function'
    const idleId = usedRic ? w.requestIdleCallback!(onIdle) : window.setTimeout(onIdle, 1500)

    const onVisibility = () => recomputeActive()
    document.addEventListener('visibilitychange', onVisibility)

    return () => {
      io.disconnect()
      document.removeEventListener('visibilitychange', onVisibility)
      if (usedRic) w.cancelIdleCallback?.(idleId)
      else window.clearTimeout(idleId)
    }
  }, [isTouch])

  // Wave on hover / keyboard focus of the whole tile card. Listeners live on the
  // GameTile host (its Enter link is the focus target), found via closest() so
  // GameTile stays untouched. Only wired once a live canvas exists.
  useEffect(() => {
    if (!shouldLoad) return
    const host = rootRef.current?.closest('.home-card')
    if (!host) return
    const wave = () => setWaveNonce((n) => n + 1)
    const onEnter = () => wave()
    const onFocusIn = () => {
      const a = document.activeElement
      if (!(a instanceof HTMLElement)) return
      // focus-visible = keyboard focus; a mouse click on the link (which then
      // navigates away) shouldn't wave. Wave anyway if the engine lacks the
      // selector rather than swallow keyboard users.
      try {
        if (a.matches(':focus-visible')) wave()
      } catch {
        wave()
      }
    }
    host.addEventListener('pointerenter', onEnter)
    host.addEventListener('focusin', onFocusIn)
    return () => {
      host.removeEventListener('pointerenter', onEnter)
      host.removeEventListener('focusin', onFocusIn)
    }
  }, [shouldLoad])

  return (
    <div ref={rootRef} aria-hidden="true" style={{ position: 'absolute', inset: 0 }}>
      <Poster />
      {shouldLoad && (
        <VoxelTile
          active={activeCanvas}
          waveNonce={waveNonce}
          onContextLost={() => {
            disabledRef.current = true
            setShouldLoad(false)
          }}
        />
      )}
    </div>
  )
}
