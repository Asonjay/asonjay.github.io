// Single shared prefers-reduced-motion signal, read every frame by the player,
// furniture, dust and highlight loops. One matchMedia listener for the whole
// game instead of one per component. Browser-only; SSR-safe default is false.

export const reducedMotionRef = { current: false }

if (typeof window !== 'undefined' && typeof window.matchMedia === 'function') {
  const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
  reducedMotionRef.current = mq.matches
  mq.addEventListener('change', () => {
    reducedMotionRef.current = mq.matches
  })
}
