'use client'
import type { HomePayload } from './types'
import { HomeNav } from './HomeNav'
import { HomeFooter } from './HomeFooter'
import { HomeMotionProvider, MotionTile } from './motion'
import { IdentityCard } from './tiles/IdentityCard'
import { GameTile } from './tiles/GameTile'
import { PublicationsTile } from './tiles/PublicationsTile'
import { NewsTile } from './tiles/NewsTile'
import { LinkStatTile } from './tiles/LinkStatTile'
import { MusicTile } from './tiles/MusicTile'
import { ContactTile } from './tiles/ContactTile'

// framer renders initial="hidden" (opacity:0) into the static HTML on every
// .home-anim wrapper. With JS disabled nothing animates them back, so this
// !important override (higher priority than framer's inline style) forces the
// full page visible for no-JS / prerender crawlers. Covers every animated
// wrapper: the bento tiles AND the nav's inner motion row.
const NOSCRIPT_CSS = '.home-anim{opacity:1!important;transform:none!important}'

// The client bento grid + animation layer. Children render in mobile reading
// order (identity → pubs → news → game → projects → blog → music → contact); the
// home-area-* classes on the MotionTile wrappers reposition them into the 2-col
// (md) and 12-col (lg) bentos. Each wrapper owns ONLY the entrance/reveal
// transform; the inner tiles keep their Task-13 CSS hover lift untouched.
//
// Cascade delays follow VISUAL order, not DOM order: identity (0.05) → game
// (0.10) → pubs (0.15) → news (0.20) animate on mount; the bottom strip
// (projects/blog/music/contact) reveals on scroll-in, cascading left→right.
export function HomeShell({ payload }: { payload: HomePayload }) {
  return (
    <div className="home-ui">
      <noscript>
        <style>{NOSCRIPT_CSS}</style>
      </noscript>

      {/* Ambient background drift — CSS-only, decorative, pinned behind content
          (z-index:0 under .home-content's z-index:1). pointer-events:none. */}
      <div className="home-blobs" aria-hidden="true">
        <span className="home-blob home-blob-a" />
        <span className="home-blob home-blob-b" />
        <span className="home-blob home-blob-c" />
      </div>

      <HomeMotionProvider>
        <div className="home-content">
          <HomeNav />
          <main className="mx-auto" style={{ maxWidth: 1100, padding: '20px 16px 8px' }}>
            <div className="home-grid">
              <MotionTile area="identity" delay={0.05}>
                <IdentityCard bio={payload.bio} cvUrl={payload.cvUrl} email={payload.email} />
              </MotionTile>
              <MotionTile area="pubs" delay={0.15}>
                <PublicationsTile publications={payload.selectedPublications} />
              </MotionTile>
              <MotionTile area="news" delay={0.2}>
                <NewsTile news={payload.news} />
              </MotionTile>
              <MotionTile area="game" delay={0.1}>
                <GameTile />
              </MotionTile>
              <MotionTile area="projects" delay={0} reveal>
                <LinkStatTile
                  area="projects"
                  label="Projects"
                  count={payload.projectCount}
                  singular="project"
                  plural="projects"
                  href="/projects"
                />
              </MotionTile>
              <MotionTile area="blog" delay={0.05} reveal>
                <LinkStatTile
                  area="blog"
                  label="Blog"
                  count={payload.postCount}
                  singular="post"
                  plural="posts"
                  href="/blog"
                />
              </MotionTile>
              <MotionTile area="music" delay={0.1} reveal>
                <MusicTile playlist={payload.playlist} />
              </MotionTile>
              <MotionTile area="contact" delay={0.15} reveal>
                <ContactTile social={payload.social} />
              </MotionTile>
            </div>
          </main>
          <HomeFooter />
        </div>
      </HomeMotionProvider>
    </div>
  )
}
