// Pure station registry — no three/react/next imports (Global Constraints).
// Consumed by scene/Systems.tsx to resolve which station the player is near.

export type Station = { id: string; x: number; z: number; radius: number }

export type StationRegistry = {
  add(s: Station): void
  // Nearest station whose radius contains the point; null if none in range.
  // Scan is in insertion order and returns the first station within its
  // (inclusive) radius — so a point on an earlier station's boundary resolves
  // to that station even when a later one is marginally closer. Keep close
  // stations ordered by priority; see tests/game/interactions.test.ts.
  nearestInRange(px: number, pz: number): string | null
  get(id: string): Station | undefined
  all(): readonly Station[]
}

export function createStationRegistry(): StationRegistry {
  const list: Station[] = []
  const byId = new Map<string, Station>()
  return {
    add(s) {
      list.push(s)
      byId.set(s.id, s)
    },
    nearestInRange(px, pz) {
      for (const s of list) {
        const dx = px - s.x
        const dz = pz - s.z
        if (dx * dx + dz * dz <= s.radius * s.radius) return s.id
      }
      return null
    },
    get(id) {
      return byId.get(id)
    },
    all() {
      return list
    },
  }
}
