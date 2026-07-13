// Pure 4-connected A* over a uniform 1-unit grid. No three/react/next imports
// (Global Constraints): the impure world adapter lives in worldLayout.makeGrid().
//
// Cell coords (cx, cz) are integers; a cell's center in world space is
// (cx + 0.5, cz + 0.5), and a world point (x, z) belongs to cell
// (floor(x), floor(z)). `blocked(cx, cz)` is always queried on integer cells.

export type GridSpec = {
  minX: number
  minZ: number
  maxX: number
  maxZ: number
  blocked(cx: number, cz: number): boolean
}

export type Waypoint = { x: number; z: number }

// Sampling step (world units) for the line-of-sight test used by string-pulling.
const LINE_SAMPLE = 0.25

type Cell = { cx: number; cz: number }

function inBounds(grid: GridSpec, cx: number, cz: number): boolean {
  return cx >= grid.minX && cx < grid.maxX && cz >= grid.minZ && cz < grid.maxZ
}

// A cell is impassable if it is outside the grid or reported blocked.
function isBlockedCell(grid: GridSpec, cx: number, cz: number): boolean {
  return !inBounds(grid, cx, cz) || grid.blocked(cx, cz)
}

// Nearest open cell to (cx, cz) within a Chebyshev ring of radius <= 2, chosen by
// squared Euclidean distance. Returns the cell itself if already open, or null
// when nothing open lies within range.
function snapToOpen(grid: GridSpec, cx: number, cz: number): Cell | null {
  if (!isBlockedCell(grid, cx, cz)) return { cx, cz }
  for (let r = 1; r <= 2; r++) {
    let best: Cell | null = null
    let bestD2 = Infinity
    for (let dz = -r; dz <= r; dz++) {
      for (let dx = -r; dx <= r; dx++) {
        if (Math.max(Math.abs(dx), Math.abs(dz)) !== r) continue // ring only
        const nx = cx + dx
        const nz = cz + dz
        if (isBlockedCell(grid, nx, nz)) continue
        const d2 = dx * dx + dz * dz
        if (d2 < bestD2) {
          bestD2 = d2
          best = { cx: nx, cz: nz }
        }
      }
    }
    if (best) return best
  }
  return null
}

const key = (cx: number, cz: number) => `${cx},${cz}`
const manhattan = (ax: number, az: number, bx: number, bz: number) =>
  Math.abs(ax - bx) + Math.abs(az - bz)

// 4-connected A* with a Manhattan heuristic (consistent on a unit grid, so
// closed nodes never need reopening). Plain-array open set — the grid is small
// (room + courtyard, 32x20), so a binary heap buys nothing. Returns the cell
// path start..goal.
function aStar(grid: GridSpec, start: Cell, goal: Cell): Cell[] | null {
  const startKey = key(start.cx, start.cz)
  const goalKey = key(goal.cx, goal.cz)
  const gScore = new Map<string, number>([[startKey, 0]])
  const fScore = new Map<string, number>([
    [startKey, manhattan(start.cx, start.cz, goal.cx, goal.cz)],
  ])
  const cameFrom = new Map<string, Cell>()
  const closed = new Set<string>()
  const open: Cell[] = [start]

  while (open.length > 0) {
    // Lowest-f node in the open set.
    let bestIdx = 0
    let bestF = Infinity
    for (let i = 0; i < open.length; i++) {
      const f = fScore.get(key(open[i].cx, open[i].cz)) ?? Infinity
      if (f < bestF) {
        bestF = f
        bestIdx = i
      }
    }
    const current = open.splice(bestIdx, 1)[0]
    const ck = key(current.cx, current.cz)

    if (ck === goalKey) {
      const path: Cell[] = [current]
      let k = ck
      while (cameFrom.has(k)) {
        const prev = cameFrom.get(k)!
        path.unshift(prev)
        k = key(prev.cx, prev.cz)
      }
      return path
    }

    closed.add(ck)
    const g = gScore.get(ck)!
    const neighbors: Cell[] = [
      { cx: current.cx + 1, cz: current.cz },
      { cx: current.cx - 1, cz: current.cz },
      { cx: current.cx, cz: current.cz + 1 },
      { cx: current.cx, cz: current.cz - 1 },
    ]
    for (const nb of neighbors) {
      const nk = key(nb.cx, nb.cz)
      if (closed.has(nk) || isBlockedCell(grid, nb.cx, nb.cz)) continue
      const tentative = g + 1
      if (tentative < (gScore.get(nk) ?? Infinity)) {
        cameFrom.set(nk, current)
        gScore.set(nk, tentative)
        fScore.set(nk, tentative + manhattan(nb.cx, nb.cz, goal.cx, goal.cz))
        if (!open.some((c) => c.cx === nb.cx && c.cz === nb.cz)) open.push(nb)
      }
    }
  }
  return null
}

// True if the straight segment a->b stays clear of blocked cells, sampled every
// LINE_SAMPLE units. Used to string-pull the grid path into few waypoints.
function lineClear(grid: GridSpec, a: Waypoint, b: Waypoint): boolean {
  const dx = b.x - a.x
  const dz = b.z - a.z
  const steps = Math.max(1, Math.ceil(Math.hypot(dx, dz) / LINE_SAMPLE))
  for (let i = 0; i <= steps; i++) {
    const t = i / steps
    if (isBlockedCell(grid, Math.floor(a.x + dx * t), Math.floor(a.z + dz * t))) {
      return false
    }
  }
  return true
}

// Greedy funnel: keep a waypoint only where the running anchor loses line of
// sight to the next point. Collapses long straight runs to their endpoints.
function stringPull(grid: GridSpec, pts: Waypoint[]): Waypoint[] {
  if (pts.length <= 2) return pts
  const out: Waypoint[] = [pts[0]]
  let anchor = 0
  for (let i = 1; i < pts.length - 1; i++) {
    if (!lineClear(grid, pts[anchor], pts[i + 1])) {
      out.push(pts[i])
      anchor = i
    }
  }
  out.push(pts[pts.length - 1])
  return out
}

// Find a walkable route between two world points. Snaps a blocked start/goal to
// the nearest open cell (ring <= 2); returns world-coord waypoints (cell centers)
// including the adjusted goal, string-pulled — or null if unreachable.
export function findPath(
  grid: GridSpec,
  from: Waypoint,
  to: Waypoint
): Waypoint[] | null {
  const start = snapToOpen(grid, Math.floor(from.x), Math.floor(from.z))
  const goal = snapToOpen(grid, Math.floor(to.x), Math.floor(to.z))
  if (!start || !goal) return null
  const cells = aStar(grid, start, goal)
  if (!cells) return null
  const pts: Waypoint[] = cells.map((c) => ({ x: c.cx + 0.5, z: c.cz + 0.5 }))
  return stringPull(grid, pts)
}
