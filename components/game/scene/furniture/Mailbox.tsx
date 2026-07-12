'use client'
import { useRef } from 'react'
import * as THREE from 'three'
import { Voxel, PALETTE } from './Voxel'
import { useStationHighlight } from './useStationHighlight'
import { useReactiveProp } from './useReactiveProp'

// Contact — post + box + a flag that flips up during the `mailbox` emote. Sits
// near the +Z knee wall by the entry; short enough not to occlude the player.
const CX = 4.2
const CZ = 9.3

export function Mailbox() {
  const band = useStationHighlight('contact', PALETTE.metal, '#8ab4ff')
  const flag = useRef<THREE.Group>(null)

  useReactiveProp({ ref: flag, axis: 'z', emoteOpen: 'mailbox', restOpen: 1.35, k: 70, c: 7 })

  return (
    <group userData={{ stationId: 'contact' }}>
      {/* post + body + rounded lid */}
      <Voxel position={[CX, 0.65, CZ]} size={[0.2, 1.3, 0.2]} color={PALETTE.woodDark} />
      <Voxel position={[CX, 1.5, CZ]} size={[0.7, 0.5, 0.9]} color={PALETTE.metal} />
      <Voxel position={[CX, 1.8, CZ]} size={[0.72, 0.2, 0.92]} color={PALETTE.slate} />

      {/* highlight band on the room-facing (+x) side */}
      <mesh position={[CX + 0.36, 1.5, CZ]} material={band} userData={{ dynamic: true }}>
        <boxGeometry args={[0.04, 0.24, 0.7]} />
      </mesh>

      {/* flag: hinges up on the emote (pivot at the box side) */}
      <group ref={flag} position={[CX + 0.36, 1.42, CZ + 0.3]} userData={{ dynamic: true }}>
        <mesh position={[0.22, 0, 0]} castShadow>
          <boxGeometry args={[0.44, 0.05, 0.05]} />
          <meshLambertMaterial color={PALETTE.metal} />
        </mesh>
        <mesh position={[0.4, 0.14, 0]} castShadow>
          <boxGeometry args={[0.06, 0.26, 0.02]} />
          <meshLambertMaterial color={PALETTE.fabricRed} />
        </mesh>
      </group>
    </group>
  )
}
