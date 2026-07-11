export function LoadingScreen() {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#0b0e1a',
      }}
    >
      <span
        className="animate-pulse motion-reduce:animate-none"
        style={{
          fontFamily: 'var(--font-pixel)',
          fontSize: '0.9rem',
          letterSpacing: '0.15em',
          color: '#7c9aff',
        }}
      >
        LOADING...
      </span>
    </div>
  )
}
