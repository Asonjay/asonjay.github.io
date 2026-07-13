'use client'
import { Voxel, PALETTE } from './Voxel'
import { YARD } from '../../systems/worldLayout'

// Courtyard picket fence on the three OUTER edges (south z=minZ, north z=maxZ,
// east x=maxX). The west edge is the room's divider wall, so it is not fenced.
// Deliberately low (~1.0) so the camera-facing (near) edges never occlude the
// yard. Every piece is a static Voxel, so StaticMerge folds the whole fence into
// the shared woodLight/woodDark batches — the ~80 pickets cost no extra draw
// calls. Colliders for these spans live in worldLayout (one AABB per edge).

const PICKET_H = 1.0
const POST_H = 1.25
const PICKET_W = 0.12
const SPACING = 0.5 // picket center-to-center
const RAIL_Y = 0.6
const RAIL_T = 0.08

type Span = { axis: 'x' | 'z'; fixed: number; from: number; to: number }

// Along-span picket line + a top rail; posts are dropped at both ends by the
// caller so shared corners aren't doubled.
function span({ axis, fixed, from, to }: Span, key: string) {
  const out: JSX.Element[] = []
  const len = to - from
  const n = Math.max(1, Math.round(len / SPACING))
  const picket: [number, number, number] = [PICKET_W, PICKET_H, PICKET_W]
  for (let i = 0; i <= n; i++) {
    const t = from + (i / n) * len
    const pos: [number, number, number] =
      axis === 'x' ? [t, PICKET_H / 2, fixed] : [fixed, PICKET_H / 2, t]
    out.push(<Voxel key={`${key}-p${i}`} position={pos} size={picket} color={PALETTE.woodLight} />)
  }
  // Continuous top rail across the span.
  const railPos: [number, number, number] =
    axis === 'x' ? [(from + to) / 2, RAIL_Y, fixed] : [fixed, RAIL_Y, (from + to) / 2]
  const railSize: [number, number, number] =
    axis === 'x' ? [len, RAIL_T, RAIL_T] : [RAIL_T, RAIL_T, len]
  out.push(<Voxel key={`${key}-rail`} position={railPos} size={railSize} color={PALETTE.woodLight} />)
  return out
}

export function Fence() {
  const spans: Span[] = [
    { axis: 'x', fixed: YARD.minZ, from: YARD.minX, to: YARD.maxX }, // south edge
    { axis: 'x', fixed: YARD.maxZ, from: YARD.minX, to: YARD.maxX }, // north edge
    { axis: 'z', fixed: YARD.maxX, from: YARD.minZ, to: YARD.maxZ }, // east edge
  ]

  // Corner posts (sturdier than pickets) at the three fenced corners; the two
  // west corners belong to the divider wall.
  const corners: [number, number][] = [
    [YARD.minX, YARD.minZ],
    [YARD.maxX, YARD.minZ],
    [YARD.maxX, YARD.maxZ],
  ]

  return (
    <group>
      {spans.map((s, i) => span(s, `s${i}`))}
      {corners.map(([x, z], i) => (
        <Voxel
          key={`post${i}`}
          position={[x, POST_H / 2, z]}
          size={[0.2, POST_H, 0.2]}
          color={PALETTE.woodDark}
        />
      ))}
    </group>
  )
}
