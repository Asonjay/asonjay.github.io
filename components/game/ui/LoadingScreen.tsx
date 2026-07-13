// Shown while the 3D chunk downloads. Self-contained (hardcoded night colors +
// Barlow) so it renders correctly before the scene and its tokens are ready.
export function LoadingScreen() {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 16,
        background: '#0b0e1a',
      }}
    >
      <span
        style={{
          fontFamily: 'var(--font-barlow), ui-sans-serif, system-ui, sans-serif',
          fontSize: '0.9rem',
          fontWeight: 600,
          letterSpacing: '0.08em',
          color: '#7c9aff',
        }}
      >
        Loading…
      </span>
      {/* Rounded indeterminate track — a soft pulsing fill, still under reduced
          motion (the label + partial fill read as "loading" without animation). */}
      <div
        style={{
          width: 160,
          height: 6,
          borderRadius: 999,
          background: 'rgba(124, 154, 255, 0.18)',
          overflow: 'hidden',
        }}
      >
        <div
          className="animate-pulse motion-reduce:animate-none"
          style={{
            width: '45%',
            height: '100%',
            borderRadius: 999,
            background: '#7c9aff',
          }}
        />
      </div>
    </div>
  )
}
