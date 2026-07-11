import { describe, it, expect } from 'vitest'
import { createColliderRegistry } from '../../components/game/systems/collision'

describe('collision', () => {
  it('allows movement in empty space', () => {
    const r = createColliderRegistry()
    expect(r.canMoveTo(0, 0, 0.35)).toBe(true)
  })
  it('blocks movement into a box', () => {
    const r = createColliderRegistry()
    r.add({ minX: 1, minZ: -1, maxX: 3, maxZ: 1 })
    expect(r.canMoveTo(1.2, 0, 0.35)).toBe(false)
  })
  it('respects player radius at edges', () => {
    const r = createColliderRegistry()
    r.add({ minX: 1, minZ: -1, maxX: 3, maxZ: 1 })
    expect(r.canMoveTo(0.64, 0, 0.35)).toBe(true)   // 0.64+0.35 < 1
    expect(r.canMoveTo(0.7, 0, 0.35)).toBe(false)   // 0.7+0.35 > 1
  })
  it('supports axis-separated sliding', () => {
    const r = createColliderRegistry()
    r.add({ minX: 1, minZ: -5, maxX: 2, maxZ: 5 })  // wall to the east
    expect(r.canMoveTo(0.6, 0, 0.35)).toBe(true)    // near the wall
    expect(r.canMoveTo(0.9, 0, 0.35)).toBe(false)   // X move blocked
    expect(r.canMoveTo(0.6, 1.5, 0.35)).toBe(true)  // Z slide allowed
  })
  it('handles multiple boxes', () => {
    const r = createColliderRegistry()
    r.add({ minX: -2, minZ: -2, maxX: -1, maxZ: -1 })
    r.add({ minX: 1, minZ: 1, maxX: 2, maxZ: 2 })
    expect(r.canMoveTo(0, 0, 0.35)).toBe(true)
    expect(r.canMoveTo(-1.2, -1.2, 0.35)).toBe(false)
    expect(r.canMoveTo(1.2, 1.2, 0.35)).toBe(false)
  })
})
