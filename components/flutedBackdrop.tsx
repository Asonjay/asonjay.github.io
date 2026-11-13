'use client'

import { useEffect, useRef } from 'react'

// A soft colour field seen through fluted (reeded) glass.
//
// The scene is painted very small, then redrawn column by column with each
// column looking sideways by an amount that depends on where it sits in its
// glass rib. Across a rib the view sweeps over a much wider slice of the scene
// (the squeeze that makes fluted glass repeat what is behind it); at the rib's
// edge it folds smoothly back for the next one, so ribs melt into each other
// instead of meeting at a hard line. The soft light-and-shade on each rib is a
// CSS layer on top (.backdrop::after).

type Spot = {
  x: number // home position, 0..1 of scene width
  y: number // home position, 0..1 of scene height
  rx: number // radius, as a fraction of scene width
  ry: number // radius, as a fraction of scene height
  color: string
  roamX: number // how far it may wander from home, as a fraction of the scene
  roamY: number
  mover: number // spots sharing a mover travel together (the figure's head and body)
}

type Palette = { top: string; bottom: string; colors: string[] }

// Shape and wandering range of each spot; the two themes only recolour them.
const SPOTS: Omit<Spot, 'color'>[] = [
  { x: 0.85, y: 0.25, rx: 0.42, ry: 0.6, roamX: 0.26, roamY: 0.3, mover: 0 }, // sky glow
  { x: 0.15, y: 0.9, rx: 0.34, ry: 0.42, roamX: 0.3, roamY: 0.3, mover: 1 }, // pale rose
  { x: 0.42, y: 0.8, rx: 0.36, ry: 0.4, roamX: 0.32, roamY: 0.34, mover: 2 }, // rose
  { x: 0.34, y: 0.5, rx: 0.3, ry: 0.46, roamX: 0.3, roamY: 0.32, mover: 3 }, // coral
  { x: 0.31, y: 0.58, rx: 0.15, ry: 0.24, roamX: 0.34, roamY: 0.36, mover: 4 }, // orange core
  { x: 0.6, y: 0.2, rx: 0.075, ry: 0.15, roamX: 0.3, roamY: 0.14, mover: 5 }, // figure: head
  { x: 0.59, y: 0.74, rx: 0.14, ry: 0.56, roamX: 0.3, roamY: 0.14, mover: 5 }, // figure: body
]

const DUSK: Palette = {
  top: '#2c68b4',
  bottom: '#1a438a',
  colors: ['#63aee4', '#e9b7d3', '#dd7fae', '#ee6146', '#ff9150', '#0e2260', '#0e2260'],
}

const DAY: Palette = {
  top: '#9fcdf3',
  bottom: '#76b0e8',
  colors: ['#e2f3ff', '#fde3ee', '#f7b3d0', '#ff8f72', '#ffb27a', '#3a66c4', '#3a66c4'],
}

const SCENE_W = 224 // tiny on purpose: upscaling it is the blur
const SCENE_PAD = 40 // spare scene on each side so edge ribs have something to bend
// How much wider than itself each rib "sees". High enough that every rib
// carries its own visible gradient.
const LENS = 7
// Share of each rib spent folding the view back for the next rib. Zero is a
// hard edge line; much above 0.2 and the whole sheet starts to look blurred.
// This is about three pixels: enough to take the line away, no more.
const SEAM = 0.14
const COLUMN = 1 // screen pixels per canvas column
const FRAME_MS = 1000 / 30

// Where a column looks, from -1 (far left of the rib's slice) to 1 (far right).
// `u` runs 0..1 across one rib, with the seam centred on the rib boundary.
function bend(u: number) {
  const half = SEAM / 2
  if (u >= half && u <= 1 - half) return -1 + (2 * (u - half)) / (1 - SEAM)
  const t = (u < half ? u + half : u - (1 - half)) / SEAM
  return Math.cos(Math.PI * t)
}

// A wandering path: three sine waves of unrelated speeds added together on each
// axis. It never visibly repeats, has no sudden turns, and stays within -1..1.
type Wander = { speed: number[]; phase: number[] }

// Seconds for one swing of the slow, medium and quick wave.
const SWING = [67, 41, 23]
const WEIGHT = [1, 0.6, 0.35]
const WEIGHT_SUM = WEIGHT[0] + WEIGHT[1] + WEIGHT[2]

function newWander(): Wander {
  return {
    speed: SWING.map(s => (Math.PI * 2) / (s * (0.75 + Math.random() * 0.5))),
    phase: SWING.map(() => Math.random() * Math.PI * 2),
  }
}

function wanderAt(w: Wander, seconds: number) {
  let sum = 0
  for (let i = 0; i < 3; i++) sum += WEIGHT[i] * Math.sin(seconds * w.speed[i] + w.phase[i])
  return sum / WEIGHT_SUM
}

