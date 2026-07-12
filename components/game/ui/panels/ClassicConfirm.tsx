'use client'
import { useGameStore } from '../../systems/store'
import { PixelButton } from '../kit/PixelButton'
import { TypewriterText } from '../kit/TypewriterText'

// The trash-can easter egg: a tiny confirm before leaving for the old site.
// Takes no props — assignable to the registry's ComponentType<{ data }>.
export function ClassicConfirm() {
  const openPanel = useGameStore(s => s.openPanel)
  return (
    <div>
      <p style={{ margin: '0 0 16px', fontSize: 15, lineHeight: 1.6, minHeight: '1.6em' }}>
        <TypewriterText text="Dig up the old website?" />
      </p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
        <PixelButton href="/classic" variant="solid">
          Visit /classic
        </PixelButton>
        <PixelButton onClick={() => openPanel(null)}>Close</PixelButton>
      </div>
    </div>
  )
}
