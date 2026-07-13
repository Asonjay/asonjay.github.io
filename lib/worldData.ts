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
// server components (app/page.tsx and app/(game)/study/page.tsx). The resulting
// WorldData is a plain object threaded to client components as a prop.

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

// Naive MDX -> plain-text reduction for the homepage's crawlable SEO block. It
// feeds crawlers, not humans, so the goal is legible prose, not fidelity: strip
// the frontmatter, import/export lines, JSX/HTML tags and the common markdown
// markers, keep the first couple of paragraphs, and cap the length.
function deriveIntroPlainText(raw: string): string {
  let s = raw.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/, '') // frontmatter block
  s = s
    .split('\n')
    .filter((l) => !/^\s*(import|export)\s/.test(l))
    .join('\n')

  const paras = s
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean)
    .slice(0, 2)
  let text = paras.join(' ')

  text = text.replace(/!\[[^\]]*\]\([^)]*\)/g, '') // images
  text = text.replace(/\[([^\]]+)\]\([^)]*\)/g, '$1') // links -> label
  text = text.replace(/<[^>]+>/g, '') // stray JSX/HTML tags
  text = text.replace(/^#{1,6}\s*/gm, '') // headings
  text = text.replace(/[*_`~]/g, '') // emphasis / code markers
  text = text.replace(/\s+/g, ' ').trim() // collapse whitespace

  if (text.length > 500) {
    text = text.slice(0, 500).replace(/\s+\S*$/, '') + '…'
  }
  return text
}

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

  // Raw read of the same intro source (the bundled `code` above can't be
  // reversed to text) for the crawlable SEO synopsis.
  let introPlainText = ''
  try {
    const introRaw = fs.readFileSync(
      path.join(process.cwd(), 'content/introduction.mdx'),
      'utf8'
    )
    introPlainText = deriveIntroPlainText(introRaw)
  } catch {
    introPlainText = ''
  }

  return {
    introCode: introMdx.code,
    introPlainText,
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
