'use client'

import { useEffect, useRef } from 'react'

// Ribbons of light flowing behind fluted ("fractal") glass.
//
// The scene is painted very small: a dark field with a few soft, glowing bands
// that bend and travel like silk. It is then redrawn column by column, each
// column looking sideways by an amount that depends on where it sits in its
// glass rib. Across a rib the view sweeps over a much wider slice of the scene,
// so a slanted band turns into a row of steep, feathered strokes that step from
// rib to rib. At the rib's edge the view folds quickly back for the next one,
// which keeps the edge from reading as a drawn line. The faint light-and-shade
// on each rib is a CSS layer on top (.backdrop::after).

type Ribbon = {
  y: number // resting height, 0..1 of the scene
  width: number // thickness, as a fraction of scene height
  swell: number // how far its waves rise and fall, as a fraction of scene height
  crests: number // waves across the screen
  period: number // seconds for a wave to travel one full cycle
  strength: number // opacity of each soft layer; higher is a brighter core
}

type Palette = {
  top: string
  bottom: string
  colors: string[]
  // 'lighter' adds light on a dark field; 'source-over' lays tint on a pale one
  blend: GlobalCompositeOperation
}

// Painted back to front: a broad dim wash, the main band, a thin bright one.
const RIBBONS: Ribbon[] = [
  { y: 0.62, width: 0.44, swell: 0.16, crests: 0.55, period: 46, strength: 0.04 },
  { y: 0.52, width: 0.26, swell: 0.2, crests: 0.8, period: 31, strength: 0.085 },
  { y: 0.36, width: 0.13, swell: 0.24, crests: 1.05, period: 24, strength: 0.085 },
]

const DUSK: Palette = {
  top: '#050f26',
  bottom: '#0a1c42',
  colors: ['#ff5f3d', '#ffa63f', '#b9dcff'],
  blend: 'lighter',
}

const DAY: Palette = {
  top: '#e6eff9',
  bottom: '#cfe0f4',
  colors: ['#f6a9c9', '#ff8a5c', '#5f9df0'],
  blend: 'source-over',
}

const SCENE_W = 224 // tiny on purpose: upscaling it is the blur
const SCENE_PAD = 40 // spare scene on each side so edge ribs have something to bend
// How much wider than itself each rib "sees". High enough that every rib
// carries its own visible gradient.
const LENS = 5.5
// Share of each rib spent folding the view back for the next rib. Zero is a
// hard edge line; much above 0.2 and the whole sheet starts to look blurred.
const SEAM = 0.12
const LAYERS = 10 // soft layers per ribbon, widest first
const SEGMENTS = 40
const FRAME_MS = 1000 / 30

// Where a column looks, from -1 (far left of the rib's slice) to 1 (far right).
// `u` runs 0..1 across one rib, with the seam centred on the rib boundary.
function bend(u: number) {
  const half = SEAM / 2
  if (u >= half && u <= 1 - half) return -1 + (2 * (u - half)) / (1 - SEAM)
  const t = (u < half ? u + half : u - (1 - half)) / SEAM
  return Math.cos(Math.PI * t)
}

// A wandering value: three sine waves of unrelated speeds added together. It
// never visibly repeats, has no sudden turns, and stays within -1..1.
type Wander = { speed: number[]; phase: number[] }

const SWING = [71, 43, 26] // seconds for one swing of the slow, medium, quick wave
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

// What makes each ribbon's motion its own; rolled fresh on every visit.
type Motion = { rise: Wander; tilt: Wander; phase: number; phase2: number; direction: number }

function newMotion(): Motion {
  return {
    rise: newWander(),
    tilt: newWander(),
    phase: Math.random() * Math.PI * 2,
    phase2: Math.random() * Math.PI * 2,
    direction: Math.random() < 0.5 ? 1 : -1,
  }
}

function paintScene(
  ctx: CanvasRenderingContext2D,
  palette: Palette,
  motions: Motion[],
  w: number,
  h: number,
  seconds: number
) {
  ctx.globalCompositeOperation = 'source-over'
  ctx.globalAlpha = 1
  const base = ctx.createLinearGradient(0, 0, 0, h)
  base.addColorStop(0, palette.top)
  base.addColorStop(1, palette.bottom)
  ctx.fillStyle = base
  ctx.fillRect(0, 0, w, h)

  ctx.globalCompositeOperation = palette.blend
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'

  RIBBONS.forEach((ribbon, i) => {
    const motion = motions[i]
    const travel = motion.direction * (seconds / ribbon.period) * Math.PI * 2
    const rise = wanderAt(motion.rise, seconds) * 0.2
    const tilt = wanderAt(motion.tilt, seconds) * 0.55

    // The ribbon's centre line: a slow wave travelling sideways, a second wave
    // running against it so it never just slides, plus a drifting slope.
    ctx.beginPath()
    for (let s = 0; s <= SEGMENTS; s++) {
      const x = s / SEGMENTS
      const y =
        ribbon.y +
        rise +
        tilt * (x - 0.5) +
        ribbon.swell * Math.sin(x * ribbon.crests * Math.PI * 2 + travel + motion.phase) +
        ribbon.swell * 0.45 * Math.sin(x * ribbon.crests * 2.9 - travel * 0.6 + motion.phase2)
      if (s === 0) ctx.moveTo(x * w, y * h)
      else ctx.lineTo(x * w, y * h)
    }

    // Stack ever-narrower strokes: a soft edge that builds to a bright core.
    ctx.strokeStyle = palette.colors[i]
    ctx.globalAlpha = ribbon.strength
    for (let layer = 0; layer < LAYERS; layer++) {
      ctx.lineWidth = ribbon.width * h * (1 - layer / LAYERS)
      ctx.stroke()
    }
  })

  ctx.globalCompositeOperation = 'source-over'
  ctx.globalAlpha = 1
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
    const motions = RIBBONS.map(newMotion)

    let frame = 0
    let lastPaint = 0
    // For every canvas column, the scene x it samples. Rebuilt on resize.
    let sourceX = new Float32Array(0)

    const resize = () => {
      const width = Math.max(1, Math.round(window.innerWidth))
      const height = Math.max(1, Math.round(window.innerHeight))
      const rib = parseFloat(getComputedStyle(root).getPropertyValue('--rib')) || 28
      // One canvas column per screen pixel keeps the ribs crisp; the bands are
      // soft top to bottom, so a third of the height is plenty.
      canvas.width = width
      canvas.height = Math.max(1, Math.round(height / 3))
      scene.width = SCENE_W
      scene.height = Math.max(64, Math.round((SCENE_W * height) / width))

      const perPixel = (SCENE_W - SCENE_PAD * 2) / width
      const reach = Math.min((rib * (LENS - 1)) / 2, (SCENE_PAD - 1) / perPixel)
      sourceX = new Float32Array(width)
      for (let column = 0; column < width; column++) {
        const x = column + 0.5
        const u = (x % rib) / rib
        sourceX[column] = SCENE_PAD + (x + reach * bend(u)) * perPixel
      }
    }

    const draw = (seconds: number) => {
      const palette = root.classList.contains('light') ? DAY : DUSK
      paintScene(sceneCtx, palette, motions, scene.width, scene.height, seconds)

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
        draw(12) // one settled frame, no motion
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
