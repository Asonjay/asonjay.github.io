'use client'
import { PixelButton } from '../kit/PixelButton'

// Static teaser; the full Life page lives at /life. Takes no props — assignable
// to the registry's ComponentType<{ data }> since it simply ignores them.
export function LifePanel() {
  return (
    <div>
      <p style={{ margin: '0 0 16px', fontSize: 14.5, lineHeight: 1.65 }}>
        Beyond the research desk: photos from the road, films worth rewatching,
        food experiments, and the odd side quest. A look at the parts of life
        that do not fit on a CV.
      </p>
      <PixelButton href="/life" variant="solid">
        Step into Life
      </PixelButton>
    </div>
  )
}
