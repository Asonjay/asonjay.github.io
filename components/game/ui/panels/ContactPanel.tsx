'use client'
import type { WorldData } from '../../../../types/world'
import { UiButton } from '../kit/UiButton'
import {
  MailAt24,
  GoogleScholar24,
  GitHub24,
  Twitter24,
  LinkedIn24,
} from '../../../icons'

// Maps the WorldData social `icon` keys to the existing classic SVG glyphs
// (reused per the global constraint — socials are the one place we do not draw
// new kit icons).
const GLYPH: Record<string, (p: { className?: string }) => JSX.Element> = {
  email: MailAt24,
  scholar: GoogleScholar24,
  github: GitHub24,
  twitter: Twitter24,
  linkedin: LinkedIn24,
}

export function ContactPanel({ data }: { data: WorldData }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {data.social.map(link => {
        const Glyph = GLYPH[link.icon]
        return (
          <UiButton key={link.label} href={link.url} aria-label={link.label}>
            {Glyph ? <Glyph /> : null}
            <span>{link.label}</span>
          </UiButton>
        )
      })}
    </div>
  )
}
