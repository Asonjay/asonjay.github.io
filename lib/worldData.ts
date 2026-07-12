import fs from 'fs'
import path from 'path'
import yaml from 'js-yaml'
import {
  getAllNews,
  getMdxByPath,
  getProjects,
  getAllFrontMatters,
} from './mdx'
import { getAllPublications } from './publications'
import type {
  WorldData,
  ProjectMeta,
  PostMeta,
  PlaylistTrack,
  SocialLink,
  Deadline,
} from '../types/world'

// This module does fs reads and MDX bundling — it must only ever be imported by
// the server component app/(game)/page.tsx. The resulting WorldData is a plain
// object threaded to client components as a prop.

const CV_URL = '/cv/Zexin_Xu_CV.pdf'

// The five links hardcoded on the classic homepage. `icon` is a string key the
// ContactPanel maps to an SVG glyph from components/icons.tsx.
const SOCIAL: SocialLink[] = [
  { label: 'Email', url: 'mailto:zexin.xu@utdallas.edu', icon: 'email' },
  {
    label: 'Google Scholar',
    url: 'https://scholar.google.com/citations?user=NvnoD1kAAAAJ&hl=en',
    icon: 'scholar',
  },
  { label: 'GitHub', url: 'https://github.com/asonjay', icon: 'github' },
  { label: 'Twitter/X', url: 'https://x.com/zexin_jason_xu', icon: 'twitter' },
  { label: 'LinkedIn', url: 'https://www.linkedin.com/in/zexin-xu/', icon: 'linkedin' },
]

function parsePlaylist(md: string): PlaylistTrack[] {
  return md
    .split('\n')
    .map(l => l.match(/^-\s*(.+?)\s*\|\s*(.+?)\s*\|\s*(\S+)\s*$/))
    .filter((m): m is RegExpMatchArray => !!m)
    .map(m => ({ title: m[1], artist: m[2], url: m[3] }))
}

// custom.yaml ships empty (comments only) today, so this normally yields
// undefined. The schema is unspecified upstream, so parse defensively: accept a
// list of objects carrying a name-ish and a date-ish field, skip anything that
// doesn't parse, and pick the soonest entry not already past the build date.
function parseNextDeadline(buildTime: number): Deadline | undefined {
  let raw: string
  try {
    raw = fs.readFileSync(
      path.join(process.cwd(), 'content/deadlines/custom.yaml'),
      'utf8'
    )
  } catch {
    return undefined
  }

  let doc: unknown
  try {
    doc = yaml.load(raw)
  } catch {
    return undefined
  }
  if (!Array.isArray(doc)) return undefined

  const upcoming: Deadline[] = []
  for (const entry of doc) {
    if (!entry || typeof entry !== 'object') continue
    const e = entry as Record<string, unknown>
    const name = e.name ?? e.title ?? e.conference
    const rawDate = e.deadline ?? e.date ?? e.abstract_deadline ?? e.due
    if (typeof name !== 'string' || typeof rawDate !== 'string') continue
    const when = new Date(rawDate)
    const t = when.getTime()
    if (Number.isNaN(t) || t < buildTime) continue
    upcoming.push({ name, date: when.toISOString() })
  }

  upcoming.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  return upcoming[0]
}

export async function getWorldData(): Promise<WorldData> {
  // Build-time constant, pinned by next.config.js so server and client agree.
  const buildTime = new Date(
    process.env.NEXT_PUBLIC_BUILD_DATE || new Date().toISOString()
  ).getTime()

  const [introMdx, newsRaw, publications, projectsRaw, frontmatters] =
    await Promise.all([
      getMdxByPath('content/introduction.mdx'),
      getAllNews(),
      getAllPublications(),
      getProjects(),
      getAllFrontMatters(),
    ])

  const news = newsRaw.map(n => ({
    date: String(n.frontmatter.publishedAt),
    code: n.code,
  }))

  const projects: ProjectMeta[] = projectsRaw.map(p => ({
    title: p.title,
    description: p.description ?? '',
    year: p.year,
    selected: Boolean(p.selected),
  }))

  const posts: PostMeta[] = frontmatters.map(f => ({
    title: f.title,
    slug: f.slug,
    publishedAt: f.publishedAt,
    readingTimeText: f.readingTime?.text ?? '',
  }))

  let playlist: PlaylistTrack[] = []
  try {
    const md = fs.readFileSync(
      path.join(process.cwd(), 'content/playlist.md'),
      'utf8'
    )
    playlist = parsePlaylist(md)
  } catch {
    playlist = []
  }

  return {
    introCode: introMdx.code,
    news,
    publications,
    projects,
    posts,
    playlist,
    nextDeadline: parseNextDeadline(buildTime),
    social: SOCIAL,
    cvUrl: CV_URL,
  }
}
