'use client'
import * as THREE from 'three'
import { Voxel, PALETTE } from './Voxel'
import { useStationHighlight } from './useStationHighlight'

// About — two framed posters plus a diploma on the -Z backdrop wall. Emote:
// look up and wave. The diploma is the highlight mesh.
const WALL_Z = -9.9
const Y = 2.7

// [x, width, height, color]
const POSTERS: [number, number, number, string][] = [
  [2.5, 1.2, 1.6, PALETTE.fabricBlue],
  [5.5, 1.2, 1.6, PALETTE.fabricRed],
]

export function AboutWall() {
  const diploma = useStationHighlight('about', PALETTE.paper, '#fff1c2')

  return (
    <group userData={{ stationId: 'about' }}>
      {POSTERS.map(([x, w, h, c], i) => (
        <group key={i}>
          <Voxel position={[x, Y, WALL_Z]} size={[w, h, 0.1]} color={PALETTE.woodDark} />
          <Voxel position={[x, Y, WALL_Z + 0.06]} size={[w - 0.2, h - 0.2, 0.05]} color={c} />
        </group>
      ))}

      {/* diploma (highlight) with a wax seal */}
      <Voxel position={[4, Y, WALL_Z]} size={[1.0, 1.3, 0.1]} color={PALETTE.woodLight} />
      <mesh position={[4, Y, WALL_Z + 0.06]} material={diploma} userData={{ dynamic: true }}>
        <boxGeometry args={[0.8, 1.1, 0.05]} />
      </mesh>
      <Voxel position={[4, Y - 0.35, WALL_Z + 0.1]} size={[0.2, 0.2, 0.04]} color={PALETTE.brass} />
    </group>
  )
}
