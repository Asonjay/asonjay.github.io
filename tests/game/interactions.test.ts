import { describe, it, expect } from 'vitest'
import { createStationRegistry } from '../../components/game/systems/interactions'

describe('interactions', () => {
  const make = () => {
    const r = createStationRegistry()
    r.add({ id: 'desk', x: 0, z: 0, radius: 1.6 })
    r.add({ id: 'shelf', x: 3, z: 0, radius: 1.6 })
    return r
  }
  it('returns null when nothing in range', () => {
    expect(make().nearestInRange(10, 10)).toBe(null)
  })
  it('returns the station in range', () => {
    expect(make().nearestInRange(0.5, 0.5)).toBe('desk')
  })
  it('returns the NEAREST when overlapping', () => {
    expect(make().nearestInRange(1.9, 0)).toBe('shelf')  // 1.1 to shelf vs 1.9 to desk, both ≤1.6
  })
  it('boundary is inclusive', () => {
    expect(make().nearestInRange(1.6, 0)).toBe('desk')
  })
})
