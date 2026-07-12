import { describe, it, expect } from 'vitest'
import { findPath } from '../../components/game/systems/pathfinding'

const openGrid = { minX: 0, minZ: 0, maxX: 10, maxZ: 10, blocked: () => false }
const walled = { ...openGrid, blocked: (x: number, z: number) => x === 5 && z < 8 }

describe('pathfinding', () => {
  it('straight line in open space collapses to few waypoints', () => {
    const p = findPath(openGrid, { x: 1.5, z: 1.5 }, { x: 8.5, z: 1.5 })!
    expect(p[p.length - 1].x).toBeCloseTo(8.5)
    expect(p.length).toBeLessThanOrEqual(2)
  })
  it('routes around a wall', () => {
    const p = findPath(walled, { x: 2.5, z: 2.5 }, { x: 8.5, z: 2.5 })!
    expect(p).not.toBeNull()
    expect(p.some(w => w.z > 7.5)).toBe(true)          // detours over the gap
    expect(p.every(w => !(Math.floor(w.x) === 5 && w.z < 8))).toBe(true)
  })
  it('returns null when goal is enclosed', () => {
    const boxed = { ...openGrid, blocked: (x: number, z: number) =>
      (Math.abs(x - 5) === 2 && Math.abs(z - 5) <= 2) || (Math.abs(z - 5) === 2 && Math.abs(x - 5) <= 2) }
    expect(findPath(boxed, { x: 1.5, z: 1.5 }, { x: 5.5, z: 5.5 })).toBe(null)
  })
  it('snaps a blocked goal cell to the nearest open neighbor', () => {
    const p = findPath(walled, { x: 2.5, z: 2.5 }, { x: 5.5, z: 2.5 })!  // goal on the wall
    expect(p).not.toBeNull()
    const last = p[p.length - 1]
    expect(walled.blocked(Math.floor(last.x), Math.floor(last.z))).toBe(false)
  })
})
