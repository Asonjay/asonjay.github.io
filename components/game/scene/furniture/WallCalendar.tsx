'use client'
import * as THREE from 'three'
import { Voxel, PALETTE } from './Voxel'
import { useStationHighlight } from './useStationHighlight'

// Deadlines — a wall calendar with a header, grid lines and a glowing "today"
// cell (highlight) on the -Z backdrop wall. Emote: scratch head.
const CX = 7
const WALL_Z = -9.9

export function WallCalendar() {
  const today = useStationHighlight('deadlines', PALETTE.fabricRed, '#ff8f6b')

  return (
    <group userData={{ stationId: 'deadlines' }}>
      {/* board + header */}
      <Voxel position={[CX, 2.4, WALL_Z]} size={[1.6, 1.9, 0.08]} color={PALETTE.paper} />
      <Voxel position={[CX, 3.05, WALL_Z + 0.03]} size={[1.5, 0.35, 0.05]} color={PALETTE.fabricRed} />

      {/* grid lines */}
      {[-0.5, 0, 0.5].map((dx, i) => (
        <Voxel key={`v-${i}`} position={[CX + dx, 2.2, WALL_Z + 0.04]} size={[0.03, 1.15, 0.04]} color={PALETTE.slate} />
      ))}
      {[1.9, 2.25, 2.6].map((y, i) => (
        <Voxel key={`h-${i}`} position={[CX, y, WALL_Z + 0.04]} size={[1.45, 0.03, 0.04]} color={PALETTE.slate} />
      ))}

      {/* today (highlight) */}
      <mesh position={[CX - 0.72, 2.05, WALL_Z + 0.05]} material={today} userData={{ dynamic: true }}>
        <boxGeometry args={[0.42, 0.3, 0.04]} />
      </mesh>
    </group>
  )
}
