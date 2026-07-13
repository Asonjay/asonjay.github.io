'use client'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { World } from './scene/World'
import { Player } from './scene/Player'
import { FootstepDust } from './scene/FootstepDust'
import { StaticMerge } from './scene/StaticMerge'
import { Lighting } from './scene/Lighting'
import { playerPosRef, useGameStore } from './systems/store'
import { SPAWN, STATIONS } from './systems/worldLayout'
import { walkToStation } from './systems/walkTo'
import { makeRng, pickNextStation } from './systems/attract'
import { CAM_POS_LAMBDA, CAM_TARGET_LAMBDA, DELTA_CLAMP } from './systems/playerConfig'

// Slim sibling of VoxelHome for the homepage bento tile. It reuses the scene
// (Lighting/World/StaticMerge/FootstepDust/Player) but drops ALL interactive
// chrome — no PanelHost/HUD/Hotbar/Joystick/TapInteract/NameplateBubble/
// WelcomeToast, no input hook, no perf governor. Cost is fixed-low by
// construction (dpr [1,1.25], 1024 shadow map), so there is no PerformanceMonitor.
// The character plays himself via attract mode (systems/attract.ts + the game
// store's attractMode flag); hovering the tile makes him wave. /study is
// untouched — this file is a new entry, not a change to VoxelHome.

const damp = THREE.MathUtils.damp

// Iso framing: same +x/+y/+z diagonal as CameraRig, but tighter (VIEW_SIZE 8 vs
// VoxelHome's 10) and it gently follows the player so the wandering character is
// always in frame inside the small ~16:10 tile — a fixed frame would let him walk
// out of view (he roams the whole room + courtyard). No panel dolly here (there
// are no panels), so this is a strict subset of CameraRig — hence a local rig
// rather than importing CameraRig and disabling its dolly.
const VIEW_SIZE = 8
const OFF = 20

function TileCamera() {
  const camera = useThree((s) => s.camera) as THREE.OrthographicCamera
  const width = useThree((s) => s.size.width)
  const height = useThree((s) => s.size.height)
  const lookAt = useRef(new THREE.Vector3(SPAWN.x, 0, SPAWN.z))

  useLayoutEffect(() => {
    const aspect = width / height || 1
    camera.top = VIEW_SIZE
    camera.bottom = -VIEW_SIZE
    camera.left = -VIEW_SIZE * aspect
    camera.right = VIEW_SIZE * aspect
    camera.near = 0.1
    camera.far = 100
    camera.position.set(SPAWN.x + OFF, OFF, SPAWN.z + OFF)
    camera.lookAt(lookAt.current)
    camera.updateProjectionMatrix()
  }, [camera, width, height])

  useFrame((_, rawDelta) => {
    const dt = Math.min(rawDelta, DELTA_CLAMP)
    const p = playerPosRef.current
    camera.position.x = damp(camera.position.x, p.x + OFF, CAM_POS_LAMBDA, dt)
    camera.position.y = damp(camera.position.y, OFF, CAM_POS_LAMBDA, dt)
    camera.position.z = damp(camera.position.z, p.z + OFF, CAM_POS_LAMBDA, dt)
    lookAt.current.x = damp(lookAt.current.x, p.x, CAM_TARGET_LAMBDA, dt)
    lookAt.current.z = damp(lookAt.current.z, p.z, CAM_TARGET_LAMBDA, dt)
    camera.lookAt(lookAt.current)
  })

  return null
}

// Every station id, computed once — the wander target pool. The lamp is included
// (attract mode suppresses its theme flip in Player.startInteract), matching the
// brief's "exclude none".
const STATION_IDS = STATIONS.map((s) => s.id)

// Timing for the self-play loop.
const FIRST_DELAY = 0.8
const DWELL_MIN = 2
const DWELL_MAX = 4

