'use client'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { MutableRefObject } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { PerformanceMonitor } from '@react-three/drei'
import type { WorldData } from '../../types/world'
import { World } from './scene/World'
import { Player } from './scene/Player'
import { CameraRig } from './scene/CameraRig'
import { Systems } from './scene/Systems'
import { FootstepDust } from './scene/FootstepDust'
import { StaticMerge } from './scene/StaticMerge'
import { Lighting } from './scene/Lighting'
import { TapInteract } from './scene/TapInteract'
import { NameplateBubble } from './ui/NameplateBubble'
import { PanelHost } from './ui/PanelHost'
import { Hotbar } from './ui/Hotbar'
import { HotbarSheet } from './ui/HotbarSheet'
import { Joystick } from './ui/Joystick'
import { InteractButton } from './ui/InteractButton'
import { HUD } from './ui/HUD'
import { WelcomeToast } from './ui/WelcomeToast'
import { useInput } from './systems/useInput'
import { useIsTouch } from './systems/useIsTouch'
import { useGameStore } from './systems/store'
import { useDarkMode } from '../../hooks/useDarkMode'
import { DebugStats } from './ui/DebugStats'
import type { PerfStats } from './ui/DebugStats'
import { effectiveDpr, dprFromFactor, shadowTier, MIN_DPR } from './systems/perfGovernor'

// Dpr ranges (module-level). Their max is now the hard ceiling for the perf
// governor — the largest device-pixel-ratio it may ever request — while the
// governor's own floor is MIN_DPR. Touch GPUs get a lower ceiling than desktop.
const DPR_TOUCH: [number, number] = [1, 1.75]
const DPR_DESKTOP: [number, number] = [1, 2]

// Adaptive FPS window (60Hz panel): decline below 45, incline above 58. Module
// scope keeps the PerformanceMonitor prop identity stable across renders.
const boundsFps = (): [number, number] => [45, 58]

// Budget-based dpr seed plus the adaptive ceiling for the current viewport.
// deviceDpr is read fresh each call (a window can move between monitors of
// different density). SSR-safe: falls back to the cap when window is absent.
function computeBudget(capDpr: number): { budgetDpr: number; maxDpr: number } {
  if (typeof window === 'undefined') return { budgetDpr: capDpr, maxDpr: capDpr }
  const device = window.devicePixelRatio || 1
  return {
    budgetDpr: effectiveDpr(window.innerWidth, window.innerHeight, device, capDpr),
    maxDpr: Math.min(device, capDpr),
  }
}

// Zero-allocation FPS/pixel sampler. Inside the Canvas (needs useFrame) and only
// mounted under ?debug=1, so it costs nothing in normal play. Writes the shared
// stats ref on a ~1s cadence; the DOM overlay reads it on its own interval. Only
// scalar refs mutate per frame — no allocations.
function DebugSampler({ statsRef }: { statsRef: MutableRefObject<PerfStats> }) {
  const gl = useThree((s) => s.gl)
  const frames = useRef(0)
  const elapsed = useRef(0)
  useFrame((_, delta) => {
    frames.current += 1
    elapsed.current += delta
    if (elapsed.current >= 1) {
      const s = statsRef.current
      s.fps = Math.round(frames.current / elapsed.current)
      s.dpr = gl.getPixelRatio()
      s.pxW = gl.domElement.width
      s.pxH = gl.domElement.height
      frames.current = 0
      elapsed.current = 0
    }
  })
  return null
}

