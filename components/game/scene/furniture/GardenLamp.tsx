'use client'
import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { Voxel, PALETTE } from './Voxel'
import { reducedMotionRef } from '../../systems/reducedMotion'
import { DELTA_CLAMP } from '../../systems/playerConfig'

// Non-station decor: a garden lamppost lighting the courtyard path. Its warm
// point light and glowing pane are ON at night, OFF by day, crossfading with the
// site theme. Night is read from the authoritative source the site theme writes
// — the `.dark` class on <html> — because R3F props/context can't cross the
// Canvas boundary and this task must touch neither VoxelHome nor Lighting. The
// light NEVER casts shadow (the sun is the scene's sole shadow caster, per
// Lighting). Base/pole/head are static (merged); the pane + light are dynamic.

const CX = 13
const CZ = 2.4
const HEAD_Y = 3.15
const LAMP_COLOR = '#ffb066' // same warm hue as the indoor floor lamp
const NIGHT_INTENSITY = 1.0 // low, comparable to the indoor lamp (1.2)
const NIGHT_EMISSIVE = 0.9
const LAMBDA = 3 // ~1s crossfade, matching Lighting's day/night settle
const damp = THREE.MathUtils.damp

// Authoritative day/night signal (site theme => `.dark` on <html>). Cheap,
// allocation-free DOM read; SSR-safe.
function isNight(): boolean {
  return (
    typeof document !== 'undefined' &&
    document.documentElement.classList.contains('dark')
  )
}

export function GardenLamp() {
  const light = useRef<THREE.PointLight>(null)

  // Initial state matches the current theme so night loads already lit (no 1s
  // ramp-in on first paint). The frame loop owns the value after mount.
  const startNight = useMemo(() => isNight(), [])

  // Warm pane material — only its emissiveIntensity animates. Built once; the
  // frame loop mutates it in place (no per-frame allocation). toneMapped off so
  // the glow stays warm.
  const pane = useMemo(() => {
    const m = new THREE.MeshStandardMaterial({
      color: '#2c2620',
      emissive: LAMP_COLOR,
      emissiveIntensity: startNight ? NIGHT_EMISSIVE : 0,
    })
    m.toneMapped = false
    return m
  }, [startNight])
  useEffect(() => () => pane.dispose(), [pane])

  useFrame((_, rawDelta) => {
    const dt = Math.min(rawDelta, DELTA_CLAMP)
    const snap = reducedMotionRef.current
    const night = isNight()
    const litTarget = night ? NIGHT_INTENSITY : 0
    const emTarget = night ? NIGHT_EMISSIVE : 0
    const l = light.current
    if (l) l.intensity = snap ? litTarget : damp(l.intensity, litTarget, LAMBDA, dt)
    pane.emissiveIntensity = snap ? emTarget : damp(pane.emissiveIntensity, emTarget, LAMBDA, dt)
  })

  return (
    <group>
      {/* base + pole + head cap (static -> merged into the metal/slate batches) */}
      <Voxel position={[CX, 0.11, CZ]} size={[0.5, 0.22, 0.5]} color={PALETTE.metal} />
      <Voxel position={[CX, 1.6, CZ]} size={[0.14, 3.0, 0.14]} color={PALETTE.metal} />
      <Voxel position={[CX, HEAD_Y + 0.28, CZ]} size={[0.44, 0.16, 0.44]} color={PALETTE.slate} />

      {/* warm glowing pane (dynamic: emissive animates with night) */}
      <mesh position={[CX, HEAD_Y, CZ]} material={pane} userData={{ dynamic: true }}>
        <boxGeometry args={[0.32, 0.34, 0.32]} />
      </mesh>

      {/* warm light — night only, never casts shadow */}
      <pointLight
        ref={light}
        position={[CX, HEAD_Y, CZ]}
        color={LAMP_COLOR}
        distance={9}
        intensity={startNight ? NIGHT_INTENSITY : 0}
        castShadow={false}
      />
    </group>
  )
}
