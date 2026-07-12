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
  it('returns the nearest when multiple stations are in range', () => {
    const r = make()
    expect(r.nearestInRange(1.4, 0)).toBe('desk')   // desk 1.4, shelf 1.6 — both in range, desk nearer
    expect(r.nearestInRange(1.55, 0)).toBe('shelf') // desk 1.55, shelf 1.45 — shelf nearer
  })
  it('boundary is inclusive', () => {
    expect(make().nearestInRange(-1.6, 0)).toBe('desk')  // exactly at radius; shelf far out of range
  })
})
