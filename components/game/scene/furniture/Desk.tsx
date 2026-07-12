'use client'
import { useRef } from 'react'
import * as THREE from 'three'
import { Voxel, PALETTE } from './Voxel'
import { useStationHighlight } from './useStationHighlight'
import { useReactiveProp } from './useReactiveProp'

// Publications — desk + chair + laptop (emissive screen) + two paper stacks,
// against the -Z backdrop wall. Emote: sit and type.
const CX = -2
const CZ = -8.7
const TOP_Y = 1.05

export function Desk() {
  const screen = useStationHighlight('publications', PALETTE.slate, '#8ab4ff')
  const chair = useRef<THREE.Group>(null)

  useReactiveProp({
    ref: chair,
    axis: 'x',
    trigger: { minX: CX - 0.6, maxX: CX + 0.6, minZ: -8.5, maxZ: -7.1 },
    impulse: 3.4,
  })

  return (
    <group userData={{ stationId: 'publications' }}>
      {/* desk top + legs */}
      <Voxel position={[CX, TOP_Y + 0.075, CZ]} size={[3.0, 0.15, 1.3]} color={PALETTE.woodLight} />
      {[
        [-1.35, -0.5],
        [1.35, -0.5],
        [-1.35, 0.5],
        [1.35, 0.5],
      ].map(([dx, dz], i) => (
        <Voxel key={i} position={[CX + dx, 0.5, CZ + dz]} size={[0.15, 1.0, 0.15]} color={PALETTE.woodDark} />
      ))}

      {/* laptop: base + emissive screen (highlight) */}
      <Voxel position={[CX, TOP_Y + 0.19, CZ + 0.2]} size={[0.7, 0.05, 0.5]} color={PALETTE.slate} />
      <mesh
        position={[CX, TOP_Y + 0.44, CZ]}
        rotation={[-0.32, 0, 0]}
        material={screen}
        castShadow
        userData={{ dynamic: true }}
      >
        <boxGeometry args={[0.72, 0.5, 0.04]} />
      </mesh>

      {/* two paper stacks */}
      <Voxel position={[CX - 1.05, TOP_Y + 0.2, CZ - 0.1]} size={[0.4, 0.16, 0.5]} color={PALETTE.paper} />
      <Voxel position={[CX + 0.95, TOP_Y + 0.17, CZ + 0.05]} size={[0.38, 0.1, 0.48]} color={PALETTE.fabricWhite} />

      {/* chair (reactive: rocks when bumped) — pivots at its base */}
      <group ref={chair} position={[CX, 0, -7.8]} userData={{ dynamic: true }}>
        <Voxel position={[0, 0.55, 0]} size={[0.62, 0.1, 0.6]} color={PALETTE.fabricRed} castShadow />
        <Voxel position={[0, 0.95, -0.26]} size={[0.62, 0.7, 0.1]} color={PALETTE.fabricRed} castShadow />
        {[
          [-0.24, -0.24],
          [0.24, -0.24],
          [-0.24, 0.24],
          [0.24, 0.24],
        ].map(([dx, dz], i) => (
          <Voxel key={i} position={[dx, 0.25, dz]} size={[0.1, 0.5, 0.1]} color={PALETTE.woodDark} />
        ))}
      </group>
    </group>
  )
}
