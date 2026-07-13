'use client'
import { UiButton } from './kit/UiButton'

// Terminal fallback shown when the 3D scene fails to mount (render error caught
// by the boundary) or the WebGL context is lost. Kit-styled so it matches the
// game chrome; the only way forward is the classic site.
export function GameErrorCard() {
  return (
    <div
      role="alert"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 60,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
        background: 'rgba(0, 0, 0, 0.5)',
      }}
    >
      <div
        className="gp-corners-lg gp-surface"
        style={{ width: '100%', maxWidth: '28rem', padding: '22px 20px', textAlign: 'center' }}
      >
        <h2
          style={{
            fontFamily: 'var(--font-barlow), sans-serif',
            fontSize: 16,
            fontWeight: 600,
            letterSpacing: '0.01em',
            lineHeight: 1.4,
            color: 'var(--gp-accent-ink)',
            margin: '0 0 12px',
          }}
        >
          {"The 3D room couldn't load."}
        </h2>
        <p
          style={{
            fontFamily: 'var(--font-barlow), sans-serif',
            fontSize: 14.5,
            lineHeight: 1.6,
            color: 'var(--gp-text)',
            margin: '0 0 18px',
          }}
        >
          {"Your device may not support WebGL — you can still explore everything on the classic site."}
        </p>
        <UiButton href="/classic" variant="solid">
          Go to the classic site
        </UiButton>
      </div>
    </div>
  )
}
