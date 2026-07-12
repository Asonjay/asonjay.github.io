import { createColliderRegistry, type AABB } from './collision'
import { PLAYER_RADIUS } from './playerConfig'
import type { GridSpec } from './pathfinding'

// Single source of truth for geometry-affecting data. World.tsx renders meshes
// from this module; it never owns collision state (see worldColliders below).
// Furniture meshes live in scene/furniture/* and are authored to match the
// footprints below — keep the two in sync when moving anything.

export const ROOM = { minX: -12, maxX: 12, minZ: -10, maxZ: 10, wallHeight: 4 }

export type StationDef = {
  id: string
  anchor: { x: number; z: number }
  radius: number
  hotbarKey?: string
}

// Station ids are frozen (Global Constraints). Anchors sit in front of each
// station's furniture, in open floor reachable by the player (verified by the
// dev assertion at the bottom of this file). Wall-mounted furniture lives on the
// FULL backdrop walls only (x = -12 and z = -10); the +x / +z walls are knee
// height and camera-side, so nothing tall goes there.
export const STATIONS: StationDef[] = [
  { id: 'about', anchor: { x: 4, z: -8 }, radius: 1.6 },
  { id: 'publications', anchor: { x: -2, z: -6.5 }, radius: 1.6 },
  { id: 'deadlines', anchor: { x: 7, z: -8 }, radius: 1.6 },
  { id: 'news', anchor: { x: 10, z: -8 }, radius: 1.6 },
  { id: 'life', anchor: { x: -8.2, z: -5.5 }, radius: 1.6 },
  { id: 'projects', anchor: { x: -9.6, z: 0.2 }, radius: 1.6 },
  { id: 'lamp', anchor: { x: -6.6, z: 1.8 }, radius: 1.6 },
  { id: 'blog', anchor: { x: -10, z: 4.5 }, radius: 1.6 },
  { id: 'music', anchor: { x: -6, z: 6 }, radius: 1.6 },
  { id: 'contact', anchor: { x: 3.4, z: 8.6 }, radius: 1.6 },
  { id: 'classic', anchor: { x: 0.9, z: 8.6 }, radius: 1.6 },
]

export const SPAWN = { x: 0, z: 4 }

// Static collider extents. Walls sit just outside ROOM (inner face on the
// boundary) and overlap at the corners so the perimeter is sealed. Furniture
// footprints are inset ~0.05 from their visual box (as in the prototype) so the
// player can stand flush against a piece. Flat wall art, reactive props (chair,
// plant, papers, trash lid) and the rug carry NO collider by design.
const WALL_T = 0.5
export const COLLIDERS: AABB[] = [
  // --- Room walls ---
  { minX: ROOM.minX - WALL_T, maxX: ROOM.minX, minZ: ROOM.minZ - WALL_T, maxZ: ROOM.maxZ + WALL_T }, // west (x=minX)
  { minX: ROOM.maxX, maxX: ROOM.maxX + WALL_T, minZ: ROOM.minZ - WALL_T, maxZ: ROOM.maxZ + WALL_T }, // east (x=maxX)
  { minX: ROOM.minX - WALL_T, maxX: ROOM.maxX + WALL_T, minZ: ROOM.minZ - WALL_T, maxZ: ROOM.minZ }, // south (z=minZ)
  { minX: ROOM.minX - WALL_T, maxX: ROOM.maxX + WALL_T, minZ: ROOM.maxZ, maxZ: ROOM.maxZ + WALL_T }, // north (z=maxZ)

  // --- Furniture footprints ---
  { minX: -3.55, maxX: -0.45, minZ: -9.35, maxZ: -8.05 }, // publications: desk
  { minX: -10.25, maxX: -8.15, minZ: -8.65, maxZ: -6.15 }, // life: bed
  { minX: -8.75, maxX: -7.25, minZ: -1.35, maxZ: 1.35 }, // projects: sofa
  { minX: -11.7, maxX: -10.9, minZ: -0.65, maxZ: 0.65 }, // projects: TV console
  { minX: -11.8, maxX: -11.2, minZ: 3.05, maxZ: 5.95 }, // blog: bookshelf
  { minX: -8.15, maxX: -6.85, minZ: 6.05, maxZ: 6.95 }, // music: jukebox
  { minX: -7.35, maxX: -7.25, minZ: 1.55, maxZ: 1.65 }, // lamp: pole
  { minX: 3.85, maxX: 4.55, minZ: 8.95, maxZ: 9.65 }, // contact: mailbox
  { minX: 0.5, maxX: 1.3, minZ: 9.0, maxZ: 9.8 }, // classic: trash can
]

// The one collider registry for the world, built from COLLIDERS. Pure module
// instance — Player queries it, World renders from the same source data.
export const worldColliders = (() => {
  const r = createColliderRegistry()
  for (const b of COLLIDERS) r.add(b)
  return r
})()

// Impure adapter that exposes the world's colliders as a pathfinding GridSpec:
// one 1-unit cell per integer coordinate across the ROOM bounds, a cell blocked
// iff the player (PLAYER_RADIUS) cannot stand at its center. Called on demand by
// the hotbar's auto-walk — never inside a frame loop.
export function makeGrid(): GridSpec {
  return {
    minX: ROOM.minX,
    minZ: ROOM.minZ,
    maxX: ROOM.maxX,
    maxZ: ROOM.maxZ,
    blocked: (cx, cz) => !worldColliders.canMoveTo(cx + 0.5, cz + 0.5, PLAYER_RADIUS),
  }
}

// Dev-only: every station anchor must be reachable (not inside a collider) so
// the player can actually stand there. Fires once on import in the browser.
if (process.env.NODE_ENV !== 'production' && typeof window !== 'undefined') {
  for (const s of STATIONS) {
    if (!worldColliders.canMoveTo(s.anchor.x, s.anchor.z, 0.35)) {
      // eslint-disable-next-line no-console
      console.warn(`[worldLayout] station "${s.id}" anchor is not reachable`, s.anchor)
    }
  }
}
