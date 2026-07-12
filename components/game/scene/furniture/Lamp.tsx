'use client'
import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { Voxel, PALETTE } from './Voxel'
import { useStationHighlight } from './useStationHighlight'
import { useGameStore } from '../../systems/store'
import { reducedMotionRef } from '../../systems/reducedMotion'
import { DELTA_CLAMP } from '../../systems/playerConfig'

// Lamp (easter egg) — floor lamp near the sofa. Emote: reach up and pull the
// cord (Task 4 wires the day/night toggle). The shade is the highlight mesh and
// holds a decorative point light.
const CX = -7.3
const CZ = 1.6
const damp = THREE.MathUtils.damp

export function Lamp() {
  const shade = useStationHighlight('lamp', PALETTE.paper, '#ffdd99')
  const cord = useRef<THREE.Group>(null)
  const s = useRef({ stretch: 1 })

  useFrame((_, rawDelta) => {
    const g = cord.current
    if (!g) return
    const dt = Math.min(rawDelta, DELTA_CLAMP)
    const pulling =
      !reducedMotionRef.current && useGameStore.getState().activeEmote === 'pullCord'
    s.current.stretch = damp(s.current.stretch, pulling ? 1.28 : 1, 12, dt)
    g.scale.y = s.current.stretch
  })

  return (
    <group userData={{ stationId: 'lamp' }}>
      {/* base + pole */}
      <Voxel position={[CX, 0.06, CZ]} size={[0.44, 0.12, 0.44]} color={PALETTE.metal} />
      <Voxel position={[CX, 1.3, CZ]} size={[0.12, 2.5, 0.12]} color={PALETTE.metal} />

      {/* shade (highlight). The floor lamp's point light lives in scene/Lighting
          so day/night can drive it (off by day, warm by night). */}
      <mesh position={[CX, 2.7, CZ]} material={shade} userData={{ dynamic: true }} castShadow>
        <boxGeometry args={[0.75, 0.55, 0.75]} />
      </mesh>

      {/* pull cord (stretches on the emote), pivot at the shade underside */}
      <group ref={cord} position={[CX + 0.28, 2.42, CZ]} userData={{ dynamic: true }}>
        <mesh position={[0, -0.3, 0]}>
          <boxGeometry args={[0.03, 0.6, 0.03]} />
          <meshLambertMaterial color={PALETTE.woodLight} />
        </mesh>
        <mesh position={[0, -0.62, 0]}>
          <boxGeometry args={[0.08, 0.08, 0.08]} />
          <meshLambertMaterial color={PALETTE.brass} />
        </mesh>
      </group>
    </group>
  )
}
