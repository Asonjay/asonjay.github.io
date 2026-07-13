'use client'
import type { WorldData } from '../../../../types/world'
import { PanelMdx } from './panelMdx'

// WorldData carries no name field; the header mirrors the site's sr-only <h1>
// and metadata title.
const NAME = 'Zexin (Jason) Xu'

export function AboutPanel({ data }: { data: WorldData }) {
  return (
    <div>
      <h2
        style={{
          fontFamily: 'var(--font-barlow), sans-serif',
          fontSize: 16,
          fontWeight: 600,
          letterSpacing: '0.01em',
          lineHeight: 1.4,
          color: 'var(--gp-accent-ink)',
          margin: '0 0 14px',
        }}
      >
        {NAME}
      </h2>
      <div style={{ fontSize: 14.5, lineHeight: 1.65 }}>
        <PanelMdx code={data.introCode} />
      </div>
    </div>
  )
}
