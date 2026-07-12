'use client'
import * as THREE from 'three'
import { Voxel, PALETTE } from './Voxel'
import { useStationHighlight } from './useStationHighlight'

// Life — bed in the -X/-Z corner with a cluster of photo frames on the -X wall
// above it. Emote: lean in to look at the photos. One photo glows (highlight).
const BX = -9.2
const BZ = -7.4
const WALL_X = -11.88

// [y, z, photoColor]
const FRAMES: [number, number, string][] = [
  [2.7, -8.3, PALETTE.fabricRed],
  [3.5, -8.3, PALETTE.leaf],
  [3.5, -6.9, PALETTE.fabricBlue],
]

export function PhotoWall() {
  const glow = useStationHighlight('life', PALETTE.brass, '#ffd27a')

  return (
    <group userData={{ stationId: 'life' }}>
      {/* bed: frame, mattress, pillow, folded blanket */}
      <Voxel position={[BX, 0.25, BZ]} size={[2.2, 0.5, 2.6]} color={PALETTE.woodDark} />
      <Voxel position={[BX, 0.6, BZ]} size={[2.0, 0.3, 2.4]} color={PALETTE.fabricWhite} />
      <Voxel position={[BX, 0.82, -8.35]} size={[1.7, 0.24, 0.55]} color={PALETTE.fabricWhite} />
      <Voxel position={[BX, 0.78, -6.7]} size={[2.0, 0.16, 1.3]} color={PALETTE.fabricBlue} />

      {/* photo frames on the -X wall */}
      {FRAMES.map(([y, z, c], i) => (
        <group key={i}>
          <Voxel position={[WALL_X, y, z]} size={[0.1, 0.9, 0.75]} color={PALETTE.woodLight} />
          <Voxel position={[WALL_X + 0.06, y, z]} size={[0.04, 0.72, 0.58]} color={c} />
        </group>
      ))}

      {/* highlight photo */}
      <Voxel position={[WALL_X, 2.7, -6.9]} size={[0.1, 0.9, 0.75]} color={PALETTE.woodLight} />
      <mesh position={[WALL_X + 0.06, 2.7, -6.9]} material={glow} userData={{ dynamic: true }}>
        <boxGeometry args={[0.04, 0.72, 0.58]} />
      </mesh>
    </group>
  )
}
