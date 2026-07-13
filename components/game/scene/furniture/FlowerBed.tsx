'use client'
import { Voxel, PALETTE } from './Voxel'

// Non-station decor: a low flower bed (dirt planter + a handful of stemmed
// flowers). No collider by design — the player walks past it, like the indoor
// plant. Static -> merged; petals reuse existing palette colors so the bed adds
// no draw-call batches. Rendered a few times with different spots/colors.

const FLOWERS: { dx: number; dz: number }[] = [
  { dx: -0.35, dz: -0.18 },
  { dx: 0.05, dz: 0.16 },
  { dx: 0.38, dz: -0.12 },
  { dx: -0.05, dz: -0.02 },
]

export function FlowerBed({
  position,
  petals = [PALETTE.fabricRed, PALETTE.fabricWhite, PALETTE.brass, PALETTE.fabricWhite],
}: {
  position: [number, number]
  petals?: string[]
}) {
  const [x, z] = position
  return (
    <group>
      {/* soil planter */}
      <Voxel position={[x, 0.09, z]} size={[1.2, 0.18, 0.8]} color={PALETTE.dirt} />
      {FLOWERS.map((f, i) => (
        <group key={i}>
          {/* stem */}
          <Voxel position={[x + f.dx, 0.34, z + f.dz]} size={[0.06, 0.36, 0.06]} color={PALETTE.leaf} />
          {/* bloom */}
          <Voxel
            position={[x + f.dx, 0.56, z + f.dz]}
            size={[0.2, 0.2, 0.2]}
            color={petals[i % petals.length]}
          />
        </group>
      ))}
    </group>
  )
}
