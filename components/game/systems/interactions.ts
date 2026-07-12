// Pure station registry — no three/react/next imports (Global Constraints).
// Consumed by scene/Systems.tsx to resolve which station the player is near.

export type Station = { id: string; x: number; z: number; radius: number }

export type StationRegistry = {
  add(s: Station): void
  // The nearest station (by distance) whose radius contains the point, or null
  // if none is in range. Boundary is inclusive (dist <= radius). Exact ties
  // resolve to the earlier-registered station.
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
      let bestId: string | null = null
      let bestD2 = Infinity
      for (const s of list) {
        const dx = px - s.x
        const dz = pz - s.z
        const d2 = dx * dx + dz * dz
        // Strict `<` so equal distances keep the earlier-registered station.
        if (d2 <= s.radius * s.radius && d2 < bestD2) {
          bestD2 = d2
          bestId = s.id
        }
      }
      return bestId
    },
    get(id) {
      return byId.get(id)
    },
    all() {
      return list
    },
  }
}
