'use client'

import { useEffect, useRef } from 'react'

// A soft colour field seen through fluted (reeded) glass.
//
// The scene is painted very small, then each glass rib redraws a wider slice
// of it squeezed into the rib's width. That squeeze is what makes real fluted
// glass repeat and offset whatever is behind it. The crisp rib highlights are
// a CSS layer on top (.backdrop::after), so the canvas itself can stay cheap.

type Spot = {
  x: number // centre, 0..1 of scene width
  y: number // centre, 0..1 of scene height
  rx: number // radius, as a fraction of scene width
  ry: number // radius, as a fraction of scene height
  color: string
  driftX: number // how far it wanders, as a fraction of the scene
  driftY: number
  period: number // seconds for one wander cycle
  phase: number
}

type Palette = { top: string; bottom: string; spots: Spot[] }

const DUSK: Palette = {
  top: '#2c68b4',
  bottom: '#1a438a',
  spots: [
    { x: 0.9, y: 0.2, rx: 0.42, ry: 0.6, color: '#63aee4', driftX: 0.04, driftY: 0.05, period: 46, phase: 0.3 },
    { x: 0.12, y: 0.98, rx: 0.34, ry: 0.42, color: '#e9b7d3', driftX: 0.05, driftY: 0.03, period: 38, phase: 2.1 },
    { x: 0.4, y: 0.86, rx: 0.36, ry: 0.4, color: '#dd7fae', driftX: 0.05, driftY: 0.04, period: 52, phase: 4.0 },
    { x: 0.34, y: 0.52, rx: 0.3, ry: 0.46, color: '#ee6146', driftX: 0.06, driftY: 0.05, period: 41, phase: 1.2 },
    { x: 0.31, y: 0.6, rx: 0.15, ry: 0.24, color: '#ff9150', driftX: 0.05, driftY: 0.06, period: 33, phase: 5.2 },
    { x: 0.6, y: 0.2, rx: 0.075, ry: 0.15, color: '#0e2260', driftX: 0.035, driftY: 0.012, period: 29, phase: 0.9 },
    { x: 0.59, y: 0.74, rx: 0.14, ry: 0.56, color: '#0e2260', driftX: 0.035, driftY: 0.012, period: 29, phase: 0.9 },
  ],
}

const DAY: Palette = {
  top: '#9fcdf3',
  bottom: '#76b0e8',
  spots: [
    { x: 0.9, y: 0.2, rx: 0.42, ry: 0.6, color: '#e2f3ff', driftX: 0.04, driftY: 0.05, period: 46, phase: 0.3 },
    { x: 0.12, y: 0.98, rx: 0.34, ry: 0.42, color: '#fde3ee', driftX: 0.05, driftY: 0.03, period: 38, phase: 2.1 },
    { x: 0.4, y: 0.86, rx: 0.36, ry: 0.4, color: '#f7b3d0', driftX: 0.05, driftY: 0.04, period: 52, phase: 4.0 },
    { x: 0.34, y: 0.52, rx: 0.3, ry: 0.46, color: '#ff8f72', driftX: 0.06, driftY: 0.05, period: 41, phase: 1.2 },
    { x: 0.31, y: 0.6, rx: 0.15, ry: 0.24, color: '#ffb27a', driftX: 0.05, driftY: 0.06, period: 33, phase: 5.2 },
    { x: 0.6, y: 0.2, rx: 0.075, ry: 0.15, color: '#3a66c4', driftX: 0.035, driftY: 0.012, period: 29, phase: 0.9 },
    { x: 0.59, y: 0.74, rx: 0.14, ry: 0.56, color: '#3a66c4', driftX: 0.035, driftY: 0.012, period: 29, phase: 0.9 },
  ],
}

const SCENE_W = 176 // tiny on purpose: upscaling it is the blur
const SCENE_PAD = 16 // spare scene on each side so edge ribs have something to bend
const LENS = 3.2 // how much wider than itself each rib "sees"
const FRAME_MS = 1000 / 24

function paintScene(
  ctx: CanvasRenderingContext2D,
  palette: Palette,
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

  for (const spot of palette.spots) {
    const angle = (seconds / spot.period) * Math.PI * 2 + spot.phase
    const cx = (spot.x + Math.sin(angle) * spot.driftX) * w
    const cy = (spot.y + Math.cos(angle * 0.8) * spot.driftY) * h
    const rx = spot.rx * w
    const ry = spot.ry * h

    // Unit-circle gradient stretched into an ellipse.
    ctx.save()
    ctx.translate(cx, cy)
    ctx.scale(rx, ry)
    const glow = ctx.createRadialGradient(0, 0, 0, 0, 0, 1)
    glow.addColorStop(0, spot.color)
    glow.addColorStop(0.45, spot.color)
    glow.addColorStop(1, `${spot.color}00`) // same hue at zero alpha, so the edge doesn't grey out
    ctx.fillStyle = glow
    ctx.globalAlpha = 0.95
    ctx.beginPath()
    ctx.arc(0, 0, 1, 0, Math.PI * 2)
    ctx.fill()
    ctx.restore()
  }
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

    let rib = 30
    let frame = 0
    let lastPaint = 0

    const resize = () => {
      const width = Math.max(1, Math.round(window.innerWidth))
      const height = Math.max(1, Math.round(window.innerHeight))
      rib = parseFloat(getComputedStyle(root).getPropertyValue('--rib')) || 30
      // Full width keeps rib edges on whole pixels; nothing in the scene is
      // sharp vertically, so a quarter of the height is plenty.
      canvas.width = width
      canvas.height = Math.max(1, Math.round(height / 4))
      scene.width = SCENE_W
      scene.height = Math.max(48, Math.round((SCENE_W * height) / width))
    }

    const draw = (seconds: number) => {
      const palette = root.classList.contains('light') ? DAY : DUSK
      paintScene(sceneCtx, palette, scene.width, scene.height, seconds)

      const { width, height } = canvas
      const inner = scene.width - SCENE_PAD * 2
      const perPixel = inner / width
      const sourceWidth = Math.min(rib * LENS * perPixel, SCENE_PAD * 2)

      ctx.imageSmoothingEnabled = true
      ctx.imageSmoothingQuality = 'high'
      for (let x = 0; x < width; x += rib) {
        const centre = SCENE_PAD + (x + rib / 2) * perPixel
        ctx.drawImage(
          scene,
          centre - sourceWidth / 2, 0, sourceWidth, scene.height,
          x, 0, rib, height
        )
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
