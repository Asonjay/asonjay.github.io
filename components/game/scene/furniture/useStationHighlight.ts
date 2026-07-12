'use client'
import { useEffect, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useGameStore } from '../../systems/store'
import { reducedMotionRef } from '../../systems/reducedMotion'
import { DELTA_CLAMP } from '../../systems/playerConfig'

const damp = THREE.MathUtils.damp

// Emissive material for a station's "highlight" mesh. Dark (intensity 0) at
// rest so it reads as plain furniture; pulses when the player is nearby and
// lights fully while the station's panel is open. The pulse is a damped sine,
// flattened to a steady glow under reduced motion. The mesh wearing this
// material must be marked userData.dynamic so StaticMerge leaves it alone.
export function useStationHighlight(id: string, color: string, emissive = '#ffe6a8') {
  const mat = useMemo(
    () => new THREE.MeshLambertMaterial({ color, emissive, emissiveIntensity: 0 }),
    [color, emissive]
  )
  useEffect(() => () => mat.dispose(), [mat])

  useFrame((state, rawDelta) => {
    const dt = Math.min(rawDelta, DELTA_CLAMP)
    const g = useGameStore.getState()
    let target = 0
    if (g.openPanelId === id) target = 0.9
    else if (g.nearbyStationId === id) {
      target = reducedMotionRef.current
        ? 0.35
        : 0.28 + 0.22 * (0.5 + 0.5 * Math.sin(state.clock.elapsedTime * 4))
    }
    mat.emissiveIntensity = damp(mat.emissiveIntensity, target, 8, dt)
  })

  return mat
}
