import { createColliderRegistry, type AABB } from './collision'

// Single source of truth for geometry-affecting data. World.tsx renders meshes
// from this module; it never owns collision state (see worldColliders below).

export const ROOM = { minX: -12, maxX: 12, minZ: -10, maxZ: 10, wallHeight: 4 }

export type StationDef = {
  id: string
  anchor: { x: number; z: number }
  radius: number
  hotbarKey?: string
}

// Station ids are frozen (Global Constraints). Anchors may shift ±1u in Task 2
// for visual balance, but keep ≥3u separation — edit this file only.
export const STATIONS: StationDef[] = [
  { id: 'about', anchor: { x: 4, z: -8 }, radius: 1.6 },
  { id: 'publications', anchor: { x: -2, z: -6.5 }, radius: 1.6 },
  { id: 'news', anchor: { x: 10, z: -5 }, radius: 1.6 },
  { id: 'projects', anchor: { x: 9.5, z: 0 }, radius: 1.6 },
  { id: 'blog', anchor: { x: 10, z: 5 }, radius: 1.6 },
  { id: 'music', anchor: { x: -6.7, z: 6 }, radius: 1.6 },
  { id: 'life', anchor: { x: -9, z: -4.5 }, radius: 1.6 },
  { id: 'contact', anchor: { x: 3.4, z: 8.6 }, radius: 1.6 },
  { id: 'deadlines', anchor: { x: 7.5, z: -8 }, radius: 1.6 },
  { id: 'classic', anchor: { x: 0.9, z: 8.6 }, radius: 1.6 },
  { id: 'lamp', anchor: { x: 7.2, z: -3 }, radius: 1.6 },
]

export const SPAWN = { x: 0, z: 4 }

// Static collider extents. Walls now; furniture boxes are added in Task 2.
// Walls sit just outside ROOM (inner face on the boundary) and overlap at the
// corners so the perimeter is sealed. All four block regardless of render height.
const WALL_T = 0.5
export const COLLIDERS: AABB[] = [
  // West wall (x = minX)
  { minX: ROOM.minX - WALL_T, maxX: ROOM.minX, minZ: ROOM.minZ - WALL_T, maxZ: ROOM.maxZ + WALL_T },
  // East wall (x = maxX)
  { minX: ROOM.maxX, maxX: ROOM.maxX + WALL_T, minZ: ROOM.minZ - WALL_T, maxZ: ROOM.maxZ + WALL_T },
  // South wall (z = minZ)
  { minX: ROOM.minX - WALL_T, maxX: ROOM.maxX + WALL_T, minZ: ROOM.minZ - WALL_T, maxZ: ROOM.minZ },
  // North wall (z = maxZ)
  { minX: ROOM.minX - WALL_T, maxX: ROOM.maxX + WALL_T, minZ: ROOM.maxZ, maxZ: ROOM.maxZ + WALL_T },
]

// The one collider registry for the world, built from COLLIDERS. Pure module
// instance — Player queries it, World renders from the same source data.
export const worldColliders = (() => {
  const r = createColliderRegistry()
  for (const b of COLLIDERS) r.add(b)
  return r
})()
