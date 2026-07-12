import { describe, it, expect } from 'vitest'
import {
  PIXEL_BUDGET,
  MIN_DPR,
  effectiveDpr,
  dprFromFactor,
  shadowTier,
} from '../../components/game/systems/perfGovernor'

describe('perfGovernor constants', () => {
  it('exposes the pixel budget and dpr floor', () => {
    expect(PIXEL_BUDGET).toBe(4_600_000)
    expect(MIN_DPR).toBe(0.75)
  })
})

describe('effectiveDpr', () => {
  // A 1536x864 laptop (2.07M px) at device 1.25 stays under budget, so the
  // device dpr is the limit, not the budget.
  it('keeps device dpr when the viewport fits the budget (1536x864 @1.25)', () => {
    expect(effectiveDpr(1536, 864, 1.25, 2)).toBe(1.25)
  })

  // 1280x800 at device 2 = 4.10M px, just under budget -> full device dpr.
  it('keeps device dpr just under budget (1280x800 @2)', () => {
    expect(effectiveDpr(1280, 800, 2, 2)).toBe(2)
  })

  // 4K at device 1 wants dpr ~0.745, below the floor -> clamped up to MIN_DPR.
  it('clamps up to the floor on a 4K screen (3840x2160 @1)', () => {
    expect(effectiveDpr(3840, 2160, 1, 2)).toBe(0.75)
  })

  // 1440p at device 2 is budget-limited to ~1.12.
  it('is budget-limited on 1440p (2560x1440 @2)', () => {
    expect(effectiveDpr(2560, 1440, 2, 2)).toBeCloseTo(1.12, 2)
  })

  it('never exceeds the cap even when the device dpr is higher (device 3, cap 2)', () => {
    expect(effectiveDpr(800, 600, 3, 2)).toBe(2)
  })

  it('respects a cap below the device dpr', () => {
    // 800x600 easily fits any budget; the 1.5 cap is the binding limit.
    expect(effectiveDpr(800, 600, 3, 1.5)).toBe(1.5)
  })

  it('honours a custom pixel budget', () => {
    // 1000x1000 at a 1,000,000 budget -> dpr exactly 1.
    expect(effectiveDpr(1000, 1000, 2, 2, 1_000_000)).toBe(1)
  })

  it('returns min(device, cap) for degenerate sizes', () => {
    expect(effectiveDpr(0, 1080, 1, 2)).toBe(1)
    expect(effectiveDpr(-5, 100, 2, 2)).toBe(2)
    expect(effectiveDpr(1920, 0, 1.5, 2)).toBe(1.5)
    expect(effectiveDpr(0, 0, 3, 2)).toBe(2)
  })
})

describe('dprFromFactor', () => {
  it('maps the endpoints to the range bounds', () => {
    expect(dprFromFactor(0, 0.75, 2)).toBe(0.75)
    expect(dprFromFactor(1, 0.75, 2)).toBe(2)
  })

  it('maps the midpoint linearly', () => {
    expect(dprFromFactor(0.5, 0.75, 2)).toBeCloseTo(1.38, 2)
  })

  it('clamps out-of-range factors at both ends', () => {
    expect(dprFromFactor(-1, 0.75, 2)).toBe(0.75)
    expect(dprFromFactor(2, 0.75, 2)).toBe(2)
  })

  it('is monotonic non-decreasing in factor', () => {
    let prev = -Infinity
    for (let f = 0; f <= 1.0001; f += 0.05) {
      const dpr = dprFromFactor(f, 0.75, 2)
      expect(dpr).toBeGreaterThanOrEqual(prev)
      prev = dpr
    }
  })
})

describe('shadowTier', () => {
  it('drops to 1024 below the 0.5 factor', () => {
    expect(shadowTier(0.4, 2048)).toBe(1024)
  })

  it('keeps the base at or above 0.5', () => {
    expect(shadowTier(0.6, 2048)).toBe(2048)
    expect(shadowTier(0.5, 2048)).toBe(2048)
  })

  it('honours a different base tier', () => {
    expect(shadowTier(0.9, 1024)).toBe(1024)
  })
})
