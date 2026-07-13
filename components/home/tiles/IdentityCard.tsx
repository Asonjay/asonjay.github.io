import Image from 'next/image'
import avatar from 'public/images/profile-img.jpeg'
import { TileCard } from '../TileCard'
import { HomeButton } from '../HomeButton'

// Identity hero (desktop col-7). Avatar + name (the page's single <h1>), a
// one-line role, a short bio sourced from the real intro content, and the two
// primary CTAs (CV download, email). Role/name strings are static; the bio is
// data-derived and passed in.
export function IdentityCard({ bio, cvUrl, email }: { bio: string; cvUrl: string; email: string }) {
  return (
    <TileCard area="identity" pad={20}>
      <div style={{ display: 'flex', gap: 18, alignItems: 'flex-start' }}>
        <div
          className="home-avatar-ring"
          style={{ flexShrink: 0, width: 96, height: 96 }}
        >
          <Image
            src={avatar}
            alt="Zexin (Jason) Xu"
            width={192}
            height={192}
            quality={90}
            priority
            placeholder="blur"
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <h1
            style={{
              margin: 0,
              fontSize: 24,
              fontWeight: 700,
              lineHeight: 1.15,
              letterSpacing: '-0.01em',
              color: 'var(--home-text)',
            }}
          >
            Zexin (Jason) Xu
          </h1>
          <p
            style={{
              margin: '6px 0 0',
              fontSize: 13.5,
              fontWeight: 600,
              lineHeight: 1.4,
              color: 'var(--home-accent-ink)',
            }}
          >
            PhD student @ UT Dallas · multimodal agents (advisor Dr. Yapeng Tian)
          </p>
        </div>
      </div>

      <p
        className="text-sm sm:text-base"
        style={{ margin: '14px 0 0', lineHeight: 1.6, opacity: 0.88, color: 'var(--home-text)' }}
      >
        {bio}
      </p>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 16 }}>
        <HomeButton href={cvUrl} download variant="solid" title="Download CV (PDF)">
          Download CV
        </HomeButton>
        <HomeButton href={email} variant="ghost" aria-label="Email Zexin (Jason) Xu">
          Email
        </HomeButton>
      </div>
    </TileCard>
  )
}