export default function VoxelHome({
  data,
  onContextLost,
}: {
  data: WorldData
  onContextLost?: () => void
}) {
  useInput()
  const isTouch = useIsTouch()
  const capDpr = (isTouch ? DPR_TOUCH : DPR_DESKTOP)[1]

  // --- Big-screen performance governor -------------------------------------
  // The only render cost that scales with monitor size is fragment fill
  // (physical px = cssW*cssH*dpr^2), so on large displays we cap dpr to a fixed
  // pixel budget, then let an FPS-driven adaptive layer earn resolution back on
  // strong GPUs or shed it on weak ones. See systems/perfGovernor.ts.

  // Budget dpr + adaptive ceiling for this viewport, recomputed on debounced
  // resize (and immediately if the input mode / cap changes). No per-frame work.
  const [budget, setBudget] = useState(() => computeBudget(capDpr))
  useEffect(() => {
    const recompute = () => {
      const next = computeBudget(capDpr)
      setBudget((prev) =>
        prev.budgetDpr === next.budgetDpr && prev.maxDpr === next.maxDpr ? prev : next
      )
    }
    recompute()
    let t = 0
    const onResize = () => {
      window.clearTimeout(t)
      t = window.setTimeout(recompute, 250)
    }
    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('resize', onResize)
      window.clearTimeout(t)
    }
  }, [capDpr])

  // Factor that reproduces the budget dpr — seeds PerformanceMonitor so its first
  // sample doesn't jump the resolution away from the budget-picked starting point.
  const seedFactor = useMemo(() => {
    const span = budget.maxDpr - MIN_DPR
    return span > 0 ? Math.min(1, Math.max(0, (budget.budgetDpr - MIN_DPR) / span)) : 0
  }, [budget])

  // Rendered dpr: the single source of truth for the Canvas (r3f re-applies the
  // dpr prop on every render, so imperative setDpr would be stomped — state wins).
  // Seeded to the budget; the adaptive layer moves it within [MIN_DPR, maxDpr];
  // re-seeds when the budget changes (resize / monitor move).
  const [canvasDpr, setCanvasDpr] = useState(budget.budgetDpr)
  useEffect(() => setCanvasDpr(budget.budgetDpr), [budget.budgetDpr])

  // Sun-shadow tier follows the same factor (base = Lighting's own default).
  const baseShadow = isTouch ? 1024 : 2048
  const [shadowMapSize, setShadowMapSize] = useState(() => shadowTier(seedFactor, baseShadow))
  useEffect(() => setShadowMapSize(shadowTier(seedFactor, baseShadow)), [seedFactor, baseShadow])

  // PerformanceMonitor feeds a stable callback; latest maxDpr/base come via refs.
  const maxDprRef = useRef(budget.maxDpr)
  maxDprRef.current = budget.maxDpr
  const baseShadowRef = useRef(baseShadow)
  baseShadowRef.current = baseShadow
  const handlePerfChange = useCallback((api: { factor: number }) => {
    setCanvasDpr(dprFromFactor(api.factor, MIN_DPR, maxDprRef.current))
    const tier = shadowTier(api.factor, baseShadowRef.current)
    setShadowMapSize((prev) => (prev === tier ? prev : tier))
  }, [])

  // Debug overlay gate: read once (client-only). ?debug=1 mounts the in-canvas
  // sampler + the DOM stats box; otherwise both are absent (zero runtime cost).
  const [debug] = useState(() => {
    if (typeof window === 'undefined') return false
    return new URLSearchParams(window.location.search).get('debug') === '1'
  })
  const statsRef = useRef<PerfStats>({ fps: 0, dpr: budget.budgetDpr, pxW: 0, pxH: 0 })

  // WebGL context loss (GPU reset, tab backgrounded on a low-memory device) is a
  // DOM event on the canvas, not a React error — capture it here and forward it
  // to GameLoader, which shows the fallback card. Refs keep the listener stable
  // and stale-closure-free, and let the unmount cleanup remove it.
  const onContextLostRef = useRef(onContextLost)
  onContextLostRef.current = onContextLost
  const lostCanvasRef = useRef<HTMLCanvasElement | null>(null)
  const lostHandlerRef = useRef<((e: Event) => void) | null>(null)
  useEffect(() => {
    return () => {
      if (lostCanvasRef.current && lostHandlerRef.current) {
        lostCanvasRef.current.removeEventListener('webglcontextlost', lostHandlerRef.current)
      }
    }
  }, [])

  // Site theme is the source of truth for day/night (localStorage `dark-mode` +
  // .dark/.light on <html>). Read it here, outside the canvas, and pass it in as
  // a prop — hooks/context don't cross the R3F <Canvas> boundary.
  const [isDark, setIsDark] = useDarkMode()

  // Lamp -> theme bridge. The in-canvas lamp station bumps a request counter in
  // the store (it can't call the DOM hook); flip the real theme once per bump.
  // Refs keep the subscription registered once and free of stale closures.
  const isDarkRef = useRef(isDark)
  isDarkRef.current = isDark
  const setIsDarkRef = useRef(setIsDark)
  setIsDarkRef.current = setIsDark
  useEffect(() => {
    return useGameStore.subscribe((state, prev) => {
      if (state.themeToggleRequests !== prev.themeToggleRequests) {
        setIsDarkRef.current(!isDarkRef.current)
      }
    })
  }, [])

  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      {/* The 3D surface is decorative to assistive tech — the panels, hotbar, HUD
          and the hidden SEO block are the accessible/crawlable content. */}
      <div aria-hidden="true" style={{ position: 'absolute', inset: 0 }}>
        <Canvas
          orthographic
          // Pixel-budget dpr for this viewport, then adapted by PerformanceMonitor
          // below. r3f re-applies this prop every render, so it is the sole owner
          // of dpr (see the governor state above).
          dpr={canvasDpr}
          gl={{ antialias: true, powerPreference: 'high-performance' }}
          shadows
          onCreated={({ gl }) => {
            const canvas = gl.domElement
            const handler = () => onContextLostRef.current?.()
            lostCanvasRef.current = canvas
            lostHandlerRef.current = handler
            canvas.addEventListener('webglcontextlost', handler)
          }}
        >
          <Lighting isDark={Boolean(isDark)} shadowMapSize={shadowMapSize} />
          <World />
          <Player />
          <Systems />
          <FootstepDust />
          <CameraRig />
          {/* Tap/click the scene to interact — reads the store, no scene state. */}
          <TapInteract />
          {/* Runs last so its effect fires after furniture has mounted. */}
          <StaticMerge />
          {/* Adaptive quality: samples FPS (~2s cadence, drei-owned hysteresis)
              and nudges dpr within [MIN_DPR, maxDpr]. Keyed by the budget so a
              resize remounts it with a fresh, size-appropriate factor seed. */}
          <PerformanceMonitor
            key={budget.budgetDpr}
            factor={seedFactor}
            ms={250}
            iterations={8}
            bounds={boundsFps}
            onChange={handlePerfChange}
          />
          {debug && <DebugSampler statsRef={statsRef} />}
        </Canvas>
      </div>
      <HUD />
      <NameplateBubble />
      <PanelHost data={data} />
      {/* Hotbar lives outside the Canvas: it owns the DOM theme toggle and passes
          it in so VoxelHome stays the single useDarkMode owner (keeping the site
          theme, 3D lighting, lamp and the sun/moon icon all in sync). The desktop
          Hotbar and the touch chrome are mutually exclusive (each self-gates on
          useIsTouch), so only one set renders. */}
      <Hotbar
        data={data}
        isDark={Boolean(isDark)}
        onToggleTheme={() => setIsDark(!isDark)}
      />
      <Joystick />
      <InteractButton />
      <HotbarSheet
        data={data}
        isDark={Boolean(isDark)}
        onToggleTheme={() => setIsDark(!isDark)}
      />
      <WelcomeToast />
      {/* Diagnostics overlay — only under ?debug=1. Reads the sampler's ref on a
          slow interval; never touches the store or renders per frame. */}
      {debug && <DebugStats statsRef={statsRef} shadowMapSize={shadowMapSize} />}
    </div>
  )
}
