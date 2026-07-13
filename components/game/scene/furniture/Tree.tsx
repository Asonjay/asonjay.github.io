'use client'
import { Voxel, PALETTE } from './Voxel'

// Non-station decor: a small voxel tree toward the yard's back (-z) corner, where
// it adds depth without occluding the foreground. Trunk + three stacked canopy
// layers, all static -> merged (trunk into woodDark, canopy into leaf). Trunk
// collider lives in worldLayout; the canopy overhangs freely (nothing walks there).
const CX = 18.5
const CZ = -3.5

export function Tree() {
  return (
    <group>
      {/* trunk */}
      <Voxel position={[CX, 1.0, CZ]} size={[0.6, 2.0, 0.6]} color={PALETTE.woodDark} />
      {/* canopy — widest at the base, tapering up */}
      <Voxel position={[CX, 2.5, CZ]} size={[2.4, 1.0, 2.4]} color={PALETTE.leaf} />
      <Voxel position={[CX, 3.25, CZ]} size={[1.8, 0.9, 1.8]} color={PALETTE.leaf} />
      <Voxel position={[CX, 3.9, CZ]} size={[1.1, 0.8, 1.1]} color={PALETTE.leaf} />
    </group>
  )
}