function paintScene(
  ctx: CanvasRenderingContext2D,
  palette: Palette,
  paths: { x: Wander; y: Wander }[],
  w: number,
  h: number,
  seconds: number
) {
  const base = ctx.createLinearGradient(0, 0, 0, h)
  base.addColorStop(0, palette.top)
  base.addColorStop(1, palette.bottom)
  ctx.globalAlpha = 1
  ctx.fillStyle = base
  ctx.fillRect(0, 0, w, h)

  SPOTS.forEach((spot, i) => {
    const path = paths[spot.mover]
    const color = palette.colors[i]
    const cx = (spot.x + wanderAt(path.x, seconds) * spot.roamX) * w
    const cy = (spot.y + wanderAt(path.y, seconds) * spot.roamY) * h

    // Unit-circle gradient stretched into an ellipse.
    ctx.save()
    ctx.translate(cx, cy)
    ctx.scale(spot.rx * w, spot.ry * h)
    const glow = ctx.createRadialGradient(0, 0, 0, 0, 0, 1)
    glow.addColorStop(0, color)
    glow.addColorStop(0.45, color)
    glow.addColorStop(1, `${color}00`) // same hue at zero alpha, so the edge doesn't grey out
    ctx.fillStyle = glow
    ctx.globalAlpha = 0.95
    ctx.beginPath()
    ctx.arc(0, 0, 1, 0, Math.PI * 2)
    ctx.fill()
    ctx.restore()
  })
}

export function FlutedBackdrop() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const scene = document.createElement('canvas')
    const sceneCtx = scene.getContext('2d')
    if (!ctx || !sceneCtx) return

    const root = document.documentElement
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')

    // One wandering path per mover, rolled fresh on every visit.
    const movers = Math.max(...SPOTS.map(s => s.mover)) + 1
    const paths = Array.from({ length: movers }, () => ({ x: newWander(), y: newWander() }))

    let frame = 0
    let lastPaint = 0
    // For every canvas column, the scene x it samples. Rebuilt on resize.
    let sourceX = new Float32Array(0)

    const resize = () => {
      const width = Math.max(1, Math.round(window.innerWidth))
      const height = Math.max(1, Math.round(window.innerHeight))
      const rib = parseFloat(getComputedStyle(root).getPropertyValue('--rib')) || 22
      // Nothing in the scene is sharp vertically, so a quarter of the height
      // is plenty.
      canvas.width = Math.ceil(width / COLUMN)
      canvas.height = Math.max(1, Math.round(height / 4))
      scene.width = SCENE_W
      scene.height = Math.max(48, Math.round((SCENE_W * height) / width))

      const perPixel = (SCENE_W - SCENE_PAD * 2) / width
      const reach = Math.min((rib * (LENS - 1)) / 2, (SCENE_PAD - 1) / perPixel)
      sourceX = new Float32Array(canvas.width)
      for (let column = 0; column < canvas.width; column++) {
        const x = (column + 0.5) * COLUMN
        const u = (x % rib) / rib
        sourceX[column] = SCENE_PAD + (x + reach * bend(u)) * perPixel
      }
    }

    const draw = (seconds: number) => {
      const palette = root.classList.contains('light') ? DAY : DUSK
      paintScene(sceneCtx, palette, paths, scene.width, scene.height, seconds)

      const { width, height } = canvas
      ctx.imageSmoothingEnabled = true
      for (let column = 0; column < width; column++) {
        ctx.drawImage(scene, sourceX[column] - 0.5, 0, 1, scene.height, column, 0, 1, height)
      }
    }

    const loop = (now: number) => {
      frame = requestAnimationFrame(loop)
      if (now - lastPaint < FRAME_MS) return
      lastPaint = now
      draw(now / 1000)
    }

    const start = () => {
      cancelAnimationFrame(frame)
      if (reducedMotion.matches) {
        draw(12) // one settled frame, no drift
      } else {
        frame = requestAnimationFrame(loop)
      }
    }

    const onResize = () => {
      resize()
      draw(performance.now() / 1000)
    }

    // The theme toggle swaps a class on <html>; repaint in the new palette.
    const themeWatcher = new MutationObserver(() => draw(performance.now() / 1000))
    themeWatcher.observe(root, { attributes: true, attributeFilter: ['class'] })

    resize()
    start()
    canvas.dataset.ready = 'true'
    window.addEventListener('resize', onResize)
    reducedMotion.addEventListener('change', start)

    return () => {
      cancelAnimationFrame(frame)
      themeWatcher.disconnect()
      window.removeEventListener('resize', onResize)
      reducedMotion.removeEventListener('change', start)
    }
  }, [])

  return (
    <div className="backdrop" aria-hidden="true">
      <canvas ref={canvasRef} />
    </div>
  )
}
