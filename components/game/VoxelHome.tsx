'use client'
import { useEffect, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
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

// Stable dpr ranges (module-level so a theme re-render never hands the Canvas a
// fresh array). Touch GPUs get a lower cap than desktop.
const DPR_TOUCH: [number, number] = [1, 1.75]
const DPR_DESKTOP: [number, number] = [1, 2]

export default function VoxelHome({
  data,
  onContextLost,
}: {
  data: WorldData
  onContextLost?: () => void
}) {
  useInput()
  const isTouch = useIsTouch()

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
          // Cap the pixel ratio lower on touch GPUs (mobile) than on desktop.
          dpr={isTouch ? DPR_TOUCH : DPR_DESKTOP}
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
          <Lighting isDark={Boolean(isDark)} />
          <World />
          <Player />
          <Systems />
          <FootstepDust />
          <CameraRig />
          {/* Tap/click the scene to interact — reads the store, no scene state. */}
          <TapInteract />
          {/* Runs last so its effect fires after furniture has mounted. */}
          <StaticMerge />
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
    </div>
  )
}
