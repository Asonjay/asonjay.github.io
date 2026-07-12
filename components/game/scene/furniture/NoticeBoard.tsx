'use client'
import * as THREE from 'three'
import { Voxel, PALETTE } from './Voxel'
import { useStationHighlight } from './useStationHighlight'

// News — cork notice board with pinned notes on the -Z backdrop wall, east end.
// Emote: lean in and tilt head. The freshest note is the highlight mesh.
const CX = 10
const WALL_Z = -9.9

// [x, y, rot, color]
const NOTES: [number, number, number, string][] = [
  [9.4, 2.7, 0.08, PALETTE.paper],
  [10.5, 2.8, -0.1, PALETTE.fabricWhite],
  [9.5, 2.05, -0.06, PALETTE.fabricWhite],
  [10.4, 2.0, 0.12, PALETTE.paper],
]

export function NoticeBoard() {
  const fresh = useStationHighlight('news', PALETTE.paper, '#fff1c2')

  return (
    <group>
      {/* frame + cork */}
      <Voxel position={[CX, 2.4, WALL_Z]} size={[1.9, 1.7, 0.1]} color={PALETTE.woodDark} />
      <Voxel position={[CX, 2.4, WALL_Z + 0.04]} size={[1.7, 1.5, 0.05]} color={PALETTE.cork} />

      {NOTES.map(([x, y, r, c], i) => (
        <group key={i}>
          <Voxel position={[x, y, WALL_Z + 0.08]} size={[0.5, 0.6, 0.03]} color={c} rotation={[0, 0, r]} />
          <Voxel position={[x, y + 0.25, WALL_Z + 0.11]} size={[0.06, 0.06, 0.04]} color={PALETTE.fabricRed} />
        </group>
      ))}

      {/* freshest note (highlight) */}
      <mesh position={[CX, 2.42, WALL_Z + 0.09]} rotation={[0, 0, -0.04]} material={fresh} userData={{ dynamic: true }}>
        <boxGeometry args={[0.52, 0.62, 0.03]} />
      </mesh>
      <Voxel position={[CX, 2.7, WALL_Z + 0.12]} size={[0.06, 0.06, 0.04]} color={PALETTE.fabricBlue} />
    </group>
  )
}
