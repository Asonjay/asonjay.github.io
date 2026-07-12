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
          fontFamily: 'var(--font-pixel), monospace',
          fontSize: 13,
          lineHeight: 1.5,
          color: 'var(--gp-accent)',
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
