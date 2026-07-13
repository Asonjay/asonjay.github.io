import type { ComponentType } from 'react'
import type { SocialLink } from '../../../types/world'
import { TileCard } from '../TileCard'
import { MailAt24, GoogleScholar24, GitHub24, Twitter24, LinkedIn24 } from '../../icons'

// Maps the SocialLink.icon key (baked in lib/worldData) to a components/icons
// glyph. Icons render at their native 24px inside the 40px buttons and inherit
// the button's color, so hover recolors them.
const ICONS: Record<string, ComponentType<{ className?: string }>> = {
  email: MailAt24,
  scholar: GoogleScholar24,
  github: GitHub24,
  twitter: Twitter24,
  linkedin: LinkedIn24,
}

// Contact (desktop col-3). The five social links as icon buttons (mailto
// included). Reuses the site's existing social SVG glyphs.
export function ContactTile({ social }: { social: SocialLink[] }) {
  return (
    <TileCard area="contact" label="Contact">
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {social.map((link) => {
          const Icon = ICONS[link.icon]
          if (!Icon) return null
          const external = /^https?:/.test(link.url)
          return (
            <a
              key={link.label}
              href={link.url}
              aria-label={link.label}
              title={link.label}
              target={external ? '_blank' : undefined}
              rel={external ? 'noopener noreferrer' : undefined}
              className="home-corners home-lift home-icon-btn"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 40,
                height: 40,
                color: 'var(--home-text)',
                background: 'var(--home-bg)',
                border: '1px solid var(--home-border)',
              }}
            >
              <Icon className="!w-5 !h-5" />
            </a>
          )
        })}
      </div>
    </TileCard>
  )
}
