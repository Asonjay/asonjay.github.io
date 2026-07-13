import { describe, it, expect } from 'vitest'
import { findPath } from '../../components/game/systems/pathfinding'
import {
  makeGrid,
  STATIONS,
  ROOM,
  worldColliders,
} from '../../components/game/systems/worldLayout'

// Integration guard for the R2 courtyard: the divider between the study and the
// garden sits on the room's east wall (x = ROOM.maxX) and the ONLY walkable break
// in it is the door gap. Hotbar auto-walk from indoors to an outdoor station must
// route through that gap — the top regression for this world change. A future
// layout edit that seals the wall, moves the gap, or strands an outdoor anchor
// fails here loudly.
const DOOR_X = ROOM.maxX // divider plane
const DOOR_MIN_Z = 3 // door gap z-span (worldLayout DOOR_GAP)
const DOOR_MAX_Z = 6

// z at which a waypoint polyline first crosses the vertical plane x = X, else
// null. string-pulling can collapse the door cell out of the waypoint list, but
// pathfinding's line-of-sight test guarantees no segment passes through a blocked
// cell, so the crossing of a valid path can only fall inside the open gap.
function crossingZ(path: { x: number; z: number }[], X: number): number | null {
  for (let i = 0; i < path.length - 1; i++) {
    const a = path[i]
    const b = path[i + 1]
    if (a.x !== b.x && (a.x - X) * (b.x - X) <= 0) {
      const t = (X - a.x) / (b.x - a.x)
      return a.z + t * (b.z - a.z)
    }
  }
  return null
}

function expectRoutesThroughDoor(id: string) {
  const station = STATIONS.find((s) => s.id === id)
  expect(station, `station "${id}" exists`).toBeDefined()
  const path = findPath(makeGrid(), { x: 0, z: 0 }, station!.anchor)
  expect(path, `path to "${id}" exists`).not.toBeNull()
  const z = crossingZ(path!, DOOR_X)
  expect(z, `path to "${id}" crosses the divider`).not.toBeNull()
  expect(z!).toBeGreaterThanOrEqual(DOOR_MIN_Z)
  expect(z!).toBeLessThanOrEqual(DOOR_MAX_Z)
}

describe('courtyard pathfinding (indoor room -> outdoor station)', () => {
  it('routes from the room to the mailbox (contact) through the door gap', () => {
    expectRoutesThroughDoor('contact')
  })

  it('routes from the room to the trash can (classic) through the door gap', () => {
    expectRoutesThroughDoor('classic')
  })

  // CI mirror of worldLayout's browser-only dev assertion: an anchor buried in a
  // collider would strand its station (findPath snaps blocked goals, so the door
  // tests above alone would not catch it).
  it('every station anchor sits in standable floor', () => {
    for (const s of STATIONS) {
      expect(
        worldColliders.canMoveTo(s.anchor.x, s.anchor.z, 0.35),
        `station "${s.id}" anchor is standable`
      ).toBe(true)
    }
  })
})
