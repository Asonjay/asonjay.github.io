import { createColliderRegistry, type AABB } from './collision'
import { PLAYER_RADIUS } from './playerConfig'
import type { GridSpec } from './pathfinding'

// Single source of truth for geometry-affecting data. World.tsx renders meshes
// from this module; it never owns collision state (see worldColliders below).
// Furniture meshes live in scene/furniture/* and are authored to match the
// footprints below — keep the two in sync when moving anything.
//
// R2 world 形态: the study (ROOM) keeps its footprint and opens on its east wall
// into a small courtyard (YARD). The east wall is now a low divider with a door
// gap (DOOR_GAP); everything else about the room is unchanged. Indoor = work;
// outdoor = life/contact. Zone-grouped below: room, yard, then the collider list
// walks room walls -> divider -> yard fence -> indoor furniture -> outdoor.

export const ROOM = { minX: -12, maxX: 12, minZ: -10, maxZ: 10, wallHeight: 4 }

// Courtyard, extending east (+x) off the room's open/camera-side wall. +x reads
// as screen-right under the iso camera, opposite the dense −x furniture cluster,
// so the frame balances (study left, garden right). Depth 8 cells (x 12→20); the
// far fence sits at x 20.5. The directional sun's shadow frustum (Lighting.tsx
// ±24, oriented from [8,16,-14]) reaches ~±24 in its view plane; the far NE fence
// corner projects to view-x −22.4, a safe margin inside it (x=21 would be −23.3).
export const YARD = { minX: 12, maxX: 20, minZ: -10, maxZ: 10 }

// The single walkable break in the divider (room's east wall). 3 cells wide
// (cz = 3,4,5), aligned with the spawn so the player walks straight out. A*
// auto-walk from indoors to the outdoor stations must route through here — the
// key correctness case (guarded by tests/game/worldPathfinding.test.ts).
export const DOOR_GAP = { x: ROOM.maxX, minZ: 3, maxZ: 6 }

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
// height and camera-side, so nothing tall goes there. `contact` and `classic`
// now live outdoors on the courtyard path — anchors on the dirt plaza, reachable
// from the door; every other station stays indoors, unchanged.
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
  // Outdoor (courtyard path):
  { id: 'contact', anchor: { x: 16.5, z: 3.5 }, radius: 1.6 },
  { id: 'classic', anchor: { x: 13.5, z: 5.5 }, radius: 1.6 },
]

export const SPAWN = { x: 0, z: 4 }

// Static collider extents. Walls sit just outside their zone (inner face on the
// boundary) and overlap at the corners so the perimeter is sealed. Furniture
// footprints are inset ~0.05 from their visual box (as in the prototype) so the
// player can stand flush against a piece. Flat wall art, reactive props (chair,
// plant, papers, trash lid, mailbox flag) and the rug carry NO collider by
// design; low garden decor (flower beds) is likewise walkable-through.
const WALL_T = 0.5
export const COLLIDERS: AABB[] = [
  // --- Room walls (west + south full backdrop; north knee, camera-side) ---
  { minX: ROOM.minX - WALL_T, maxX: ROOM.minX, minZ: ROOM.minZ - WALL_T, maxZ: ROOM.maxZ + WALL_T }, // west (x=minX)
  { minX: ROOM.minX - WALL_T, maxX: ROOM.maxX + WALL_T, minZ: ROOM.minZ - WALL_T, maxZ: ROOM.minZ }, // south (z=minZ)
  { minX: ROOM.minX - WALL_T, maxX: ROOM.maxX + WALL_T, minZ: ROOM.maxZ, maxZ: ROOM.maxZ + WALL_T }, // north (z=maxZ), knee

  // --- Divider (room's east wall, x=maxX) split around the door gap ---
  { minX: ROOM.maxX, maxX: ROOM.maxX + WALL_T, minZ: ROOM.minZ - WALL_T, maxZ: DOOR_GAP.minZ }, // south of door
  { minX: ROOM.maxX, maxX: ROOM.maxX + WALL_T, minZ: DOOR_GAP.maxZ, maxZ: ROOM.maxZ + WALL_T }, // north of door

  // --- Courtyard perimeter fence (south/north continue the room's lines east;
  //     east edge closes the yard). Low pickets, but solid to the player. ---
  { minX: YARD.minX, maxX: YARD.maxX + WALL_T, minZ: YARD.minZ - WALL_T, maxZ: YARD.minZ }, // yard south fence
  { minX: YARD.minX, maxX: YARD.maxX + WALL_T, minZ: YARD.maxZ, maxZ: YARD.maxZ + WALL_T }, // yard north fence
  { minX: YARD.maxX, maxX: YARD.maxX + WALL_T, minZ: YARD.minZ - WALL_T, maxZ: YARD.maxZ + WALL_T }, // yard east fence

  // --- Indoor furniture footprints ---
  { minX: -3.55, maxX: -0.45, minZ: -9.35, maxZ: -8.05 }, // publications: desk
  { minX: -10.25, maxX: -8.15, minZ: -8.65, maxZ: -6.15 }, // life: bed
  { minX: -8.75, maxX: -7.25, minZ: -1.35, maxZ: 1.35 }, // projects: sofa
  { minX: -11.7, maxX: -10.9, minZ: -0.65, maxZ: 0.65 }, // projects: TV console
  { minX: -11.8, maxX: -11.2, minZ: 3.05, maxZ: 5.95 }, // blog: bookshelf
  { minX: -8.15, maxX: -6.85, minZ: 6.05, maxZ: 6.95 }, // music: jukebox
  { minX: -7.35, maxX: -7.25, minZ: 1.55, maxZ: 1.65 }, // lamp: pole

  // --- Outdoor furniture / decor footprints (courtyard) ---
  { minX: 16.1, maxX: 16.9, minZ: 1.9, maxZ: 2.7 }, // contact: mailbox
  { minX: 13.1, maxX: 13.9, minZ: 6.3, maxZ: 7.1 }, // classic: trash can
  { minX: 12.8, maxX: 13.2, minZ: 2.2, maxZ: 2.6 }, // garden lamppost: pole
  { minX: 18.5, maxX: 19.6, minZ: 3.6, maxZ: 5.4 }, // bench
  { minX: 18.1, maxX: 18.9, minZ: -3.9, maxZ: -3.1 }, // tree: trunk
]

// The one collider registry for the world, built from COLLIDERS. Pure module
// instance — Player queries it, World renders from the same source data.
export const worldColliders = (() => {
  const r = createColliderRegistry()
  for (const b of COLLIDERS) r.add(b)
  return r
})()

// Impure adapter that exposes the world's colliders as a pathfinding GridSpec:
// one 1-unit cell per integer coordinate spanning BOTH zones (room minX/minZ to
// yard maxX/maxZ), a cell blocked iff the player (PLAYER_RADIUS) cannot stand at
// its center. Called on demand by the hotbar's auto-walk — never in a frame loop.
export function makeGrid(): GridSpec {
  return {
    minX: ROOM.minX,
    minZ: ROOM.minZ,
    maxX: YARD.maxX,
    maxZ: YARD.maxZ,
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
