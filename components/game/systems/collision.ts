export type AABB = { minX: number; minZ: number; maxX: number; maxZ: number }
export type ColliderRegistry = {
  add(box: AABB): void
  canMoveTo(x: number, z: number, radius: number): boolean
  boxes(): readonly AABB[]
}
export function createColliderRegistry(): ColliderRegistry {
  const list: AABB[] = []
  return {
    add(box) { list.push(box) },
    canMoveTo(x, z, radius) {
      for (const b of list) {
        if (x + radius > b.minX && x - radius < b.maxX && z + radius > b.minZ && z - radius < b.maxZ) return false
      }
      return true
    },
    boxes() { return list },
  }
}
