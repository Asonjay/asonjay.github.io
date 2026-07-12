// Dashed pixel rule for separating panel sections.
export function PixelDivider({ className }: { className?: string }) {
  return (
    <div
      role="separator"
      aria-orientation="horizontal"
      className={className}
      style={{
        height: 2,
        margin: '12px 0',
        opacity: 0.55,
        background:
          'repeating-linear-gradient(90deg, var(--gp-border) 0 6px, transparent 6px 10px)',
      }}
    />
  )
}
