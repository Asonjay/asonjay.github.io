// Pure resolution/quality budgeting for the voxel scene. No three/react/next
// imports (Global Constraints) — the impure wiring (window size, r3f setDpr,
// drei PerformanceMonitor) lives in VoxelHome.
//
// The only render cost that scales with monitor size is fragment/fill work:
// physical pixels = cssW * cssH * dpr^2. A 4K panel is ~4x the fill of a 1080p
// laptop at the same dpr, which is the source of the large-screen lag. These
// helpers pick the largest device-pixel-ratio that keeps physical pixels within
// a fixed budget, and map a runtime performance factor onto a dpr/shadow tier so
// strong GPUs earn full resolution back and weak ones degrade gracefully.

// Target physical-pixel ceiling (~1440p at dpr 1.12). Tuned so a 4K panel drops
// to roughly half its native fill while 1080p keeps full device dpr.
export const PIXEL_BUDGET = 4_600_000

// Never subsample below this — past it the scene reads as mushy rather than soft.
export const MIN_DPR = 0.75

// Below this performance factor the sun shadow map drops a tier.
const LOW_SHADOW = 1024

const clamp = (v: number, lo: number, hi: number): number => Math.min(Math.max(v, lo), hi)

// Round to 2 decimals so dpr changes are stable, comparable, and don't churn the
// renderer with imperceptible sub-percent adjustments.
const round2 = (v: number): number => Math.round(v * 100) / 100

/** Largest dpr keeping physical pixels within budget, respecting device dpr and cap.
 *  Result clamped to [MIN_DPR, min(deviceDpr, capDpr)], rounded to 2 decimals.
 *  Degenerate sizes (<=0) return min(deviceDpr, capDpr). */
export function effectiveDpr(
  cssW: number,
  cssH: number,
  deviceDpr: number,
  capDpr: number,
  budgetPx: number = PIXEL_BUDGET
): number {
  const cap = Math.min(deviceDpr, capDpr)
  // Pre-layout / hidden viewport: nothing to budget against yet.
  if (cssW <= 0 || cssH <= 0) return cap
  // cssW*cssH*dpr^2 <= budget  =>  dpr <= sqrt(budget / (cssW*cssH)).
  const budgetDpr = Math.sqrt(budgetPx / (cssW * cssH))
  return round2(clamp(budgetDpr, MIN_DPR, cap))
}

/** Map a performance factor (0..1) to a dpr within [minDpr, maxDpr], clamped, 2 decimals. */
export function dprFromFactor(factor: number, minDpr: number, maxDpr: number): number {
  const f = clamp(factor, 0, 1)
  return round2(clamp(minDpr + f * (maxDpr - minDpr), minDpr, maxDpr))
}

/** Shadow tier from factor: factor < 0.5 → 1024, else base. */
export function shadowTier(factor: number, base: number): number {
  return factor < 0.5 ? LOW_SHADOW : base
}
