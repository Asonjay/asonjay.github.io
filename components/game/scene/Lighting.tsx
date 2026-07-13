'use client'
import { useEffect, useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { reducedMotionRef } from '../systems/reducedMotion'
import { DELTA_CLAMP } from '../systems/playerConfig'

// F4 — day/night lighting. Every light in the room is owned here so one useFrame
// can crossfade the whole scene between the two modes when the site theme flips.
// (Exception: the courtyard garden lamppost owns its own night light + crossfade,
// in scene/furniture/GardenLamp.tsx — its brief forbade touching Lighting.)
// The active mode follows the site's own light/dark theme (isDark prop, sourced
// from useDarkMode at the VoxelHome level); the floor lamp toggles it in-game.
//
// Values below are the authoritative light inventory from task-4-brief. Colors
// listed once (floor/desk lamp, neon accent, sun) never change hue — only their
// intensity animates — so they are set as fixed props and left out of the damp.
// Ground-bounce tones for the hemisphere fill are craft (the brief specifies one
// ambient value per mode, mapped to the sky color); the ground is a muted match.

const damp = THREE.MathUtils.damp
const LAMBDA = 3 // ~1s settle for the crossfade (frame-rate independent)

type Mode = {
  bg: string
  ambSky: string
  ambGround: string
  ambIntensity: number
  sunIntensity: number
  floorLamp: number
  deskLamp: number
  neonEmissive: number
  neonLight: number
}

const DAY: Mode = {
  bg: '#87ceeb',
  ambSky: '#ffffff',
  ambGround: '#b9a888',
  ambIntensity: 0.85, // R3 brightness pass +31% (was 0.65) — lift the day fill
  sunIntensity: 1.05, // R3 brightness pass +17% (was 0.9)
  floorLamp: 0,
  deskLamp: 0,
  neonEmissive: 0.1,
  neonLight: 0,
}

const NIGHT: Mode = {
  bg: '#0b0e1a',
  ambSky: '#333344', // brief "#334" tint
  ambGround: '#0e0f18',
  ambIntensity: 0.35, // R3 brightness pass +40% (was 0.25) — lift crushed night blacks
  sunIntensity: 0.0, // no moon directional exists — sun stays fully off at night (shadows skipped)
  floorLamp: 1.2,
  deskLamp: 0.8,
  neonEmissive: 1.0,
  neonLight: 0.5,
}

// Pre-built color targets (module load) — reused read-only as damp targets so
// the per-frame loop allocates nothing.
const TARGETS = {
  day: {
    bg: new THREE.Color(DAY.bg),
    ambSky: new THREE.Color(DAY.ambSky),
    ambGround: new THREE.Color(DAY.ambGround),
  },
  night: {
    bg: new THREE.Color(NIGHT.bg),
    ambSky: new THREE.Color(NIGHT.ambSky),
    ambGround: new THREE.Color(NIGHT.ambGround),
  },
}

// Fixed light colors (hue never animates — only intensity does).
const SUN_COLOR = '#fff4e0'
const FLOOR_LAMP_COLOR = '#ffb066'
const DESK_LAMP_COLOR = '#ffd9a0'
const NEON_COLOR = '#7c9aff' // site accent

// Exponential approach toward a scalar target; snaps instantly under reduced
// motion (no per-frame allocation — module-level, not a closure).
function approach(cur: number, target: number, dt: number, snap: boolean): number {
  return snap ? target : damp(cur, target, LAMBDA, dt)
}

// Same, per color channel, mutating the color in place.
function dampColor(c: THREE.Color, target: THREE.Color, dt: number, snap: boolean): void {
  if (snap) {
    c.copy(target)
    return
  }
  c.r = damp(c.r, target.r, LAMBDA, dt)
  c.g = damp(c.g, target.g, LAMBDA, dt)
  c.b = damp(c.b, target.b, LAMBDA, dt)
}

export function Lighting({
  isDark,
  shadowMapSize,
}: {
  isDark: boolean
  shadowMapSize?: number
}) {
  const scene = useThree((s) => s.scene)

  const hemi = useRef<THREE.HemisphereLight>(null)
  const sun = useRef<THREE.DirectionalLight>(null)
  const floorLamp = useRef<THREE.PointLight>(null)
  const deskLamp = useRef<THREE.PointLight>(null)
  const neonLight = useRef<THREE.PointLight>(null)

  // Latest theme, read every frame from a ref so the loop never sees a stale
  // closure regardless of when useFrame re-subscribes.
  const isDarkRef = useRef(isDark)
  isDarkRef.current = isDark

  // Mode captured once at mount drives the initial values so first paint matches
  // the current theme (default dark => night) with no white flash — the frame
  // loop owns every value after that, and React never resets them because these
  // initial props are stable for the component's life.
  const mount = useRef<Mode>(isDark ? NIGHT : DAY).current

  // Higher-res shadows on desktop, lighter on touch devices. Evaluated once; the
  // optional shadowMapSize prop (perf governor) overrides it when supplied.
  const defaultShadow = useMemo(
    () => (typeof navigator !== 'undefined' && navigator.maxTouchPoints > 0 ? 1024 : 2048),
    []
  )
  const shadowSize = shadowMapSize ?? defaultShadow

  // Shadow size is set in two deliberate places: the JSX shadow-mapSize prop (below)
  // supplies the mount size; this effect owns runtime tier changes. Keep both halves.
  // Three allocates the shadow render target once, so a runtime tier change won't
  // take effect from the shadow-mapSize prop alone: dispose the existing map and
  // null it so WebGLShadowMap rebuilds it at the new resolution on the next shadow
  // pass. Done here (not by remounting the light) so the crossfade state survives.
  useEffect(() => {
    const light = sun.current
    if (!light) return
    light.shadow.mapSize.set(shadowSize, shadowSize)
    light.shadow.map?.dispose()
    light.shadow.map = null
  }, [shadowSize])

  // Neon strip material — emissive slat above the TV. Only its emissiveIntensity
  // animates (day 0.1 -> night 1.0); toneMapped off so the accent glow stays
  // saturated. Created once; the damp loop mutates it.
  const neonMat = useMemo(() => {
    const m = new THREE.MeshStandardMaterial({
      color: '#0b1024',
      emissive: NEON_COLOR,
      emissiveIntensity: mount.neonEmissive,
    })
    m.toneMapped = false
    return m
  }, [mount])

  // Stable single-element args array so R3F never reconstructs scene.background
  // (which would fight the damp). Value is the mount mode's clear color.
  const bgArgs = useRef<[string]>([mount.bg]).current

  useFrame((_, rawDelta) => {
    const dt = Math.min(rawDelta, DELTA_CLAMP)
    const snap = reducedMotionRef.current
    const dark = isDarkRef.current
    const t = dark ? NIGHT : DAY
    const tc = dark ? TARGETS.night : TARGETS.day

    const h = hemi.current
    if (h) {
      dampColor(h.color, tc.ambSky, dt, snap)
      dampColor(h.groundColor, tc.ambGround, dt, snap)
      h.intensity = approach(h.intensity, t.ambIntensity, dt, snap)
    }

    const su = sun.current
    if (su) {
      su.intensity = approach(su.intensity, t.sunIntensity, dt, snap)
      // Skip the shadow-map render once the sun has faded out (night).
      su.castShadow = su.intensity > 0.02
    }

    if (floorLamp.current)
      floorLamp.current.intensity = approach(floorLamp.current.intensity, t.floorLamp, dt, snap)
    if (deskLamp.current)
      deskLamp.current.intensity = approach(deskLamp.current.intensity, t.deskLamp, dt, snap)
    if (neonLight.current)
      neonLight.current.intensity = approach(neonLight.current.intensity, t.neonLight, dt, snap)

    neonMat.emissiveIntensity = approach(neonMat.emissiveIntensity, t.neonEmissive, dt, snap)

    const bg = scene.background
    if (bg instanceof THREE.Color) dampColor(bg, tc.bg, dt, snap)
  })

  return (
    <>
      <color attach="background" args={bgArgs} />

      {/* Sky/ground fill. */}
      <hemisphereLight
        ref={hemi}
        color={mount.ambSky}
        groundColor={mount.ambGround}
        intensity={mount.ambIntensity}
      />

      {/* Sun — daylight through the window on the far (-Z) backdrop wall. Fixed
          position + generous shadow box so shadows stay put as the camera moves.
          Only this light casts shadows. */}
      <directionalLight
        ref={sun}
        position={[8, 16, -14]}
        color={SUN_COLOR}
        intensity={mount.sunIntensity}
        castShadow
        shadow-mapSize={[shadowSize, shadowSize]}
        shadow-camera-left={-24}
        shadow-camera-right={24}
        shadow-camera-top={24}
        shadow-camera-bottom={-24}
        shadow-camera-near={0.5}
        shadow-camera-far={90}
      />

      {/* Floor lamp (near the sofa) — off by day, warm by night. */}
      <pointLight
        ref={floorLamp}
        position={[-7.3, 2.5, 1.6]}
        color={FLOOR_LAMP_COLOR}
        distance={7}
        intensity={mount.floorLamp}
      />

      {/* Desk lamp (over the publications desk) — off by day, warm by night. */}
      <pointLight
        ref={deskLamp}
        position={[-2, 1.9, -8.3]}
        color={DESK_LAMP_COLOR}
        distance={5}
        intensity={mount.deskLamp}
      />

      {/* Neon strip above the TV on the -X wall: emissive slat + faint accent
          light. Marked dynamic so StaticMerge never freezes the glow. */}
      <mesh position={[-11.8, 3.75, 0]} material={neonMat} userData={{ dynamic: true }}>
        <boxGeometry args={[0.08, 0.16, 3.0]} />
      </mesh>
      <pointLight
        ref={neonLight}
        position={[-11.2, 3.6, 0]}
        color={NEON_COLOR}
        distance={7}
        intensity={mount.neonLight}
      />
    </>
  )
}
