'use client'
import { useRef } from 'react'
import * as THREE from 'three'
import { Voxel, PALETTE } from './Voxel'
import { useStationHighlight } from './useStationHighlight'
import { useReactiveProp } from './useReactiveProp'

// Classic (easter egg) — an octagonal trash can by the entry whose lid pops open
// during the `peek` emote and wobbles when bumped. Portal to the classic site.
const CX = 0.9
const CZ = 9.4
const R = 0.42
const SIDES = 8

export function TrashCan() {
  const band = useStationHighlight('classic', PALETTE.metal, '#9fe6b0')
  const lid = useRef<THREE.Group>(null)

  useReactiveProp({
    ref: lid,
    axis: 'x',
    trigger: { minX: CX - 0.6, maxX: CX + 0.6, minZ: CZ - 0.6, maxZ: CZ + 0.6 },
    impulse: 2.6,
    emoteOpen: 'peek',
    restOpen: -1.15,
    k: 60,
    c: 6,
  })

  const panels = Array.from({ length: SIDES }, (_, i) => {
    const a = (i / SIDES) * Math.PI * 2
    return (
      <Voxel
        key={i}
        position={[CX + Math.cos(a) * R, 0.5, CZ + Math.sin(a) * R]}
        rotation={[0, -a, 0]}
        size={[0.34, 1.0, 0.06]}
        color={PALETTE.metal}
      />
    )
  })

  return (
    <group>
      {panels}
      <Voxel position={[CX, 0.03, CZ]} size={[0.8, 0.06, 0.8]} color={PALETTE.slate} />

      {/* highlight band around the rim (room-facing side) */}
      <mesh position={[CX + R, 0.85, CZ]} material={band} userData={{ dynamic: true }}>
        <boxGeometry args={[0.05, 0.16, 0.4]} />
      </mesh>

      {/* hinged lid (pivot at back edge) */}
      <group ref={lid} position={[CX, 1.04, CZ - R]} userData={{ dynamic: true }}>
        <mesh position={[0, 0.03, R]} castShadow>
          <boxGeometry args={[0.95, 0.1, 0.95]} />
          <meshLambertMaterial color={PALETTE.slate} />
        </mesh>
        <mesh position={[0, 0.14, R]} castShadow>
          <boxGeometry args={[0.16, 0.14, 0.16]} />
          <meshLambertMaterial color={PALETTE.metal} />
        </mesh>
      </group>
    </group>
  )
}
