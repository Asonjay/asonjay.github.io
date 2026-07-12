'use client'
import * as THREE from 'three'
import { Voxel, PALETTE } from './Voxel'
import { useStationHighlight } from './useStationHighlight'

// Music — freestanding jukebox with a rounded top and a glowing grill. Emote:
// sway to the beat. The grill is the highlight mesh.
const CX = -7.5
const CZ = 6.5

export function Jukebox() {
  const grill = useStationHighlight('music', PALETTE.slate, '#ff7cc0')

  return (
    <group>
      {/* body + stepped "rounded" crown */}
      <Voxel position={[CX, 0.9, CZ]} size={[1.4, 1.8, 1.0]} color={PALETTE.woodDark} />
      <Voxel position={[CX, 1.9, CZ]} size={[1.5, 0.3, 1.1]} color={PALETTE.brass} />
      <Voxel position={[CX, 2.12, CZ]} size={[1.1, 0.22, 0.8]} color={PALETTE.woodDark} />
      <Voxel position={[CX, 2.28, CZ]} size={[0.7, 0.16, 0.5]} color={PALETTE.brass} />

      {/* emissive grill on the +x (room-facing) side */}
      <mesh position={[CX + 0.72, 1.15, CZ]} material={grill} userData={{ dynamic: true }}>
        <boxGeometry args={[0.06, 0.9, 0.72]} />
      </mesh>

      {/* trim + buttons */}
      <Voxel position={[CX + 0.72, 1.75, CZ]} size={[0.05, 0.16, 0.8]} color={PALETTE.brass} />
      <Voxel position={[CX + 0.72, 0.6, CZ - 0.22]} size={[0.05, 0.12, 0.12]} color={PALETTE.fabricRed} />
      <Voxel position={[CX + 0.72, 0.6, CZ + 0.22]} size={[0.05, 0.12, 0.12]} color={PALETTE.fabricBlue} />
    </group>
  )
}
