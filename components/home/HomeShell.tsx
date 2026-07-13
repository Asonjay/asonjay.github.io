'use client'
import type { HomePayload } from './types'
import { HomeNav } from './HomeNav'
import { HomeFooter } from './HomeFooter'
import { IdentityCard } from './tiles/IdentityCard'
import { GameTile } from './tiles/GameTile'
import { PublicationsTile } from './tiles/PublicationsTile'
import { NewsTile } from './tiles/NewsTile'
import { LinkStatTile } from './tiles/LinkStatTile'
import { MusicTile } from './tiles/MusicTile'
import { ContactTile } from './tiles/ContactTile'

// The client bento grid. Children render in mobile reading order (identity →
// pubs → news → game → projects → blog → music → contact); home-tokens.css grid
// areas reposition them into the 2-col (md) and 12-col (lg) bentos. This is the
// component Task 14 will wrap in the framer-motion animation layer.
export function HomeShell({ payload }: { payload: HomePayload }) {
  return (
    <div className="home-ui">
      <HomeNav />
      <main className="mx-auto" style={{ maxWidth: 1100, padding: '20px 16px 8px' }}>
        <div className="home-grid">
          <IdentityCard bio={payload.bio} cvUrl={payload.cvUrl} email={payload.email} />
          <PublicationsTile publications={payload.selectedPublications} />
          <NewsTile news={payload.news} />
          <GameTile />
          <LinkStatTile
            area="projects"
            label="Projects"
            count={payload.projectCount}
            singular="project"
            plural="projects"
            href="/projects"
          />
          <LinkStatTile
            area="blog"
            label="Blog"
            count={payload.postCount}
            singular="post"
            plural="posts"
            href="/blog"
          />
          <MusicTile playlist={payload.playlist} />
          <ContactTile social={payload.social} />
        </div>
      </main>
      <HomeFooter />
    </div>
  )
}