// Drives attract mode: walk to a random station, dwell 2–4s (letting the arrival
// emote play), repeat. Owns the shared game store while mounted and hands it back
// clean on unmount so a later same-tab /study visit starts fresh. Zero per-frame
// allocation — a tiny ref state machine; walkToStation/findPath run only on the
// walk→dwell transition, never inside a steady frame.
function AttractDriver() {
  const rng = useRef(makeRng((Date.now() ^ 0x9e3779b9) >>> 0)).current
  const phase = useRef<'walk' | 'dwell'>('dwell')
  const timer = useRef(FIRST_DELAY)
  const current = useRef<string | null>(null)

  useEffect(() => {
    const g = useGameStore.getState()
    // Clear anything a prior /study session left in the shared store, park the
    // player at spawn, and turn attract mode on.
    g.setAutoWalk(null)
    g.openPanel(null)
    g.setActiveEmote(null)
    g.setMoveVector({ x: 0, z: 0 })
    g.setNearbyStation(null)
    playerPosRef.current.x = SPAWN.x
    playerPosRef.current.z = SPAWN.z
    g.setAttractMode(true)
    phase.current = 'dwell'
    timer.current = FIRST_DELAY
    current.current = null
    return () => {
      const s = useGameStore.getState()
      s.setAttractMode(false)
      s.setAutoWalk(null)
      s.setActiveEmote(null)
      s.openPanel(null)
      s.setMoveVector({ x: 0, z: 0 })
      // Restore the shared player-position singleton so a same-tab SPA nav to
      // /study opens the full game at spawn, not the tile's last wander spot
      // (VoxelHome/Player don't reset it on mount).
      playerPosRef.current.x = SPAWN.x
      playerPosRef.current.z = SPAWN.z
    }
  }, [])

  useFrame((_, rawDelta) => {
    const dt = Math.min(rawDelta, DELTA_CLAMP)
    const g = useGameStore.getState()

    if (phase.current === 'walk') {
      // Player clears autoWalk on arrival (and plays the station's emote); that is
      // our "arrived" signal. Then dwell so the gesture (or a hover wave) finishes.
      if (g.autoWalk === null) {
        phase.current = 'dwell'
        timer.current = DWELL_MIN + rng() * (DWELL_MAX - DWELL_MIN)
      }
      return
    }

    timer.current -= dt
    if (timer.current > 0) return
    // Never wander off mid-emote (arrival gesture or a hover wave) — wait it out.
    if (g.activeEmote !== null) {
      timer.current = 0.25
      return
    }
    const next = pickNextStation(STATION_IDS, current.current, rng)
    current.current = next
    if (walkToStation(next)) phase.current = 'walk'
    else timer.current = 0.4 // no route (shouldn't happen) — repick shortly
  })

  return null
}

// Follow the site's day/night theme live. useSafeLocalStorage doesn't sync across
// hook instances (the home theme toggle owns it), so rather than fork useDarkMode
// we mirror the class the toggle writes on <html>. Client-only (VoxelTile is a
// dynamic ssr:false import), so document is always present.
function useHtmlDark(): boolean {
  const [isDark, setIsDark] = useState(
    () => typeof document !== 'undefined' && document.documentElement.classList.contains('dark')
  )
  useEffect(() => {
    const root = document.documentElement
    const read = () => setIsDark(root.classList.contains('dark'))
    read()
    const obs = new MutationObserver(read)
    obs.observe(root, { attributes: true, attributeFilter: ['class'] })
    return () => obs.disconnect()
  }, [])
  return isDark
}

export default function VoxelTile({
  active,
  waveNonce = 0,
  onContextLost,
}: {
  active: boolean
  waveNonce?: number
  onContextLost?: () => void
}) {
  const isDark = useHtmlDark()

  // Hover / focus on the tile (GameTileLive, in the DOM) bumps waveNonce; turn
  // each change into one store wave request that Player consumes in its frame
  // loop. Runs with 0 on mount (no-op), then once per hover/focus.
  useEffect(() => {
    if (waveNonce > 0) useGameStore.getState().requestWave()
  }, [waveNonce])

  // WebGL context loss (GPU reset on a low-memory device) isn't a React error, so
  // the boundary can't catch it. Forward it to GameTileLive, which drops back to
  // the poster. Refs keep the listener stable and allow unmount cleanup.
  const onLostRef = useRef(onContextLost)
  onLostRef.current = onContextLost
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const handlerRef = useRef<((e: Event) => void) | null>(null)
  useEffect(() => {
    return () => {
      if (canvasRef.current && handlerRef.current) {
        canvasRef.current.removeEventListener('webglcontextlost', handlerRef.current)
      }
    }
  }, [])

  return (
    // Decorative surface: the tile's Enter link (in GameTile, untouched) is the
    // real interactive element, so the canvas is hidden from assistive tech.
    <div aria-hidden="true" style={{ position: 'absolute', inset: 0 }}>
      <Canvas
        orthographic
        dpr={[1, 1.25]}
        gl={{ antialias: true, powerPreference: 'high-performance' }}
        shadows
        // Offscreen / backgrounded tiles cost zero GPU: 'never' keeps the last
        // frame on the canvas without scheduling any rAF.
        frameloop={active ? 'always' : 'never'}
        onCreated={({ gl }) => {
          const canvas = gl.domElement
          const handler = () => onLostRef.current?.()
          canvasRef.current = canvas
          handlerRef.current = handler
          canvas.addEventListener('webglcontextlost', handler)
        }}
      >
        <Lighting isDark={isDark} shadowMapSize={1024} />
        <World />
        <Player />
        <FootstepDust />
        <TileCamera />
        <AttractDriver />
        {/* Runs last so its effect fires after furniture has mounted. */}
        <StaticMerge />
      </Canvas>
    </div>
  )
}
