import type { Publication } from '../../types/publication'
import type { NewsItem, PlaylistTrack, SocialLink } from '../../types/world'

// Trimmed publication for the homepage's selected-pubs tile: only the fields the
// row renders. Dropping authors/abstract/bibtex keeps the client payload lean
// (those strings are large and unused here).
export type HomePub = Pick<
  Publication,
  'title' | 'venue' | 'year' | 'pdf' | 'doi' | 'code' | 'url'
>

// The lean slice of WorldData handed to the client grid. app/page.tsx builds
// this on the server from getWorldData() so the full world object (every
// publication, all news, projects, posts, deadlines) never serializes into the
// static HTML. Add a field here only when a tile actually renders it.
export type HomePayload = {
  // 1–2 sentence bio, derived on the server from the real intro content.
  bio: string
  cvUrl: string
  // mailto: URL for the identity card's Email button.
  email: string
  selectedPublications: HomePub[]
  // Latest few news items (date + bundled mdx code), newest first.
  news: NewsItem[]
  projectCount: number
  postCount: number
  playlist: PlaylistTrack[]
  social: SocialLink[]
}
