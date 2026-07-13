'use client'
import { Voxel, PALETTE } from './Voxel'

// Non-station decor: a wooden bench on the grass east of the plaza, backrest on
// the +x side so it faces the path/room (-x). Static -> merged by StaticMerge.
// Footprint/collider live in worldLayout (bench AABB).
const CX = 19
const CZ = 4.5

export function GardenBench() {
  return (
    <group>
      {/* seat */}
      <Voxel position={[CX, 0.5, CZ]} size={[0.9, 0.12, 1.6]} color={PALETTE.woodLight} />
      {/* backrest (+x side) */}
      <Voxel position={[CX + 0.36, 0.86, CZ]} size={[0.12, 0.62, 1.6]} color={PALETTE.woodLight} />
      {/* slab legs at both z ends */}
      <Voxel position={[CX, 0.25, CZ - 0.68]} size={[0.78, 0.5, 0.14]} color={PALETTE.woodDark} />
      <Voxel position={[CX, 0.25, CZ + 0.68]} size={[0.78, 0.5, 0.14]} color={PALETTE.woodDark} />
    </group>
  )
}
