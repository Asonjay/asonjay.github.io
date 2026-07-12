import type { Publication } from './publication'

// Frontmatter-only shapes, kept plain and JSON-serializable (ISO date strings)
// so the whole WorldData object can be baked into the static export and handed
// to client components as a prop.
export type ProjectMeta = {
  title: string
  description: string
  year: string
  selected: boolean
}

export type PostMeta = {
  title: string
  slug: string
  publishedAt: string
  readingTimeText: string
}

export type NewsItem = { date: string; code: string }
export type PlaylistTrack = { title: string; artist: string; url?: string }
export type SocialLink = { label: string; url: string; icon: string }
export type Deadline = { name: string; date: string }

// Build-time aggregation of every content source the game panels render. Plain
// JSON only — no functions, no Date instances (see spec §3.3).
export type WorldData = {
  introCode: string
  news: NewsItem[]
  publications: Publication[]
  projects: ProjectMeta[]
  posts: PostMeta[]
  playlist: PlaylistTrack[]
  nextDeadline?: Deadline
  social: SocialLink[]
  cvUrl: string
}
